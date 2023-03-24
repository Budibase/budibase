import { BaseEvent } from "./event"

export interface ScimUserCreatedEvent extends BaseEvent {
  email: string
}

export interface ScimUserUpdatedEvent extends BaseEvent {
  email: string
}
