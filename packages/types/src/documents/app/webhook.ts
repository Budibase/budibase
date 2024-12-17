import { Document } from "../document"
import { JSONSchema7 } from "json-schema"

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
  bodySchema?: JSONSchema7
}
