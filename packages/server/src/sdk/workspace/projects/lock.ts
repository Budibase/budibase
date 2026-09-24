import { context, db, features, locks } from "@budibase/backend-core"
import { FeatureFlag, LockName, LockType } from "@budibase/types"

export async function doWithProjectAssignmentsLock<T>(
  fn: () => Promise<T>,
  workspaceId = context.getWorkspaceId()
): Promise<T> {
  if (!workspaceId) {
    throw new Error(
      "Could not determine workspace for Project assignments lock"
    )
  }

  const { result } = await locks.doWithLock(
    {
      name: LockName.PROJECT_ASSIGNMENTS,
      type: LockType.AUTO_EXTEND,
      resource: db.getProdWorkspaceID(workspaceId),
    },
    fn
  )
  return result
}

export async function doWithProjectAssignmentsLockIfEnabled<T>(
  fn: () => Promise<T>
): Promise<T> {
  if (!(await features.isEnabled(FeatureFlag.PROJECTS))) {
    return await fn()
  }
  return await doWithProjectAssignmentsLock(fn)
}
