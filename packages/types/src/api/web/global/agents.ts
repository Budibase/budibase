export interface ChatAgentRequest {
  messages: { message: string; system?: boolean }[]
  appIds: string[]
}

export interface ChatAgentResponse {
  response: string
  toolsCalled?: { response: string; appId?: string }[]
}
