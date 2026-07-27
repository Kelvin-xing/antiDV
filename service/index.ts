import type { ConversationItem } from '@/types/app'
import { ApiError, apiRequest, streamSSE } from './base'

interface ConversationTurn {
  user: string
  assistant: string
}

interface ConversationView {
  conversation_id: string
  turns: ConversationTurn[]
}

interface ConversationCreated {
  conversation_id: string
}

interface ChatResponse {
  conversation_id: string
  response_id: string
  answer: string
  debug?: ChatDebugPayload | null
}

interface SendChatBody {
  query: string
  conversation_id?: string | null
  debug?: boolean
}

export interface ChatDebugTimings {
  preprocess_ms: number
  router_ms: number
  ground_ms: number
  response_ttft_ms: number | null
  first_guarded_delta_ms: number | null
  response_generation_ms: number
  finalize_ms: number
  total_ms: number
}

export interface ChatDebugPayload {
  route: {
    capsule_id: string
    capsule_title: string
    confidence: number
    reason: string
    should_continue_active_capsule: boolean
    method: string
  }
  timings: ChatDebugTimings
  [key: string]: unknown
}

interface SendChatHandlers {
  onData: (
    message: string,
    isFirstMessage: boolean,
    moreInfo: {
      conversationId: string
      messageId: string
      taskId: string
    },
  ) => void
  onStarted?: (moreInfo: {
    conversationId: string
    messageId: string
    taskId: string
  }) => void
  onDebug?: (debug: ChatDebugPayload) => void
  onCompleted: (hasError?: boolean) => void
  onError: (message: string, code?: string) => void
  getAbortController?: (controller: AbortController) => void
}

interface ConversationsResponse {
  data: ConversationItem[]
  has_more: boolean
  limit: number
}

interface ChatHistoryItem {
  id: string
  query: string
  answer: string
  message_files: never[]
  feedback: null
}

interface StreamIdentity {
  conversationId: string
  responseId: string
}

const appParameters = {
  opening_statement: '你好，我是小安。你可以慢慢说，不需要一次讲完整。我会尽力陪你梳理现在的情况和可选的下一步。',
  suggested_questions: [
    '我不确定这算不算家暴',
    '我想了解怎么保护自己',
    '我需要法律和求助资源',
  ],
  user_input_form: [],
  file_upload: {
    image: {
      enabled: false,
      number_limits: 0,
      transfer_methods: [],
    },
    enabled: false,
    allowed_file_types: [],
    allowed_file_extensions: [],
    allowed_file_upload_methods: [],
    number_limits: 0,
  },
  system_parameters: {},
}

const toConversationItem = (
  conversation: ConversationView,
): ConversationItem => ({
  id: conversation.conversation_id,
  name: conversation.turns[0]?.user.slice(0, 24) || '当前对话',
  inputs: {},
  introduction: '',
})

const readEventObject = (data: string): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(data)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    { throw new Error('流式响应格式无效') }
  return parsed as Record<string, unknown>
}

const readRequiredString = (
  payload: Record<string, unknown>,
  field: string,
): string => {
  const value = payload[field]
  if (typeof value !== 'string' || !value)
    { throw new Error(`流式响应缺少 ${field}`) }
  return value
}

const readChatDebugPayload = (value: unknown): ChatDebugPayload => {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    { throw new Error('调试信息格式无效') }

  const payload = value as Record<string, unknown>
  const route = payload.route
  const timings = payload.timings
  if (!route || typeof route !== 'object' || Array.isArray(route))
    { throw new Error('调试信息缺少路由结果') }
  if (!timings || typeof timings !== 'object' || Array.isArray(timings))
    { throw new Error('调试信息缺少分段计时') }

  const routeRecord = route as Record<string, unknown>
  const timingRecord = timings as Record<string, unknown>
  const timingFields = [
    'preprocess_ms',
    'router_ms',
    'ground_ms',
    'response_ttft_ms',
    'first_guarded_delta_ms',
    'response_generation_ms',
    'finalize_ms',
    'total_ms',
  ]
  if (
    typeof routeRecord.capsule_id !== 'string'
    || typeof routeRecord.capsule_title !== 'string'
    || typeof routeRecord.confidence !== 'number'
    || typeof routeRecord.reason !== 'string'
    || typeof routeRecord.should_continue_active_capsule !== 'boolean'
    || typeof routeRecord.method !== 'string'
    || timingFields.some((field) => {
      const timing = timingRecord[field]
      return timing !== null && typeof timing !== 'number'
    })
  )
    { throw new Error('调试信息字段格式无效') }

  return value as ChatDebugPayload
}

const assertEventIdentity = (
  payload: Record<string, unknown>,
  expected: StreamIdentity,
) => {
  if (
    readRequiredString(payload, 'conversation_id') !== expected.conversationId
    || readRequiredString(payload, 'response_id') !== expected.responseId
  )
    { throw new Error('流式响应的会话标识发生变化') }
}

export const fetchAppParams = async () => appParameters

