import { publishEvent } from "../events"
import {
  Event,
  Workspace,
  WorkspaceCreatedEvent,
  WorkspaceUpdatedEvent,
  WorkspaceDeletedEvent,
  WorkspacePublishedEvent,
  WorkspaceUnpublishedEvent,
  WorkspaceFileImportedEvent,
  WorkspaceTemplateImportedEvent,
  WorkspaceVersionUpdatedEvent,
  WorkspaceVersionRevertedEvent,
  WorkspaceRevertedEvent,
  WorkspaceExportedEvent,
  WorkspaceDuplicatedEvent,
} from "@budibase/types"

const created = async (app: Workspace, timestamp?: string | number) => {
  const properties: WorkspaceCreatedEvent = {
    appId: app.appId,
    version: app.version,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_CREATED, properties, timestamp)
}

async function updated(app: Workspace) {
  const properties: WorkspaceUpdatedEvent = {
    appId: app.appId,
    version: app.version,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_UPDATED, properties)
}

async function deleted(app: Workspace) {
  const properties: WorkspaceDeletedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_DELETED, properties)
}

async function published(app: Workspace, timestamp?: string | number) {
  const properties: WorkspacePublishedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_PUBLISHED, properties, timestamp)
}

async function unpublished(app: Workspace) {
  const properties: WorkspaceUnpublishedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_UNPUBLISHED, properties)
}

async function fileImported(app: Workspace) {
  const properties: WorkspaceFileImportedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_FILE_IMPORTED, properties)
}

async function duplicated(app: Workspace, duplicateAppId: string) {
  const properties: WorkspaceDuplicatedEvent = {
    duplicateAppId,
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_DUPLICATED, properties)
}

async function templateImported(app: Workspace, templateKey: string) {
  const properties: WorkspaceTemplateImportedEvent = {
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
  const properties: WorkspaceVersionUpdatedEvent = {
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
  const properties: WorkspaceVersionRevertedEvent = {
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
  const properties: WorkspaceRevertedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.APP_REVERTED, properties)
}

async function exported(app: Workspace) {
  const properties: WorkspaceExportedEvent = {
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
