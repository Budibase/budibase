import { migrations } from "@budibase/backend-core"

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
  },
  {
    type: migrations.MIGRATION_TYPES.GLOBAL,
    name: "event_global_backfill",
    fn: backfill.global.run,
    silent: !!env.SELF_HOSTED, // reduce noisy logging
  },
]

export const migrate = async (options?: MigrationOptions) => {
  await migrations.runMigrations(MIGRATIONS, options)
}
