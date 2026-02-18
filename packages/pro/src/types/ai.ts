import { Message } from "@budibase/types"

export interface LLMPromptResponse {
  message: string
  tokensUsed: number
}

export interface LLMFullResponse {
  messages: Message[]
  tokensUsed: number
}

export interface AgentPromptOptions {
  baseSystemPrompt?: string
  goal?: string
  promptInstructions?: string
  includeGoal?: boolean
}
