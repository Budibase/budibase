import { locks, migrations } from "@budibase/backend-core"
import {
  Migration,
  MigrationOptions,
  MigrationName,
  LockType,
  LockName,
} from "@budibase/types"
import env from "../environment"

// migration functions
import * as userEmailViewCasing from "./functions/userEmailViewCasing"
import * as syncQuotas from "./functions/syncQuotas"
import * as appUrls from "./functions/appUrls"
import * as tableSettings from "./functions/tableSettings"
import * as backfill from "./functions/backfill"
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
      case MigrationName.SYNC_QUOTAS: {
        serverMigrations.push({
          ...definition,
          fn: syncQuotas.run,
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
      case MigrationName.TABLE_SETTINGS_LINKS_TO_ACTIONS: {
        serverMigrations.push({
          ...definition,
          appOpts: { dev: true },
          fn: tableSettings.run,
        })
        break
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
