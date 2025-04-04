import { AgentMessage, AgentHistory } from "../../../documents"

export interface ChatAgentRequest {
  messages: AgentMessage[]
  appIds: string[]
}

export interface ChatAgentResponse {
  response: string
  toolsCalled?: {
    response: { message: string; output?: any }
    appId?: string
  }[]
}

export interface SaveAgentHistoryRequest extends Omit<AgentHistory, "title"> {
  title?: string
}

export interface SaveAgentHistoryResponse extends AgentHistory {}

export type FetchAgentHistoryResponse = AgentHistory[]
