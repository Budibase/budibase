import { db as dbCore } from "@budibase/backend-core"

export async function workspaceExists(workspaceId: string) {
  const allWorkspaceIds = await dbCore.getAllWorkspaces({
    all: true,
    idsOnly: true,
  })
  return allWorkspaceIds.includes(workspaceId)
}
