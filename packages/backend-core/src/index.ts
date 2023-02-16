export * as events from "./events"
export * as migrations from "./migrations"
export * as users from "./users"
export * as roles from "./security/roles"
export * as permissions from "./security/permissions"
export * as accounts from "./cloud/accounts"
export * as installation from "./installation"
export * as tenancy from "./tenancy"
export * as featureFlags from "./featureFlags"
export * as sessions from "./security/sessions"
export * as deprovisioning from "./context/deprovision"
export * as auth from "./auth"
export * as constants from "./constants"
export * as logging from "./logging"
export * as middleware from "./middleware"
export * as plugins from "./plugin"
export * as encryption from "./security/encryption"
export * as queue from "./queue"
export * as db from "./db"
export * as context from "./context"
export * as cache from "./cache"
export * as objectStore from "./objectStore"
export * as redis from "./redis"
export * as utils from "./utils"
export * as errors from "./errors"
export { default as env } from "./environment"

// expose error classes directly
export * from "./errors"

// expose constants directly
export * from "./constants"

// expose inner locks from redis directly
import * as redis from "./redis"
export const locks = redis.redlock

// expose package init function
import * as db from "./db"
export const init = (opts: any = {}) => {
  db.init(opts.db)
}
