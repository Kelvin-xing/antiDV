import { API_PREFIX } from '@/config'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ApiRequestInit extends RequestInit {
  timeoutMs?: number
}

export interface ServerSentEvent {
  event: string
  data: string
  id: string
}

export async function apiRequest<T>(
  path: string,
  { timeoutMs = 100000, signal, ...init }: ApiRequestInit = {},
): Promise<T> {
  const requestController = new AbortController()
  const abortRequest = () => requestController.abort()
  signal?.addEventListener('abort', abortRequest, { once: true })
  let timedOut = false
  const timeout = window.setTimeout(() => {
    timedOut = true
    abortRequest()
  }, timeoutMs)

  try {
    const response = await fetch(`${API_PREFIX}${path}`, {
      ...init,
      signal: requestController.signal,
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...init.headers,
      },
    })

    if (!response.ok) {
      let message = `请求失败 (${response.status})`
      try {
        const body = await response.json()
        if (typeof body.detail === 'string') {
          message = body.detail
        }
      }
      catch {
        // Keep the status-based message for non-JSON errors.
      }
      throw new ApiError(response.status, message)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return await response.json() as T
  }
  catch (error) {
    if (
      timedOut
      && error instanceof DOMException
      && error.name === 'AbortError'
    ) {
      throw new ApiError(408, '请求超时，请稍后重试')
    }
    throw error
  }
  finally {
    signal?.removeEventListener('abort', abortRequest)
    window.clearTimeout(timeout)
  }
}

function findLineEnding(
  value: string,
  endOfStream: boolean,
): { index: number, length: number } | null {
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '\n')
      { return { index, length: 1 } }
    if (value[index] !== '\r')
      { continue }
    if (index === value.length - 1 && !endOfStream)
      { return null }
    return {
      index,
      length: value[index + 1] === '\n' ? 2 : 1,
    }
  }
  return null
}

async function consumeEventStream(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: ServerSentEvent) => void,
  onActivity?: () => void,
): Promise<void> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let eventName = ''
  let eventId = ''
  let dataLines: string[] = []

  const processLine = (line: string) => {
    if (line === '') {
      if (dataLines.length) {
        onEvent({
          event: eventName || 'message',
          data: dataLines.join('\n'),
          id: eventId,
        })
      }
      eventName = ''
      dataLines = []
      return
    }
    if (line.startsWith(':'))
      { return }

    const separatorIndex = line.indexOf(':')
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex)
    let value = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1)
    if (value.startsWith(' '))
      { value = value.slice(1) }

    if (field === 'event')
      { eventName = value }
    else if (field === 'data')
      { dataLines.push(value) }
    else if (field === 'id' && !value.includes('\0'))
      { eventId = value }
  }

  const processBuffer = (endOfStream: boolean) => {
    while (buffer) {
      const lineEnding = findLineEnding(buffer, endOfStream)
      if (!lineEnding)
        { break }
      processLine(buffer.slice(0, lineEnding.index))
      buffer = buffer.slice(lineEnding.index + lineEnding.length)
    }
    if (endOfStream && buffer) {
      processLine(buffer)
      buffer = ''
    }
  }

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done)
        { break }
      onActivity?.()
      buffer += decoder.decode(value, { stream: true })
      processBuffer(false)
    }
    buffer += decoder.decode()
    processBuffer(true)
  }
  finally {
    reader.releaseLock()
  }
}

export async function streamSSE(
  path: string,
  init: RequestInit,
  onEvent: (event: ServerSentEvent) => void,
  onActivity?: () => void,
): Promise<void> {
  const response = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: 'text/event-stream',
      ...init.headers,
    },
  })

  if (!response.ok)
    { throw new ApiError(response.status, `请求失败 (${response.status})`) }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.toLowerCase().startsWith('text/event-stream'))
    { throw new ApiError(response.status, `预期流式响应，但服务器返回了 ${contentType || '未知格式'}`) }
  if (!response.body)
    { throw new ApiError(response.status, '浏览器未提供流式响应内容') }

  await consumeEventStream(response.body, onEvent, onActivity)
}

export function upload(_options?: unknown): Promise<{ id: string }> {
  return Promise.reject(new Error('当前版本暂不支持上传附件'))
}
