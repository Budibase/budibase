import { BaseEvent } from "./event"

export interface LayoutCreatedEvent extends BaseEvent {
  layoutId: string
}

export interface LayoutDeletedEvent extends BaseEvent {
  layoutId: string
}
