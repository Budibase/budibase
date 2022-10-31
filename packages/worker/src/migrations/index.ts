import { migrations, locks } from "@budibase/backend-core"
import {
  Migration,
  MigrationOptions,
  MigrationName,
  LockType,
  LockName,
} from "@budibase/types"
import env from "../environment"

// migration functions
import * as syncUserInfo from "./functions/globalInfoSyncUsers"

/**
 * Populate the migration function and additional configuration from
 * the static migration definitions.
 */
export const buildMigrations = () => {
  const definitions = migrations.DEFINITIONS
  const workerMigrations: Migration[] = []

  for (const definition of definitions) {
    switch (definition.name) {
      case MigrationName.GLOBAL_INFO_SYNC_USERS: {
        // only needed in cloud
        if (!env.SELF_HOSTED) {
          workerMigrations.push({
            ...definition,
            fn: syncUserInfo.run,
          })
        }
        break
      }
    }
  }

  return workerMigrations
}

export const MIGRATIONS = buildMigrations()

export const migrate = async (options?: MigrationOptions) => {
  if (env.SELF_HOSTED) {
    await migrateWithLock(options)
  } else {
    await migrations.runMigrations(MIGRATIONS, options)
  }
}

const migrateWithLock = async (options?: MigrationOptions) => {
  await locks.doWithLock(
    {
      type: LockType.TRY_ONCE,
      name: LockName.MIGRATIONS,
      ttl: 1000 * 60 * 15, // auto expire the migration lock after 15 minutes
      systemLock: true,
    },
    async () => {
      await migrations.runMigrations(MIGRATIONS, options)
    }
  )
}
