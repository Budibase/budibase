import {
  AppVersionRevertedEvent,
  AppVersionUpdatedEvent,
  Event,
  Workspace,
  WorkspaceCreatedEvent,
  WorkspaceDeletedEvent,
  WorkspaceDuplicatedEvent,
  WorkspaceExportedEvent,
  WorkspaceFileImportedEvent,
  WorkspacePublishedEvent,
  WorkspaceRevertedEvent,
  WorkspaceTemplateImportedEvent,
  WorkspaceUnpublishedEvent,
  WorkspaceUpdatedEvent,
} from "@budibase/types"
import { publishEvent } from "../events"

const created = async (app: Workspace, timestamp?: string | number) => {
  const properties: WorkspaceCreatedEvent = {
    appId: app.appId,
    version: app.version,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_CREATED, properties, timestamp)
}

async function updated(app: Workspace) {
  const properties: WorkspaceUpdatedEvent = {
    appId: app.appId,
    version: app.version,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_UPDATED, properties)
}

async function deleted(app: Workspace) {
  const properties: WorkspaceDeletedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_DELETED, properties)
}

async function published(app: Workspace, timestamp?: string | number) {
  const properties: WorkspacePublishedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_PUBLISHED, properties, timestamp)
}

async function unpublished(app: Workspace) {
  const properties: WorkspaceUnpublishedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_UNPUBLISHED, properties)
}

async function fileImported(app: Workspace) {
  const properties: WorkspaceFileImportedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_FILE_IMPORTED, properties)
}

async function duplicated(app: Workspace, duplicateAppId: string) {
  const properties: WorkspaceDuplicatedEvent = {
    duplicateAppId,
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_DUPLICATED, properties)
}

async function templateImported(app: Workspace, templateKey: string) {
  const properties: WorkspaceTemplateImportedEvent = {
    appId: app.appId,
    templateKey,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_TEMPLATE_IMPORTED, properties)
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
  await publishEvent(Event.WORKSPACE_APP_VERSION_UPDATED, properties)
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
  await publishEvent(Event.WORKSPACE_APP_VERSION_REVERTED, properties)
}

async function reverted(app: Workspace) {
  const properties: WorkspaceRevertedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_REVERTED, properties)
}

async function exported(app: Workspace) {
  const properties: WorkspaceExportedEvent = {
    appId: app.appId,
    audited: {
      name: app.name,
    },
  }
  await publishEvent(Event.WORKSPACE_EXPORTED, properties)
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
