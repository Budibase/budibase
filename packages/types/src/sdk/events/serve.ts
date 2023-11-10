import { BaseEvent } from "./event"

export interface BuilderServedEvent extends BaseEvent {
  timezone: string
}

export interface AppServedEvent extends BaseEvent {
  appVersion: string
  timezone: string
  embed?: boolean
}

export interface AppPreviewServedEvent extends BaseEvent {
  appVersion: string
  timezone: string
}
