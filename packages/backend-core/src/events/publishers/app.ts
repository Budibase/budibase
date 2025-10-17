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

const created = async (workspace: Workspace, timestamp?: string | number) => {
  const properties: WorkspaceCreatedEvent = {
    appId: workspace.appId,
    version: workspace.version,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_CREATED, properties, timestamp)
}

async function updated(workspace: Workspace) {
  const properties: WorkspaceUpdatedEvent = {
    appId: workspace.appId,
    version: workspace.version,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_UPDATED, properties)
}

async function deleted(workspace: Workspace) {
  const properties: WorkspaceDeletedEvent = {
    appId: workspace.appId,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_DELETED, properties)
}

async function published(workspace: Workspace, timestamp?: string | number) {
  const properties: WorkspacePublishedEvent = {
    appId: workspace.appId,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_PUBLISHED, properties, timestamp)
}

async function unpublished(workspace: Workspace) {
  const properties: WorkspaceUnpublishedEvent = {
    appId: workspace.appId,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_UNPUBLISHED, properties)
}

async function fileImported(workspace: Workspace) {
  const properties: WorkspaceFileImportedEvent = {
    appId: workspace.appId,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_FILE_IMPORTED, properties)
}

async function duplicated(workspace: Workspace, duplicateAppId: string) {
  const properties: WorkspaceDuplicatedEvent = {
    duplicateAppId,
    appId: workspace.appId,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_DUPLICATED, properties)
}

async function templateImported(workspace: Workspace, templateKey: string) {
  const properties: WorkspaceTemplateImportedEvent = {
    appId: workspace.appId,
    templateKey,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_TEMPLATE_IMPORTED, properties)
}

async function versionUpdated(
  workspace: Workspace,
  currentVersion: string,
  updatedToVersion: string
) {
  const properties: AppVersionUpdatedEvent = {
    appId: workspace.appId,
    currentVersion,
    updatedToVersion,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_APP_VERSION_UPDATED, properties)
}

async function versionReverted(
  workspace: Workspace,
  currentVersion: string,
  revertedToVersion: string
) {
  const properties: AppVersionRevertedEvent = {
    appId: workspace.appId,
    currentVersion,
    revertedToVersion,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_APP_VERSION_REVERTED, properties)
}

async function reverted(workspace: Workspace) {
  const properties: WorkspaceRevertedEvent = {
    appId: workspace.appId,
    audited: {
      name: workspace.name,
    },
  }
  await publishEvent(Event.WORKSPACE_REVERTED, properties)
}

async function exported(workspace: Workspace) {
  const properties: WorkspaceExportedEvent = {
    appId: workspace.appId,
    audited: {
      name: workspace.name,
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
