import { Document } from "../../"

export interface AgentMessage {
  message: string
  system?: boolean
  isError?: boolean
}

export interface AgentHistory extends Document {
  title: string
  messages: AgentMessage[]
  appIds: string[]
}
