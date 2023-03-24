import { BaseEvent } from "./event"

export interface ScimUserCreatedEvent extends BaseEvent {
  email: string
}
