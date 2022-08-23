import errors from "./errors"

const errorClasses = errors.errors
import * as events from "./events"
import * as migrations from "./migrations"
import * as users from "./users"
import * as roles from "./security/roles"
import * as accounts from "./cloud/accounts"
import * as installation from "./installation"
import env from "./environment"
import tenancy from "./tenancy"
import featureFlags from "./featureFlags"
import * as sessions from "./security/sessions"
import deprovisioning from "./context/deprovision"
import auth from "./auth"
import constants from "./constants"
import * as dbConstants from "./db/constants"
import logging from "./logging"
import pino from "./pino"

// mimic the outer package exports
import * as db from "./pkg/db"
import * as objectStore from "./pkg/objectStore"
import * as utils from "./pkg/utils"
import redis from "./pkg/redis"
import cache from "./pkg/cache"
import context from "./pkg/context"

const init = (opts: any = {}) => {
  db.init(opts.db)
}

const core = {
  init,
  db,
  ...dbConstants,
  redis,
  objectStore,
  utils,
  users,
  cache,
  auth,
  constants,
  ...constants,
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
  ...pino,
  ...errorClasses,
}

export = core
