import { DocumentType } from "@budibase/types"
import { structures } from "../../../../../tests"
import * as context from "../../../../context"
import * as db from "../../../../db"
import { doWithActionsWorkspaceDeletionLock, getActionsDbName } from "../db"

export async function createWorkspace(
  tenantId = structures.tenant.id()
): Promise<string> {
  const workspaceId = db.generateWorkspaceID(tenantId)
  await db
    .getDB(db.getDevWorkspaceID(workspaceId))
    .put({ _id: DocumentType.WORKSPACE_METADATA })
  return workspaceId
}

export async function runInWorkspace<T>(task: () => Promise<T>): Promise<T> {
  const workspaceId = await createWorkspace()
  try {
    return await context.doInWorkspaceContext(workspaceId, task)
  } finally {
    await destroyWorkspace(workspaceId)
  }
}

export async function destroyWorkspace(workspaceId: string): Promise<void> {
  await doWithActionsWorkspaceDeletionLock({
    workspaceId,
    task: async () => {
      for (const name of [
        db.getDevWorkspaceID(workspaceId),
        getActionsDbName(workspaceId),
      ]) {
        if (await db.dbExists(name)) {
          await db.getDB(name, { skip_setup: true }).destroy()
        }
      }
    },
  })
}
