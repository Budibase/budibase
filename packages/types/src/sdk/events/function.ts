import type { BaseEvent } from "./event"

export interface FunctionDeletedEvent extends BaseEvent {
  appId: string
  functionId: string
  audited: {
    name: string
  }
}
