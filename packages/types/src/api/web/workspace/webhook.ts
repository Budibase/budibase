import { Webhook } from "../../../documents"
import { DocumentDestroyResponse, DocumentInsertResponse } from "@budibase/nano"

export type FetchWebhooksResponse = Webhook[]

export interface SaveWebhookRequest extends Webhook {}
export interface SaveWebhookResponse {
  message: string
  webhook: Webhook
}

export interface DeleteWebhookResponse extends DocumentDestroyResponse {}

export interface BuildWebhookSchemaRequest extends Record<string, any> {}
export interface BuildWebhookSchemaResponse extends DocumentInsertResponse {}

export interface TriggerWebhookRequest {}
export type TriggerWebhookResponse =
  | Record<string, any>
  | { message: string }
  | undefined
