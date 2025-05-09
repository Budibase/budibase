import { Document, Message } from "../../"

export interface AgentChat extends Document {
  title: string
  messages: Message[]
}
