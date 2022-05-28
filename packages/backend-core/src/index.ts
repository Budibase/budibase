import db from "./db"
import errors from "./errors"
import * as events from "./events"
import * as migrations from "./migrations"
import * as users from "./users"
import * as accounts from "./cloud/accounts"
import * as installation from "./installation"
import env from "./environment"
import tenancy from "./tenancy"
import featureFlags from "./featureFlags"
import sessions from "./security/sessions"
import deprovisioning from "./context/deprovision"

// outer packages
import dbPkg from "../db"
import redis from "../redis"
import objectStore from "../objectStore"
import utils from "../utils"
import cache from "../cache"
import auth from "../auth"
import constants from "../constants"
import context from "../context"

export = {
  init(opts: any = {}) {
    db.init(opts.db)
  },
  // some default exports from the library, however these ideally shouldn't
  // be used, instead the syntax require("@budibase/backend-core/db") should be used
  StaticDatabases: dbPkg.StaticDatabases,
  db: dbPkg,
  redis,
  objectStore,
  utils,
  users,
  cache,
  auth,
  constants,
  migrations,
  errors,
  ...errors.errors,
  env,
  accounts,
  tenancy,
  context,
  featureFlags,
  events,
  sessions,
  deprovisioning,
  installation,
}
