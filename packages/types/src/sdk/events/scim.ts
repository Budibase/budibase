import { BaseEvent } from "./event"

export interface ScimUserUpdatedEvent extends BaseEvent {
  userId: string
}
export interface ScimUserDeletedEvent extends BaseEvent {
  userId: string
}
