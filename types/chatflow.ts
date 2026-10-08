/** Native contract: xiaoan/tech/chatflow/poc/API.md (Azure account mode). */
export type SafetyLevel = 'normal' | 'unclear' | 'immediate_danger' | 'self_harm'

export interface ConversationSummary {
  id: string
  created_at: string | number
  updated_at?: string | number
  expires_at?: string | null
}

export interface ConversationTurn {
  number?: number
  response_id?: string
  user: string
  assistant: string
  route_id: string
  safety_level: SafetyLevel
}

export interface ConversationView {
  conversation_id: string
  turns: ConversationTurn[]
  next_after?: number | null
}

export interface CompletedResponse {
  conversation_id: string
  response_id: string
  safety_level: SafetyLevel
}
