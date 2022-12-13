import errors from "./errors"
const errorClasses = errors.errors
import * as events from "./events"
import * as migrations from "./migrations"
import * as users from "./users"
import * as roles from "./security/roles"
import * as permissions from "./security/permissions"
import * as accounts from "./cloud/accounts"
import * as installation from "./installation"
import env from "./environment"
import * as tenancy from "./tenancy"
import * as featureFlags from "./featureFlags"
import * as sessions from "./security/sessions"
import * as deprovisioning from "./context/deprovision"
import * as auth from "./auth"
import * as constants from "./constants"
import * as logging from "./logging"
import * as pino from "./pino"
import * as middleware from "./middleware"
import * as plugins from "./plugin"
import * as encryption from "./security/encryption"
import * as queue from "./queue"
import * as db from "./db"
import * as context from "./context"
import * as cache from "./cache"
import * as objectStore from "./objectStore"
import * as redis from "./redis"
import * as utils from "./utils"

const init = (opts: any = {}) => {
  db.init(opts.db)
}

const core = {
  init,
  db,
  ...constants,
  redis,
  locks: redis.redlock,
  objectStore,
  utils,
  users,
  cache,
  auth,
  constants,
  migrations,
  env,
  accounts,
  tenancy,
  context,
  featureFlags,
  events,
  sessions,
  deprovisioning,
  installation,
  errors,
  logging,
  roles,
  plugins,
  ...pino,
  ...errorClasses,
  middleware,
  encryption,
  queue,
  permissions,
}

export = core
