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

export async function updated(app: App) {
  const properties: AppUpdatedEvent = {}
  await publishEvent(Event.APP_UPDATED, properties)
}

export async function deleted(app: App) {
  const properties: AppDeletedEvent = {}
  await publishEvent(Event.APP_DELETED, properties)
}

export async function published(app: App) {
  const properties: AppPublishedEvent = {}
  await publishEvent(Event.APP_PUBLISHED, properties)
}

export async function unpublished(app: App) {
  const properties: AppUnpublishedEvent = {}
  await publishEvent(Event.APP_UNPUBLISHED, properties)
}

export async function fileImported(app: App) {
  const properties: AppFileImportedEvent = {}
  await publishEvent(Event.APP_FILE_IMPORTED, properties)
}

export async function templateImported(templateKey: string) {
  const properties: AppTemplateImportedEvent = {
    templateKey,
  }
  await publishEvent(Event.APP_TEMPLATE_IMPORTED, properties)
}

export async function versionUpdated(app: App) {
  const properties: AppVersionUpdatedEvent = {}
  await publishEvent(Event.APP_VERSION_UPDATED, properties)
}

export async function versionReverted(app: App) {
  const properties: AppVersionRevertedEvent = {}
  await publishEvent(Event.APP_VERSION_REVERTED, properties)
}

export async function reverted(app: App) {
  const properties: AppRevertedEvent = {}
  await publishEvent(Event.APP_REVERTED, properties)
}

export async function exported(app: App) {
  const properties: AppExportedEvent = {}
  await publishEvent(Event.APP_EXPORTED, properties)
}
