import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
const SERVICE_UNAVAILABLE_MESSAGE = '小安暂时无法提供服务，请稍后重试'

test.skip(!process.env.CLERK_E2E_STORAGE_STATE, 'Requires a configured Clerk test account and authenticated storage state')
test.use({ storageState: process.env.CLERK_E2E_STORAGE_STATE })

interface TestTurn {
  user: string
  assistant: string
  route_id: string
  safety_level: string
}

interface TestStream {
  conversationId: string
  responseId: string
  body: { message: string }
  controller: ReadableStreamDefaultController<Uint8Array>
  signal?: AbortSignal | null
}

declare global {
  interface Window {
    chatFixture: {
      creates: number
      currentId: string | null
      history: Record<string, TestTurn[]>
      streams: TestStream[]
      responseRequests: string[]
    }
  }
}

test.use({
  baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:3107',
  viewport: { width: 1280, height: 900 },
})

const question = '这是一条等待重试的原始问题'
const partial = '这是一段未完成的回答'
const answer = '这是完整的正常回复'

test.beforeEach(async ({ page }) => {
  await page.route('**/*', (route) => {
    const origin = new URL(process.env.TEST_BASE_URL || 'http://127.0.0.1:3107').origin
    return new URL(route.request().url()).origin === origin ? route.continue() : route.abort()
  })
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window)
    const fixture: Window['chatFixture'] = {
      creates: 0,
      currentId: null,
      history: {},
      streams: [],
      responseRequests: [],
    }
    window.chatFixture = fixture
    window.fetch = async (input, init) => {
      const path = new URL(String(input), location.origin).pathname
      if (!path.startsWith('/v1/'))
        { return originalFetch(input, init) }
      if (path.includes('/responses'))
        { fixture.responseRequests.push(path) }
      if (path === '/v1/conversations' && init?.method === 'POST') {
        fixture.currentId = `conversation-${++fixture.creates}`
        fixture.history[fixture.currentId] = []
        return Response.json({ conversation_id: fixture.currentId })
      }
      if (path.endsWith('/responses/stream')) {
        const conversationId = path.split('/')[3]
        const responseId = `response-${fixture.streams.length + 1}`
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            fixture.streams.push({
              conversationId,
              responseId,
              body: JSON.parse(init?.body as string),
              controller,
              signal: init?.signal,
            })
          },
        })
        return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
      }
      if (path.startsWith('/v1/conversations/')) {
        const id = path.endsWith('/current') ? fixture.currentId : path.split('/')[3]
        if (!id)
          { return Response.json({ detail: 'not found' }, { status: 404 }) }
        return Response.json({ conversation_id: id, turns: fixture.history[id] || [] })
      }
      return Response.json({ detail: 'not found' }, { status: 404 })
    }
  })
  await page.goto('/chat')
  await expect(page.getByRole('textbox')).toBeVisible()
})

async function send(page: Page, text = question, count = 1) {
  await page.getByRole('textbox').fill(text)
  await page.getByRole('textbox').press('Enter')
  await expect.poll(() => page.evaluate(() => window.chatFixture.streams.length)).toBe(count)
}

