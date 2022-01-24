import CouchDB from "../db"
const {
  MIGRATION_TYPES,
  runMigrations,
} = require("@budibase/backend-core/migrations")

// migration functions
import * as userEmailViewCasing from "./functions/userEmailViewCasing"
import * as quota1 from "./functions/quotas1"

export interface Migration {
  type: string
  name: string
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

const MIGRATIONS: Migration[] = [
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
]

export const migrate = async (options?: MigrationOptions) => {
  await runMigrations(CouchDB, MIGRATIONS, options)
}