export const fetchConversations = async (): Promise<ConversationsResponse> => {
  try {
    const conversation = await apiRequest<ConversationView>('/conversations/current')
    return {
      data: [toConversationItem(conversation)],
      has_more: false,
      limit: 1,
    }
  }
  catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return {
        data: [],
        has_more: false,
        limit: 1,
      }
    }
    throw error
  }
}

export const fetchChatList = async (
  conversationId: string,
): Promise<{ data: ChatHistoryItem[], has_more: boolean, limit: number }> => {
  const conversation = await apiRequest<ConversationView>(
    `/conversations/${encodeURIComponent(conversationId)}`,
  )

  return {
    data: conversation.turns.map((turn, index) => ({
      id: `turn-${index}`,
      query: turn.user,
      answer: turn.assistant,
      message_files: [],
      feedback: null,
    })),
    has_more: false,
    limit: conversation.turns.length,
  }
}

export const sendChatMessage = async (
  body: SendChatBody,
  handlers: SendChatHandlers,
) => {
  const controller = new AbortController()
  handlers.getAbortController?.(controller)

  try {
    let conversationId = body.conversation_id
    if (!conversationId) {
      const created = await apiRequest<ConversationCreated>('/conversations', {
        method: 'POST',
        signal: controller.signal,
      })
      conversationId = created.conversation_id
    }

    const responsePath = `/conversations/${encodeURIComponent(conversationId)}/responses`
    let streamIdentity: StreamIdentity | null = null
    let streamCompleted = false
    let firstDelta = true
    let inactivityTimedOut = false
    let inactivityTimer: number | undefined

    const resetInactivityTimer = () => {
      if (inactivityTimer !== undefined)
        { window.clearTimeout(inactivityTimer) }
      inactivityTimer = window.setTimeout(() => {
        inactivityTimedOut = true
        controller.abort()
      }, 120000)
    }

    try {
      resetInactivityTimer()
      await streamSSE(
        `${responsePath}/stream`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: body.query,
            debug: body.debug ?? false,
          }),
        },
        (event) => {
          const payload = readEventObject(event.data)
          if (event.event === 'start') {
            if (streamIdentity)
              { throw new Error('收到了重复的流式开始事件') }
            const startedConversationId = readRequiredString(payload, 'conversation_id')
            if (startedConversationId !== conversationId)
              { throw new Error('流式响应与请求的会话不一致') }
            streamIdentity = {
              conversationId: startedConversationId,
              responseId: readRequiredString(payload, 'response_id'),
            }
            handlers.onStarted?.({
              conversationId: streamIdentity.conversationId,
              messageId: streamIdentity.responseId,
              taskId: streamIdentity.responseId,
            })
            return
          }

          if (!streamIdentity)
            { throw new Error(`在开始事件之前收到了 ${event.event} 事件`) }
          if (streamCompleted)
            { throw new Error('在完成事件之后仍收到了流式数据') }
          assertEventIdentity(payload, streamIdentity)

          if (event.event === 'delta') {
            const delta = payload.delta
            if (typeof delta !== 'string')
              { throw new Error('流式文本片段格式无效') }
            if (delta) {
              handlers.onData(delta, firstDelta, {
                conversationId: streamIdentity.conversationId,
                messageId: streamIdentity.responseId,
                taskId: streamIdentity.responseId,
              })
              firstDelta = false
            }
          }
          else if (event.event === 'completed') {
            streamCompleted = true
          }
          else if (event.event === 'debug') {
            handlers.onDebug?.(readChatDebugPayload(payload.debug))
          }
          else if (event.event === 'error') {
            const message = typeof payload.message === 'string'
              ? payload.message
              : '生成回复失败，请稍后重试'
            throw new ApiError(503, message)
          }
        },
        resetInactivityTimer,
      )
    }
    catch (error) {
      if (inactivityTimedOut)
        { throw new ApiError(408, '生成回复超时，请稍后重试') }

      if (
        error instanceof ApiError
        && [404, 405, 406].includes(error.status)
        && !streamIdentity
      ) {
        resetInactivityTimer()
        const response = await apiRequest<ChatResponse>(responsePath, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: body.query,
            debug: body.debug ?? false,
          }),
        })
        handlers.onStarted?.({
          conversationId: response.conversation_id,
          messageId: response.response_id,
          taskId: response.response_id,
        })
        handlers.onData(response.answer, true, {
          conversationId: response.conversation_id,
          messageId: response.response_id,
          taskId: response.response_id,
        })
        if (response.debug)
          { handlers.onDebug?.(readChatDebugPayload(response.debug)) }
        streamCompleted = true
      }
      else {
        throw error
      }
    }
    finally {
      if (inactivityTimer !== undefined)
        { window.clearTimeout(inactivityTimer) }
    }

    if (!streamCompleted)
      { throw new Error('流式响应在完成事件之前中断') }
    handlers.onCompleted()
  }
  catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      handlers.onError('已停止生成', 'aborted')
      return
    }
    handlers.onError(
      error instanceof Error ? error.message : '请求失败，请稍后重试',
    )
  }
}

export const deleteConversation = async (conversationId: string) => {
  await apiRequest<void>(
    `/conversations/${encodeURIComponent(conversationId)}`,
    { method: 'DELETE' },
  )
  return { result: 'success' }
}
