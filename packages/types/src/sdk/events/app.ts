import { BaseEvent } from "./event"

export interface AppCreatedEvent extends BaseEvent {
  appId: string
  version: string
  name: string
}

export interface AppUpdatedEvent extends BaseEvent {
  appId: string
  version: string
  name: string
}

export interface AppDeletedEvent extends BaseEvent {
  appId: string
  name: string
}

export interface AppPublishedEvent extends BaseEvent {
  appId: string
  name: string
}

export interface AppUnpublishedEvent extends BaseEvent {
  appId: string
  name: string
}

export interface AppFileImportedEvent extends BaseEvent {
  appId: string
  name: string
}

export interface AppTemplateImportedEvent extends BaseEvent {
  appId: string
  templateKey: string
  name: string
}

export interface AppVersionUpdatedEvent extends BaseEvent {
  appId: string
  currentVersion: string
  updatedToVersion: string
  name: string
}

export interface AppVersionRevertedEvent extends BaseEvent {
  appId: string
  currentVersion: string
  revertedToVersion: string
  name: string
}

export interface AppRevertedEvent extends BaseEvent {
  appId: string
  name: string
}

export interface AppExportedEvent extends BaseEvent {
  appId: string
  name: string
}
