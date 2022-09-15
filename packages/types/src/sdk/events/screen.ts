import { BaseEvent } from "./event"

export interface ScreenCreatedEvent extends BaseEvent {
  screenId: string
  layoutId?: string
  roleId: string
}

export interface ScreenDeletedEvent extends BaseEvent {
  screenId: string
  layoutId?: string
  roleId: string
}
