import { Document } from "../document"

export enum WebhookActionType {
  AUTOMATION = "automation",
}

export interface Webhook extends Document {
  live: boolean
  name: string
  action: {
    type: WebhookActionType
    target: string
  }
  bodySchema?: any
}