async function emit(page: Page, index: number, name: string, payload: Record<string, unknown> = {}) {
  await page.evaluate(({ index, name, payload }) => {
    const stream = window.chatFixture.streams[index]
    const data = {
      conversation_id: stream.conversationId,
      response_id: stream.responseId,
      ...payload,
    }
    stream.controller.enqueue(new TextEncoder().encode(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`))
  }, { index, name, payload })
}

async function fail(page: Page, index = 0) {
  await emit(page, index, 'error', {
    code: 'service_unavailable',
    message: 'raw provider diagnostic',
    retryable: true,
  })
  await expect(page.getByTestId('chat-service-error')).toBeVisible()
}

async function finish(page: Page, index = 0, text = answer) {
  await emit(page, index, 'start')
  await emit(page, index, 'delta', { delta: text })
  await page.evaluate(({ index, text }) => {
    const stream = window.chatFixture.streams[index]
    window.chatFixture.history[stream.conversationId].push({
      user: stream.body.message,
      assistant: text,
      route_id: 'baseline',
      safety_level: 'UNCLEAR',
    })
  }, { index, text })
  await emit(page, index, 'completed')
  await expect(page.getByRole('button', { name: '停止生成', exact: true })).toHaveCount(0)
}

for (const hasPartial of [false, true]) {
  test(`service error ${hasPartial ? 'after' : 'before'} delta is outside assistant bubbles`, async ({ page }) => {
    await send(page)
    await emit(page, 0, 'start')
    if (hasPartial) {
      await emit(page, 0, 'delta', { delta: partial })
      await expect(page.getByText(partial, { exact: true })).toBeVisible()
    }
    await fail(page)
    await expect(page.getByText(SERVICE_UNAVAILABLE_MESSAGE, { exact: true })).toHaveCount(1)
    await expect(page.locator('[class*="answerWrap"]').filter({ hasText: SERVICE_UNAVAILABLE_MESSAGE })).toHaveCount(0)
    await expect(page.getByText(partial, { exact: true })).toHaveCount(0)
    await expect(page.getByText('raw provider diagnostic')).toHaveCount(0)
    await expect(page.getByRole('button', { name: '重试', exact: true })).toBeEnabled()
    expect(await page.evaluate(() => window.chatFixture.streams.length)).toBe(1)
    expect(await page.evaluate(() => window.chatFixture.responseRequests))
      .toEqual(['/v1/conversations/conversation-1/responses/stream'])
  })
}

test('double-click retry reuses the original question and conversation, with one saved turn', async ({ page }) => {
  await send(page)
  await emit(page, 0, 'start')
  await emit(page, 0, 'delta', { delta: partial })
  await fail(page)
  await page.getByRole('button', { name: '重试', exact: true }).evaluate((button) => {
    (button as HTMLButtonElement).click()
    ;(button as HTMLButtonElement).click()
  })
  await expect.poll(() => page.evaluate(() => window.chatFixture.streams.length)).toBe(2)
  await finish(page, 1)
  await expect(page.getByTestId('chat-service-error')).toHaveCount(0)
  await expect(page.locator('[class*="question"]').getByText(question, { exact: true })).toHaveCount(1)
  await expect(page.getByText(answer, { exact: true })).toHaveCount(1)
  await expect(page.getByText(partial, { exact: true })).toHaveCount(0)
  expect(await page.evaluate(() => ({
    creates: window.chatFixture.creates,
    messages: window.chatFixture.streams.map(stream => stream.body.message),
    history: window.chatFixture.history['conversation-1'].length,
  }))).toEqual({ creates: 1, messages: [question, question], history: 1 })
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toContain(question)
})

test('cancel removes partial output and ignores a late error without offering retry', async ({ page }) => {
  await send(page)
  await emit(page, 0, 'start')
  await emit(page, 0, 'delta', { delta: partial })
  await expect(page.getByText(partial, { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '停止生成', exact: true }).click()
  await emit(page, 0, 'error', { code: 'service_unavailable' })
  await expect(page.getByText(partial, { exact: true })).toHaveCount(0)
  await expect(page.getByTestId('chat-service-error')).toHaveCount(0)
  await send(page, '取消后的新问题', 2)
  await finish(page, 1)
  await expect(page.getByText(answer, { exact: true })).toHaveCount(1)
})

test('new chat clears a failed request instead of retrying it in the new conversation', async ({ page }) => {
  await send(page)
  await emit(page, 0, 'start')
  await fail(page)
  await page.getByText('新对话').click()
  await expect(page.getByTestId('chat-service-error')).toHaveCount(0)
  await send(page, '新的对话问题', 2)
  await finish(page, 1)
  expect(await page.evaluate(() => window.chatFixture.streams.map(stream => stream.conversationId)))
    .toEqual(['conversation-1', 'conversation-2'])
  await expect(page.getByText(question, { exact: true })).toHaveCount(0)
})

test('new chat during streaming ignores late data and completion from the old request', async ({ page }) => {
  await send(page)
  await emit(page, 0, 'start')
  await emit(page, 0, 'delta', { delta: partial })
  await page.getByText('新对话').click()
  await emit(page, 0, 'completed')
  await expect(page.getByText(partial, { exact: true })).toHaveCount(0)
  await expect(page.getByTestId('chat-service-error')).toHaveCount(0)
  await send(page, '新页面上的问题', 2)
  await finish(page, 1)
  expect(await page.evaluate(() => window.chatFixture.streams.map(stream => stream.conversationId)))
    .toEqual(['conversation-1', 'conversation-2'])
})

test('truncated stream removes partial content and offers explicit retry', async ({ page }) => {
  await send(page)
  await emit(page, 0, 'start')
  await emit(page, 0, 'delta', { delta: partial })
  await page.evaluate(() => window.chatFixture.streams[0].controller.close())
  await expect(page.getByTestId('chat-service-error')).toBeVisible()
  await expect(page.getByText(partial, { exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '重试', exact: true })).toBeEnabled()
})

test('a genuine UNCLEAR response remains an ordinary successful assistant message', async ({ page }) => {
  const clarification = '我还不确定你现在是否安全，可以多说一点吗？'
  await send(page)
  await finish(page, 0, clarification)
  await expect(page.getByText(clarification, { exact: true })).toHaveCount(1)
  await expect(page.getByTestId('chat-service-error')).toHaveCount(0)
  expect(await page.evaluate(() => window.chatFixture.history['conversation-1'][0].safety_level)).toBe('UNCLEAR')
})

for (const [status, message] of [
  [403, '调试功能未开启，请关闭调试后再发送'],
  [422, '模型配置无效，请选择可用模型'],
] as const) {
  test(`HTTP ${status} shows its request error with no service-unavailable banner or retry`, async ({ page }) => {
    await page.evaluate(({ status, message }) => {
      const mockFetch = window.fetch
      window.fetch = async (input, init) => {
        const path = new URL(String(input), location.origin).pathname
        if (path.includes('/responses')) {
          window.chatFixture.responseRequests.push(path)
          return Response.json({ detail: message }, { status })
        }
        return mockFetch(input, init)
      }
    }, { status, message })
    await page.getByRole('textbox').fill(question)
    await page.getByRole('textbox').press('Enter')
    await expect(page.getByText(message, { exact: true })).toBeVisible()
    await expect(page.getByTestId('chat-service-error')).toHaveCount(0)
    await expect(page.getByText(SERVICE_UNAVAILABLE_MESSAGE, { exact: true })).toHaveCount(0)
    await expect(page.getByRole('button', { name: '重试', exact: true })).toHaveCount(0)
    await expect(page.getByRole('button', { name: '停止生成', exact: true })).toHaveCount(0)
    await expect(page.locator('[class*="question"]').getByText(question, { exact: true })).toHaveCount(0)
    expect(await page.evaluate(() => window.chatFixture.responseRequests))
      .toEqual(['/v1/conversations/conversation-1/responses/stream'])
  })
}
