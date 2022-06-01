import { migrations, redis } from "@budibase/backend-core"

// migration functions
import * as userEmailViewCasing from "./functions/userEmailViewCasing"
import * as quota1 from "./functions/quotas1"
import * as appUrls from "./functions/appUrls"
import * as developerQuota from "./functions/developerQuota"
import * as publishedAppsQuota from "./functions/publishedAppsQuota"
import * as backfill from "./functions/backfill"
import env from "../environment"

export interface Migration {
  type: string
  name: string
  opts?: object
  fn: Function
  silent?: boolean
  preventRetry?: boolean
}

/**
 * e.g.
 * {
 *   tenantIds: ['bb'],
 *   force: {
 *    global: ['quota_1']
 *   }
 * }
 */
export interface MigrationOptions {
  tenantIds?: string[]
  force?: {
    [type: string]: string[]
  }
}

export const MIGRATIONS: Migration[] = [
  {
    type: migrations.MIGRATION_TYPES.GLOBAL,
    name: "user_email_view_casing",
    fn: userEmailViewCasing.run,
  },
  {
    type: migrations.MIGRATION_TYPES.GLOBAL,
    name: "quotas_1",
    fn: quota1.run,
  },
  {
    type: migrations.MIGRATION_TYPES.APP,
    name: "app_urls",
    opts: { all: true },
    fn: appUrls.run,
  },
  {
    type: migrations.MIGRATION_TYPES.GLOBAL,
    name: "developer_quota",
    fn: developerQuota.run,
  },
  {
    type: migrations.MIGRATION_TYPES.GLOBAL,
    name: "published_apps_quota",
    fn: publishedAppsQuota.run,
  },
  {
    type: migrations.MIGRATION_TYPES.APP,
    name: "event_app_backfill",
    opts: { all: true },
    fn: backfill.app.run,
    silent: !!env.SELF_HOSTED, // reduce noisy logging
    preventRetry: !!env.SELF_HOSTED, // only ever run once
  },
  {
    type: migrations.MIGRATION_TYPES.GLOBAL,
    name: "event_global_backfill",
    fn: backfill.global.run,
    silent: !!env.SELF_HOSTED, // reduce noisy logging
    preventRetry: !!env.SELF_HOSTED, // only ever run once
  },
  {
    type: migrations.MIGRATION_TYPES.INSTALLATION,
    name: "event_installation_backfill",
    fn: backfill.installation.run,
    silent: !!env.SELF_HOSTED, // reduce noisy logging
    preventRetry: !!env.SELF_HOSTED, // only ever run once
  },
]

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
