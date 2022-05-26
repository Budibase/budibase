const {
  MIGRATION_TYPES,
  runMigrations,
} = require("@budibase/backend-core/migrations")

// migration functions
import * as userEmailViewCasing from "./functions/userEmailViewCasing"
import * as quota2 from "./functions/quotas2"
import * as appUrls from "./functions/appUrls"
import * as developerQuota from "./functions/developerQuota"
import * as publishedAppsQuota from "./functions/publishedAppsQuota"

export interface Migration {
  type: string
  name: string
  opts?: object
  fn: Function
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
    type: MIGRATION_TYPES.GLOBAL,
    name: "user_email_view_casing",
    fn: userEmailViewCasing.run,
  },
  {
    type: MIGRATION_TYPES.GLOBAL,
    name: "quotas_2",
    fn: quota2.run,
  },
  {
    type: MIGRATION_TYPES.APP,
    name: "app_urls",
    opts: { all: true },
    fn: appUrls.run,
  },
  {
    type: MIGRATION_TYPES.GLOBAL,
    name: "developer_quota",
    fn: developerQuota.run,
  },
  {
    type: MIGRATION_TYPES.GLOBAL,
    name: "published_apps_quota",
    fn: publishedAppsQuota.run,
  },
]

export const migrate = async (options?: MigrationOptions) => {
  await runMigrations(MIGRATIONS, options)
}
