import { expect, test } from '@playwright/test'
import { apiRequest, SERVICE_UNAVAILABLE_MESSAGE, streamSSE } from '@/service/base'
import { sendChatMessage } from '@/service'
import type { SendChatBody } from '@/service'

const identity = { conversation_id: 'conversation-1', response_id: 'response-1' }
const originalMessage = '我想了解怎么保护自己'
const start = event('start')
const delta = event('delta', { delta: '不完整的回复' })
const completed = event('completed')
const originalFetch = globalThis.fetch
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')

function event(name: string, payload: Record<string, unknown> = {}) {
  return `event: ${name}\ndata: ${JSON.stringify({ ...identity, ...payload })}\n\n`
}

function stream(body: string) {
  return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
}

function capture() {
  const errors: { message: string, code?: string }[] = []
  const deltas: string[] = []
  let completedCount = 0
  let controller: AbortController | undefined
  let conversationId: string | undefined
  return {
    errors,
    deltas,
    get completedCount() { return completedCount },
    get controller() { return controller },
    get conversationId() { return conversationId },
    handlers: {
      onConversationCreated(id: string) { conversationId = id },
      onData(text: string) { deltas.push(text) },
      onCompleted() { completedCount += 1 },
      onError(message: string, code?: string) { errors.push({ message, code }) },
      getAbortController(value: AbortController) { controller = value },
    },
  }
}

function mockResponses(responses: (Response | Error)[]) {
  const requests: { url: string, init?: RequestInit }[] = []
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), init })
    const response = responses.shift()
    if (!response)
      { throw new Error('Unexpected extra generation request') }
    if (response instanceof Error)
      { throw response }
    return response
  }
  return requests
}

const body: SendChatBody = { query: originalMessage, conversation_id: identity.conversation_id }
const expectedError = [{ message: SERVICE_UNAVAILABLE_MESSAGE, code: 'service_unavailable' }]

test.beforeEach(() => {
  Object.defineProperty(globalThis, 'window', { configurable: true, value: globalThis })
})

test.afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalWindow)
    { Object.defineProperty(globalThis, 'window', originalWindow) }
  else
    { Reflect.deleteProperty(globalThis, 'window') }
})

for (const code of ['service_unavailable', 'generation_failed']) {
  for (const partial of ['', delta]) {
    test(`SSE ${code} ${partial ? 'after' : 'before'} delta is terminal and hides provider details`, async () => {
      const requests = mockResponses([stream(start + partial + event('error', {
        code,
        message: 'provider secret diagnostic',
        retryable: true,
        debug: { unsafe: 'must not be rendered' },
      }) + completed)])
      const result = capture()
      await sendChatMessage(body, result.handlers)
      expect(result.errors).toEqual(expectedError)
      expect(result.completedCount).toBe(0)
      expect(requests).toHaveLength(1)
      expect(result.deltas).toEqual(partial ? ['不完整的回复'] : [])
    })
  }
}

for (const wire of [
  start,
  start + delta,
  `${start}${delta}event: completed\ndata: {"conversation_id":`,
  start + delta + completed.trimEnd(),
]) {
  test(`missing completed/truncated SSE fails without JSON fallback: ${wire.length}`, async () => {
    const requests = mockResponses([stream(wire)])
    const result = capture()
    await sendChatMessage(body, result.handlers)
    expect(result.errors).toEqual(expectedError)
    expect(result.completedCount).toBe(0)
    expect(requests).toHaveLength(1)
  })
}

for (const status of [408, 500, 502, 503, 504]) {
  test(`proxy HTTP ${status} is a safe retryable service failure`, async () => {
    const requests = mockResponses([new Response('raw upstream error', { status })])
    const result = capture()
    await sendChatMessage(body, result.handlers)
    expect(result.errors).toEqual(expectedError)
    expect(result.completedCount).toBe(0)
    expect(requests).toHaveLength(1)
  })
}

