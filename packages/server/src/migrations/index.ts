import { migrations, redis } from "@budibase/backend-core"
import { Migration, MigrationOptions, MigrationName } from "@budibase/types"
import env from "../environment"

// migration functions
import * as userEmailViewCasing from "./functions/userEmailViewCasing"
import * as quota1 from "./functions/quotas1"
import * as appUrls from "./functions/appUrls"
import * as backfill from "./functions/backfill"
import * as pluginCount from "./functions/pluginCount"

/**
 * Populate the migration function and additional configuration from
 * the static migration definitions.
 */
export const buildMigrations = () => {
  const definitions = migrations.DEFINITIONS
  const serverMigrations: Migration[] = []

  for (const definition of definitions) {
    switch (definition.name) {
      case MigrationName.USER_EMAIL_VIEW_CASING: {
        serverMigrations.push({
          ...definition,
          fn: userEmailViewCasing.run,
        })
        break
      }
      case MigrationName.QUOTAS_1: {
        serverMigrations.push({
          ...definition,
          fn: quota1.run,
        })
        break
      }
      case MigrationName.APP_URLS: {
        serverMigrations.push({
          ...definition,
          appOpts: { all: true },
          fn: appUrls.run,
        })
        break
      }
      case MigrationName.EVENT_APP_BACKFILL: {
        serverMigrations.push({
          ...definition,
          appOpts: { all: true },
          fn: backfill.app.run,
          silent: !!env.SELF_HOSTED, // reduce noisy logging
          preventRetry: !!env.SELF_HOSTED, // only ever run once
        })
        break
      }
      case MigrationName.EVENT_GLOBAL_BACKFILL: {
        serverMigrations.push({
          ...definition,
          fn: backfill.global.run,
          silent: !!env.SELF_HOSTED, // reduce noisy logging
          preventRetry: !!env.SELF_HOSTED, // only ever run once
        })
        break
      }
      case MigrationName.EVENT_INSTALLATION_BACKFILL: {
        serverMigrations.push({
          ...definition,
          fn: backfill.installation.run,
          silent: !!env.SELF_HOSTED, // reduce noisy logging
          preventRetry: !!env.SELF_HOSTED, // only ever run once
        })
        break
      }
      case MigrationName.PLUGIN_COUNT: {
        if (env.SELF_HOSTED) {
          serverMigrations.push({
            ...definition,
            fn: pluginCount.run,
            silent: !!env.SELF_HOSTED,
            preventRetry: false,
          })
        }
      }
    }
  }

  return serverMigrations
}

export const MIGRATIONS = buildMigrations()

export const migrate = async (options?: MigrationOptions) => {
  if (env.SELF_HOSTED) {
    // self host runs migrations on startup
    // make sure only a single instance runs them
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
