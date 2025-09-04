import { db, locks } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"

export async function doInMigrationLock<T>(
  appId: string,
  fn: () => Promise<T>
): Promise<T> {
  console.log(`Acquiring app migration lock for "${appId}"`)

  const prodAppId = db.getProdAppID(appId)

  const { result } = await locks.doWithLock(
    {
      name: LockName.APP_MIGRATION,
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
