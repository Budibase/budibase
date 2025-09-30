import { BaseEvent } from "./event"

export interface WorkspaceCreatedEvent extends BaseEvent {
  appId: string
  version: string
  audited: {
    name: string
  }
}

export interface WorkspaceUpdatedEvent extends BaseEvent {
  appId: string
  version: string
  audited: {
    name: string
  }
}

export interface WorkspaceDeletedEvent extends BaseEvent {
  appId: string
  audited: {
    name: string
  }
}

export interface WorkspacePublishedEvent extends BaseEvent {
  appId: string
  audited: {
    name: string
  }
}

export interface WorkspaceUnpublishedEvent extends BaseEvent {
  appId: string
  audited: {
    name: string
  }
}

export interface WorkspaceFileImportedEvent extends BaseEvent {
  appId: string
  audited: {
    name: string
  }
}

export interface WorkspaceDuplicatedEvent extends BaseEvent {
  duplicateAppId: string
  appId: string
  audited: {
    name: string
  }
}

export interface WorkspaceTemplateImportedEvent extends BaseEvent {
  appId: string
  templateKey: string
  audited: {
    name: string
  }
}

export interface AppVersionUpdatedEvent extends BaseEvent {
  appId: string
  currentVersion: string
  updatedToVersion: string
  audited: {
    name: string
  }
}

export interface AppVersionRevertedEvent extends BaseEvent {
  appId: string
  currentVersion: string
  revertedToVersion: string
  audited: {
    name: string
  }
}

export interface WorkspaceRevertedEvent extends BaseEvent {
  appId: string
  audited: {
    name: string
  }
}

export interface WorkspaceExportedEvent extends BaseEvent {
  appId: string
  audited: {
    name: string
  }
}
