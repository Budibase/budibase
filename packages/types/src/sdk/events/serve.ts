import { BaseEvent } from "./event"

export interface BuilderServedEvent extends BaseEvent {
  timezone: string
}

export interface AppServedEvent extends BaseEvent {
  appVersion: string
  timezone: string
}

export interface AppPreviewServedEvent extends BaseEvent {
  appVersion: string
  timezone: string
}
