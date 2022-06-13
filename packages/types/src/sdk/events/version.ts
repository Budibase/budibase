import { BaseEvent } from "./event"

export interface VersionCheckedEvent extends BaseEvent {
  currentVersion: string
}

export interface VersionChangeEvent extends BaseEvent {
  from: string
  to: string
}
