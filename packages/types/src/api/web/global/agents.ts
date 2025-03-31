export interface ChatAgentRequest {
  userPrompt: string
  appIds: string[]
}

export interface ChatAgentResponse {
  response: string
}
