import { BaseEvent } from "./event"

export interface ScreenCreatedEvent extends BaseEvent {
  screenId: string
  layoutId?: string
  roleId: string
  audited: {
    name: string
  }
}

export interface ScreenDeletedEvent extends BaseEvent {
  screenId: string
  layoutId?: string
  roleId: string
  audited: {
    name: string
  }
}