for (const [status, message] of [
  [403, '调试功能未开启，请关闭调试后再发送'],
  [422, '模型配置无效，请选择可用模型'],
] as const) {
  test(`HTTP ${status} remains a request error without outage classification or fallback`, async () => {
    const requests = mockResponses([Response.json({ detail: message }, { status })])
    const result = capture()
    await sendChatMessage(body, result.handlers)
    expect(result.errors).toEqual([{ message, code: 'request_error' }])
    expect(result.deltas).toEqual([])
    expect(result.completedCount).toBe(0)
    expect(requests).toHaveLength(1)
  })
}

test('expired conversation HTTP 404 after JSON fallback remains a session error', async () => {
  const message = '会话已失效，请新建对话'
  const requests = mockResponses([
    new Response(null, { status: 404 }),
    Response.json({ detail: message }, { status: 404 }),
  ])
  const result = capture()
  await sendChatMessage(body, result.handlers)
  expect(result.errors).toEqual([{ message, code: 'request_error' }])
  expect(result.deltas).toEqual([])
  expect(result.completedCount).toBe(0)
  expect(requests).toHaveLength(2)
})

test('FastAPI structured validation errors do not expose rejected input or become outages', async () => {
  mockResponses([Response.json({
    detail: [{ loc: ['body', 'message'], msg: 'String should have at least 1 character', input: 'private input' }],
  }, { status: 422 })])
  const result = capture()
  await sendChatMessage(body, result.handlers)
  expect(result.errors).toEqual([{ message: '请求失败 (422)', code: 'request_error' }])
})

test('network exception is a service failure, without another generation', async () => {
  const requests = mockResponses([new TypeError('fetch failed: provider hostname')])
  const result = capture()
  await sendChatMessage(body, result.handlers)
  expect(result.errors).toEqual(expectedError)
  expect(requests).toHaveLength(1)
})

test('unsupported streaming falls back once; FastAPI JSON 503 stays an error', async () => {
  const unavailable = {
    detail: { code: 'service_unavailable', message: 'provider diagnostic', retryable: true, debug: {} },
  }
  const requests = mockResponses([
    new Response(null, { status: 404 }),
    Response.json(unavailable, { status: 503 }),
  ])
  const result = capture()
  await sendChatMessage(body, result.handlers)
  expect(result.errors).toEqual(expectedError)
  expect(result.deltas).toEqual([])
  expect(result.completedCount).toBe(0)
  expect(requests.map(request => request.url)).toEqual([
    '/v1/conversations/conversation-1/responses/stream',
    '/v1/conversations/conversation-1/responses',
  ])
})

test('apiRequest recognizes structured FastAPI errors and does not surface debug', async () => {
  mockResponses([Response.json({
    detail: { code: 'service_unavailable', message: 'provider diagnostic', retryable: true, debug: {} },
  }, { status: 503 })])
  await expect(apiRequest('/conversations/conversation-1/responses')).rejects.toMatchObject({
    status: 503,
    code: 'service_unavailable',
    message: SERVICE_UNAVAILABLE_MESSAGE,
  })
})

test('explicit retry reuses the created conversation and original query', async () => {
  const requests = mockResponses([
    Response.json({ conversation_id: identity.conversation_id }),
    new Response(null, { status: 503 }),
    stream(start + delta + completed),
  ])
  const first = capture()
  await sendChatMessage({ query: originalMessage }, first.handlers)
  expect(first.errors).toEqual(expectedError)
  const retry = capture()
  await sendChatMessage({ query: originalMessage, conversation_id: first.conversationId }, retry.handlers)
  expect(requests).toHaveLength(3)
  expect(requests.filter(request => request.url === '/v1/conversations')).toHaveLength(1)
  expect(JSON.parse(requests[1].init?.body as string).message).toBe(originalMessage)
  expect(requests[2].init?.body).toBe(requests[1].init?.body)
  expect(retry.completedCount).toBe(1)
  expect(retry.errors).toEqual([])
})

