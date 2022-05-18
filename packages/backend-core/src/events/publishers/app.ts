import { publishEvent } from "../events"
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

export const created = async (app: App) => {
  const properties: AppCreatedEvent = {}
  await publishEvent(Event.APP_CREATED, properties)
}

export function updated(app: App) {
  const properties: AppUpdatedEvent = {}
  publishEvent(Event.APP_UPDATED, properties)
}

export function deleted(app: App) {
  const properties: AppDeletedEvent = {}
  publishEvent(Event.APP_DELETED, properties)
}

export function published(app: App) {
  const properties: AppPublishedEvent = {}
  publishEvent(Event.APP_PUBLISHED, properties)
}

export function unpublished(app: App) {
  const properties: AppUnpublishedEvent = {}
  publishEvent(Event.APP_UNPUBLISHED, properties)
}

export function fileImported(app: App) {
  const properties: AppFileImportedEvent = {}
  publishEvent(Event.APP_FILE_IMPORTED, properties)
}

export function templateImported(templateKey: string) {
  const properties: AppTemplateImportedEvent = {
    templateKey,
  }
  publishEvent(Event.APP_TEMPLATE_IMPORTED, properties)
}

export function versionUpdated(app: App) {
  const properties: AppVersionUpdatedEvent = {}
  publishEvent(Event.APP_VERSION_UPDATED, properties)
}

export function versionReverted(app: App) {
  const properties: AppVersionRevertedEvent = {}
  publishEvent(Event.APP_VERSION_REVERTED, properties)
}

export function reverted(app: App) {
  const properties: AppRevertedEvent = {}
  publishEvent(Event.APP_REVERTED, properties)
}

export function exported(app: App) {
  const properties: AppExportedEvent = {}
  publishEvent(Event.APP_EXPORTED, properties)
}
