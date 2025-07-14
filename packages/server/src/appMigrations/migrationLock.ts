import { db, locks } from "@budibase/backend-core"
import { LockName, LockType } from "@budibase/types"

export async function doInMigrationLock(
  appId: string,
  fn: () => Promise<void>
) {
  console.log(`Acquiring app migration lock for "${appId}"`)

  const prodAppId = db.getProdAppID(appId)

  return await locks.doWithLock(
    {
      name: LockName.APP_MIGRATION,
      type: LockType.AUTO_EXTEND,
      resource: prodAppId,
    },
    async () => {
      console.log(`Migration lock acquired for app "${prodAppId}"`)

      await fn()
    }
  )
}
