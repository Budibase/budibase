import { BaseEvent } from "./event"

export interface BuilderServedEvent extends BaseEvent {}

export interface AppServedEvent extends BaseEvent {
  appVersion: string
}

export interface AppPreviewServedEvent extends BaseEvent {
  appVersion: string
}
