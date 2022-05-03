import { processEvent } from "../events"
import {
  Events,
  App,
  AppCreatedEvent,
  AppUpdatedEvent,
  AppDeletedEvent,
  AppPublishedEvent,
  AppUnpublishedEvent,
  AppFileImportedEvent,
  AppTemplateImportedEvent,
  AppVersionUpdatedEvent,
  AppVersionRevertedEvent,
  AppRevertedEvent,
  AppExportedEvent,
} from "@budibase/types"

export function created(app: App) {
  const properties: AppCreatedEvent = {}
  processEvent(Events.APP_CREATED, properties)
}

export function updated(app: App) {
  const properties: AppUpdatedEvent = {}
  processEvent(Events.APP_UPDATED, properties)
}

export function deleted(app: App) {
  const properties: AppDeletedEvent = {}
  processEvent(Events.APP_DELETED, properties)
}

export function published(app: App) {
  const properties: AppPublishedEvent = {}
  processEvent(Events.APP_PUBLISHED, properties)
}

export function unpublished(app: App) {
  const properties: AppUnpublishedEvent = {}
  processEvent(Events.APP_UNPUBLISHED, properties)
}

export function fileImported(app: App) {
  const properties: AppFileImportedEvent = {}
  processEvent(Events.APP_FILE_IMPORTED, properties)
}

export function templateImported(templateKey: string) {
  const properties: AppTemplateImportedEvent = {
    templateKey,
  }
  processEvent(Events.APP_TEMPLATE_IMPORTED, properties)
}

export function versionUpdated(app: App) {
  const properties: AppVersionUpdatedEvent = {}
  processEvent(Events.APP_VERSION_UPDATED, properties)
}

export function versionReverted(app: App) {
  const properties: AppVersionRevertedEvent = {}
  processEvent(Events.APP_VERSION_REVERTED, properties)
}

export function reverted(app: App) {
  const properties: AppRevertedEvent = {}
  processEvent(Events.APP_REVERTED, properties)
}

export function exported(app: App) {
  const properties: AppExportedEvent = {}
  processEvent(Events.APP_EXPORTED, properties)
}
