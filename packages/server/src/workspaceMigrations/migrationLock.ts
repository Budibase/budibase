import { db, locks } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"

export async function doInMigrationLock<T>(
  workspaceId: string,
  fn: () => Promise<T>
): Promise<T> {
  console.log(`Acquiring workspace migration lock for "${workspaceId}"`)

  const prodWorkspaceId = db.getProdWorkspaceID(workspaceId)

  const { result } = await locks.doWithLock(
    {
      name: LockName.WORKSPACE_MIGRATION,
      type: LockType.AUTO_EXTEND,
      resource: prodWorkspaceId,
    },
    async () => {
      console.log(`Migration lock acquired for workspace "${prodWorkspaceId}"`)

      return await fn()
    }
  )

  return result
}
