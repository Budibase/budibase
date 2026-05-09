import { publishEvent } from "../events"
import {
  Event,
  WorkspaceApp,
  WorkspaceAppCreatedEvent,
  WorkspaceAppDeletedEvent,
  WorkspaceAppUpdatedEvent,
} from "@budibase/types"

async function appCreated(workspaceApp: WorkspaceApp, appId: string) {
  const properties: WorkspaceAppCreatedEvent = {
    workspaceAppId: workspaceApp._id as string,
    audited: {
      name: workspaceApp.name,
    },
    appId,
  }
  publishEvent(Event.WORKSPACE_APP_CREATED, properties).catch(err => {
    console.error("appCreated telemetry failed", {
      workspaceAppId: workspaceApp._id,
      err,
    })
  })
}

async function appUpdated(workspaceApp: WorkspaceApp, appId: string) {
  const properties: WorkspaceAppUpdatedEvent = {
    workspaceAppId: workspaceApp._id as string,
    audited: {
      name: workspaceApp.name,
    },
    appId,
  }
  publishEvent(Event.WORKSPACE_APP_UPDATED, properties).catch(err => {
    console.error("appUpdated telemetry failed", {
      workspaceAppId: workspaceApp._id,
      err,
    })
  })
}

async function appDeleted(workspaceApp: WorkspaceApp, appId: string) {
  const properties: WorkspaceAppDeletedEvent = {
    workspaceAppId: workspaceApp._id as string,
    audited: {
      name: workspaceApp.name,
    },
    appId,
  }
  publishEvent(Event.WORKSPACE_APP_DELETED, properties).catch(err => {
    console.error("appDeleted telemetry failed", {
      workspaceAppId: workspaceApp._id,
      err,
    })
  })
}

export default {
  appCreated,
  appUpdated,
  appDeleted,
}
