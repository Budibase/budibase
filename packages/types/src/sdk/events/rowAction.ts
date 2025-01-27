import { BaseEvent } from "./event"

export interface RowActionCreatedEvent extends BaseEvent {
  name: string
  automationId: string
}
