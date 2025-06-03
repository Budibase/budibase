import { Document, Message } from "../../"

export interface AgentChat extends Document {
  title: string
  messages: Message[]
}

export interface AgentToolSource extends Document {
  type: "GITHUB" | "CONFLUENCE" | "BUDIBASE"
  disabledTools: string[]
  auth: object
}
