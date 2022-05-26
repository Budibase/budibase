export interface AppCreatedEvent {
  appId: string
  version: string
}

export interface AppUpdatedEvent {
  appId: string
  version: string
}

export interface AppDeletedEvent {
  appId: string
}

export interface AppPublishedEvent {
  appId: string
}

export interface AppUnpublishedEvent {
  appId: string
}

export interface AppFileImportedEvent {
  appId: string
}

export interface AppTemplateImportedEvent {
  appId: string
  templateKey: string
}

export interface AppVersionUpdatedEvent {
  appId: string
  currentVersion: string
  updatedToVersion: string
}

export interface AppVersionRevertedEvent {
  appId: string
  currentVersion: string
  revertedToVersion: string
}

export interface AppRevertedEvent {
  appId: string
}

export interface AppExportedEvent {
  appId: string
}
