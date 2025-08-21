import { publishEvent } from "../events"
import { Event, WorkspaceApp, WorkspaceAppDeletedEvent } from "@budibase/types"

async function deleted(workspaceApp: WorkspaceApp, appId: string) {
  const properties: WorkspaceAppDeletedEvent = {
    workspaceAppId: workspaceApp._id as string,
    audited: {
      name: workspaceApp.name,
    },
    appId,
  }
  await publishEvent(Event.WORKSPACE_APP_DELETED, properties)
}

export default {
  deleted,
}
