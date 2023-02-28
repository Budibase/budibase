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

const created = async (app: App, timestamp?: string | number) => {
  const properties: AppCreatedEvent = {
    appId: app.appId,
    version: app.version,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_CREATED, properties, timestamp)
}

async function updated(app: App) {
  const properties: AppUpdatedEvent = {
    appId: app.appId,
    version: app.version,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_UPDATED, properties)
}

async function deleted(app: App) {
  const properties: AppDeletedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_DELETED, properties)
}

async function published(app: App, timestamp?: string | number) {
  const properties: AppPublishedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_PUBLISHED, properties, timestamp)
}

async function unpublished(app: App) {
  const properties: AppUnpublishedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_UNPUBLISHED, properties)
}

async function fileImported(app: App) {
  const properties: AppFileImportedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_FILE_IMPORTED, properties)
}

async function templateImported(app: App, templateKey: string) {
  const properties: AppTemplateImportedEvent = {
    appId: app.appId,
    templateKey,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_TEMPLATE_IMPORTED, properties)
}

async function versionUpdated(
  app: App,
  currentVersion: string,
  updatedToVersion: string
) {
  const properties: AppVersionUpdatedEvent = {
    appId: app.appId,
    currentVersion,
    updatedToVersion,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_VERSION_UPDATED, properties)
}

async function versionReverted(
  app: App,
  currentVersion: string,
  revertedToVersion: string
) {
  const properties: AppVersionRevertedEvent = {
    appId: app.appId,
    currentVersion,
    revertedToVersion,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_VERSION_REVERTED, properties)
}

async function reverted(app: App) {
  const properties: AppRevertedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_REVERTED, properties)
}

async function exported(app: App) {
  const properties: AppExportedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_EXPORTED, properties)
}

export default {
  created,
  updated,
  deleted,
  published,
  unpublished,
  fileImported,
  templateImported,
  versionUpdated,
  versionReverted,
  reverted,
  exported,
}
