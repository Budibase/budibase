import { BaseEvent } from "./event"

export interface WorkspaceAppCreatedEvent extends BaseEvent {
  workspaceAppId: string
  audited: {
    name: string
  }
}

export interface WorkspaceAppUpdatedEvent extends BaseEvent {
  workspaceAppId: string
  audited: {
    name: string
  }
}

export interface WorkspaceAppDeletedEvent extends BaseEvent {
  workspaceAppId: string
  audited: {
    name: string
  }
}