test('cancel before creation does not issue any request', async () => {
  const requests = mockResponses([])
  const result = capture()
  await sendChatMessage({ query: originalMessage }, {
    ...result.handlers,
    getAbortController(controller) { controller.abort() },
  })
  expect(requests).toEqual([])
  expect(result.errors).toEqual([{ message: '已停止生成', code: 'aborted' }])
})

test('cancel after start suppresses buffered deltas, completed and fallback', async () => {
  const requests = mockResponses([stream(start + delta + completed)])
  const result = capture()
  await sendChatMessage(body, {
    ...result.handlers,
    onStarted() { result.controller?.abort() },
  })
  expect(result.deltas).toEqual([])
  expect(result.completedCount).toBe(0)
  expect(result.errors).toEqual([{ message: '已停止生成', code: 'aborted' }])
  expect(requests).toHaveLength(1)
})

test('ordinary JSON success and genuine Safety UNCLEAR remain successful', async () => {
  const answer = '我还不确定你现在是否安全，可以多说一点吗？'
  mockResponses([
    new Response(null, { status: 405 }),
    Response.json({ ...identity, answer, safety_level: 'UNCLEAR' }),
  ])
  const result = capture()
  await sendChatMessage(body, result.handlers)
  expect(result.errors).toEqual([])
  expect(result.deltas).toEqual([answer])
  expect(result.completedCount).toBe(1)
})

test('valid chunked SSE, including split CRLF, still completes normally', async () => {
  const bytes = new TextEncoder().encode((start + delta + completed).replaceAll('\n', '\r\n'))
  let offset = 0
  const chunked = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (offset < bytes.length)
        { controller.enqueue(bytes.slice(offset, ++offset)) }
      else
        { controller.close() }
    },
  })
  mockResponses([new Response(chunked, { headers: { 'Content-Type': 'text/event-stream' } })])
  const result = capture()
  await sendChatMessage(body, result.handlers)
  expect(result.errors).toEqual([])
  expect(result.completedCount).toBe(1)
  expect(result.deltas).toEqual(['不完整的回复'])
})

test('completed is terminal even if the server keeps the connection open', async () => {
  let cancelled = false
  const openStream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(start + delta + completed))
    },
    cancel() { cancelled = true },
  })
  mockResponses([new Response(openStream, { headers: { 'Content-Type': 'text/event-stream' } })])
  const result = capture()
  await sendChatMessage(body, result.handlers)
  expect(result.errors).toEqual([])
  expect(result.completedCount).toBe(1)
  expect(cancelled).toBe(true)
})

test('stream cleanup preserves the original handler error if cancellation also fails', async () => {
  const originalError = new Error('original stream error')
  const cleanupError = new Error('cleanup failure')
  let cancelled = false
  const failingCleanup = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(start))
    },
    cancel() {
      cancelled = true
      throw cleanupError
    },
  })
  mockResponses([new Response(failingCleanup, { headers: { 'Content-Type': 'text/event-stream' } })])
  await expect(streamSSE('/stream', {}, () => { throw originalError })).rejects.toBe(originalError)
  expect(cancelled).toBe(true)
  expect(failingCleanup.locked).toBe(false)
})

test('stream cleanup failures surface when there is no primary failure and release the lock', async () => {
  const cleanupError = new Error('cleanup failure')
  const failingCleanup = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(start))
    },
    cancel() { throw cleanupError },
  })
  mockResponses([new Response(failingCleanup, { headers: { 'Content-Type': 'text/event-stream' } })])
  await expect(streamSSE('/stream', {}, () => false)).rejects.toBe(cleanupError)
  expect(failingCleanup.locked).toBe(false)
})

for (const level of ['immediate_danger', 'self_harm', 'normal']) {
  test(`completion exposes server safety level ${level} after successful SSE`, async () => {
    mockResponses([stream(start + delta + event('completed', { safety_level: level }))])
    const result = capture()
    let received: unknown
    await sendChatMessage(body, {
      ...result.handlers,
      onCompleted(hasError, metadata) {
        expect(hasError).toBe(false)
        received = metadata
      },
    })
    expect(received).toEqual({ safety_level: level })
    expect(result.errors).toEqual([])
  })
}
