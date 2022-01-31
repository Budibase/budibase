import CouchDB from "../db"
const {
  MIGRATION_TYPES,
  runMigrations,
} = require("@budibase/backend-core/migrations")

// migration functions
import * as userEmailViewCasing from "./functions/userEmailViewCasing"
import * as quota1 from "./functions/quotas1"
import * as appUrls from "./functions/appUrls"

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
  forced?: {
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
    name: "quotas_1",
    fn: quota1.run,
  },
  {
    type: MIGRATION_TYPES.APP,
    name: "app_urls",
    opts: { all: true },
    fn: appUrls.run,
  },
]

export const migrate = async (options?: MigrationOptions) => {
  await runMigrations(CouchDB, MIGRATIONS, options)
}
