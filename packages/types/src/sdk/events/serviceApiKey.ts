import { BaseEvent } from "./event"

export interface ServiceApiKeyCreatedEvent extends BaseEvent {
  serviceApiKeyId: string
  audited: { name: string }
}

export interface ServiceApiKeyRevokedEvent extends BaseEvent {
  serviceApiKeyId: string
  audited: { name: string }
}
