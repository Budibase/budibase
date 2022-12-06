import { BaseEvent } from "./event"

export interface AppCreatedEvent extends BaseEvent {
  appId: string
  version: string
}

export interface AppUpdatedEvent extends BaseEvent {
  appId: string
  version: string
}

export interface AppDeletedEvent extends BaseEvent {
  appId: string
}

export interface AppPublishedEvent extends BaseEvent {
  appId: string
}

export interface AppUnpublishedEvent extends BaseEvent {
  appId: string
}

export interface AppFileImportedEvent extends BaseEvent {
  appId: string
}

export interface AppTemplateImportedEvent extends BaseEvent {
  appId: string
  templateKey: string
}

export interface AppVersionUpdatedEvent extends BaseEvent {
  appId: string
  currentVersion: string
  updatedToVersion: string
}

export interface AppVersionRevertedEvent extends BaseEvent {
  appId: string
  currentVersion: string
  revertedToVersion: string
}

export interface AppRevertedEvent extends BaseEvent {
  appId: string
}

export interface AppExportedEvent extends BaseEvent {
  appId: string
}
