import { BaseEvent } from "./event"

export interface WorkspaceAppDeletedEvent extends BaseEvent {
  workspaceAppId: string
  audited: {
    name: string
  }
}
