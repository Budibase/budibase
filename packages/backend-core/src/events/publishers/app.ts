import {
  AppCreatedEvent,
  AppDeletedEvent,
  AppDuplicatedEvent,
  AppExportedEvent,
  AppFileImportedEvent,
  AppPublishedEvent,
  AppRevertedEvent,
  AppTemplateImportedEvent,
  AppUnpublishedEvent,
  AppUpdatedEvent,
  AppVersionRevertedEvent,
  AppVersionUpdatedEvent,
  Event,
  Workspace,
} from "@budibase/types"
import { publishEvent } from "../events"

const created = async (app: Workspace, timestamp?: string | number) => {
  const properties: AppCreatedEvent = {
    appId: app.appId,
    version: app.version,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_CREATED, properties, timestamp)
}

async function updated(app: Workspace) {
  const properties: AppUpdatedEvent = {
    appId: app.appId,
    version: app.version,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_UPDATED, properties)
}

async function deleted(app: Workspace) {
  const properties: AppDeletedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_DELETED, properties)
}

async function published(app: Workspace, timestamp?: string | number) {
  const properties: AppPublishedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_PUBLISHED, properties, timestamp)
}

async function unpublished(app: Workspace) {
  const properties: AppUnpublishedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_UNPUBLISHED, properties)
}

async function fileImported(app: Workspace) {
  const properties: AppFileImportedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_FILE_IMPORTED, properties)
}

async function duplicated(app: Workspace, duplicateAppId: string) {
  const properties: AppDuplicatedEvent = {
    duplicateAppId,
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_DUPLICATED, properties)
}

async function templateImported(app: Workspace, templateKey: string) {
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
  app: Workspace,
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
  app: Workspace,
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

async function reverted(app: Workspace) {
  const properties: AppRevertedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_REVERTED, properties)
}

async function exported(app: Workspace) {
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
  duplicated,
  templateImported,
  versionUpdated,
  versionReverted,
  reverted,
  exported,
}
