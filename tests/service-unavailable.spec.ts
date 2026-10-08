import { expect, test } from '@playwright/test'
import { ChatApiError, readChatStream, sendChatMessage } from '@/service'

const originalFetch = globalThis.fetch
const frame = (event: string, data = {}) => `event: ${event}\ndata: ${JSON.stringify({ conversation_id: 'c1', response_id: 'r1', ...data })}\n\n`
const stream = (text: string) => new Response(text, { headers: { 'Content-Type': 'text/event-stream' } })
test.afterEach(() => { globalThis.fetch = originalFetch })

test('partial response followed by service error rejects without fallback', async () => {
  let requests = 0
  globalThis.fetch = async () => { requests++; return stream(frame('start') + frame('delta', { delta: 'partial' }) + frame('error')) }
  await expect(sendChatMessage('c1', 'synthetic message', { onDelta() {} }, new AbortController().signal)).rejects.toBeInstanceOf(ChatApiError)
  expect(requests).toBe(1)
})

test('EOF without completed remains an unknown outcome', async () => {
  await expect(readChatStream(stream(frame('start')), 'c1', { onDelta() {} })).rejects.toMatchObject({ status: 0, responseId: 'r1' })
})

test('structured HTTP failures never expose upstream diagnostics', async () => {
  globalThis.fetch = async () => Response.json({ detail: { debug: 'sensitive' } }, { status: 503 })
  await expect(sendChatMessage('c1', 'synthetic message', { onDelta() {} }, new AbortController().signal)).rejects.toMatchObject({ status: 503, message: '小安暂时无法提供服务，请稍后重试' })
})

test('UNCLEAR completed remains a successful response', async () => {
  const response = stream(frame('start') + frame('delta', { delta: 'clarification' }) + frame('completed', { safety_level: 'unclear' }))
  await expect(readChatStream(response, 'c1', { onDelta() {} })).resolves.toMatchObject({ response_id: 'r1', safety_level: 'unclear' })
})
