import { context, DocumentType } from "@budibase/backend-core"
import { Workspace } from "@budibase/types"

/**
 * @deprecated the plan is to get everything using `tryGet` instead, then rename
 * `tryGet` to `get`.
 */
export async function get(opts?: { production?: boolean }) {
  const db = opts?.production
    ? context.getProdWorkspaceDB()
    : context.getWorkspaceDB()
  const application = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
  return application
}

export async function tryGet(opts?: { production?: boolean }) {
  const db = opts?.production
    ? context.getProdWorkspaceDB()
    : context.getWorkspaceDB()
  const application = await db.tryGet<Workspace>(
    DocumentType.WORKSPACE_METADATA
  )
  return application
}
