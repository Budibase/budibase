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

export const created = async (app: App, timestamp?: string | number) => {
  const properties: AppCreatedEvent = {
    appId: app.appId,
    version: app.version,
  }
  await publishEvent(Event.APP_CREATED, properties, timestamp)
}

export async function updated(app: App) {
  const properties: AppUpdatedEvent = {
    appId: app.appId,
    version: app.version,
  }
  await publishEvent(Event.APP_UPDATED, properties)
}

export async function deleted(app: App) {
  const properties: AppDeletedEvent = {
    appId: app.appId,
  }
  await publishEvent(Event.APP_DELETED, properties)
}

export async function published(app: App, timestamp?: string | number) {
  const properties: AppPublishedEvent = {
    appId: app.appId,
  }
  await publishEvent(Event.APP_PUBLISHED, properties, timestamp)
}

export async function unpublished(app: App) {
  const properties: AppUnpublishedEvent = {
    appId: app.appId,
  }
  await publishEvent(Event.APP_UNPUBLISHED, properties)
}

export async function fileImported(app: App) {
  const properties: AppFileImportedEvent = {
    appId: app.appId,
  }
  await publishEvent(Event.APP_FILE_IMPORTED, properties)
}

export async function templateImported(app: App, templateKey: string) {
  const properties: AppTemplateImportedEvent = {
    appId: app.appId,
    templateKey,
  }
  await publishEvent(Event.APP_TEMPLATE_IMPORTED, properties)
}

export async function versionUpdated(
  app: App,
  currentVersion: string,
  updatedToVersion: string
) {
  const properties: AppVersionUpdatedEvent = {
    appId: app.appId,
    currentVersion,
    updatedToVersion,
  }
  await publishEvent(Event.APP_VERSION_UPDATED, properties)
}

export async function versionReverted(
  app: App,
  currentVersion: string,
  revertedToVersion: string
) {
  const properties: AppVersionRevertedEvent = {
    appId: app.appId,
    currentVersion,
    revertedToVersion,
  }
  await publishEvent(Event.APP_VERSION_REVERTED, properties)
}

export async function reverted(app: App) {
  const properties: AppRevertedEvent = {
    appId: app.appId,
  }
  await publishEvent(Event.APP_REVERTED, properties)
}

export async function exported(app: App) {
  const properties: AppExportedEvent = {
    appId: app.appId,
  }
  await publishEvent(Event.APP_EXPORTED, properties)
}
