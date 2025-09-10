import { db, locks } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"
import env from "../environment"

export async function doInMigrationLock<T>(
  appId: string,
  fn: () => Promise<T>
): Promise<T> {
  if (env.isTest() && env.SKIP_MIGRATION_LOCKS_IN_TESTS) {
    console.log(`Bypassing lock for in test environment`)
    return fn()
  }

  console.log(`Acquiring app migration lock for "${appId}"`)

  const prodAppId = db.getProdWorkspaceID(appId)

  const { result } = await locks.doWithLock(
    {
      name: LockName.WORKSPACE_MIGRATION,
      type: LockType.AUTO_EXTEND,
      resource: prodAppId,
    },
    async () => {
      console.log(`Migration lock acquired for app "${prodAppId}"`)

      return await fn()
    }
  )

  return result
}
