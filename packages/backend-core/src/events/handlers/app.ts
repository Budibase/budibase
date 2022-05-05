import { processEvent } from "../events"
import {
  Event,
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
  processEvent(Event.APP_CREATED, properties)
}

export function updated(app: App) {
  const properties: AppUpdatedEvent = {}
  processEvent(Event.APP_UPDATED, properties)
}

export function deleted(app: App) {
  const properties: AppDeletedEvent = {}
  processEvent(Event.APP_DELETED, properties)
}

export function published(app: App) {
  const properties: AppPublishedEvent = {}
  processEvent(Event.APP_PUBLISHED, properties)
}

export function unpublished(app: App) {
  const properties: AppUnpublishedEvent = {}
  processEvent(Event.APP_UNPUBLISHED, properties)
}

export function fileImported(app: App) {
  const properties: AppFileImportedEvent = {}
  processEvent(Event.APP_FILE_IMPORTED, properties)
}

export function templateImported(templateKey: string) {
  const properties: AppTemplateImportedEvent = {
    templateKey,
  }
  processEvent(Event.APP_TEMPLATE_IMPORTED, properties)
}

export function versionUpdated(app: App) {
  const properties: AppVersionUpdatedEvent = {}
  processEvent(Event.APP_VERSION_UPDATED, properties)
}

export function versionReverted(app: App) {
  const properties: AppVersionRevertedEvent = {}
  processEvent(Event.APP_VERSION_REVERTED, properties)
}

export function reverted(app: App) {
  const properties: AppRevertedEvent = {}
  processEvent(Event.APP_REVERTED, properties)
}

export function exported(app: App) {
  const properties: AppExportedEvent = {}
  processEvent(Event.APP_EXPORTED, properties)
}
