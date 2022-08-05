import { migrations, redis } from "@budibase/backend-core"
import { Migration, MigrationOptions, MigrationName } from "@budibase/types"
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
  // get a new lock client
  const redlock = await redis.clients.getMigrationsRedlock()
  // lock for 15 minutes
  const ttl = 1000 * 60 * 15

  let migrationLock

  // acquire lock
  try {
    migrationLock = await redlock.lock("migrations", ttl)
  } catch (e: any) {
    if (e.name === "LockError") {
      return
    } else {
      throw e
    }
  }

  // run migrations
  try {
    await migrations.runMigrations(MIGRATIONS, options)
  } finally {
    // release lock
    try {
      await migrationLock.unlock()
    } catch (e) {
      console.error("unable to release migration lock")
    }
  }
}
