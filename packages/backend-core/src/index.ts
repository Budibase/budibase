import db from "./db"
import errors from "./errors"
import * as events from "./events"

export = {
  init(opts: any = {}) {
    db.init(opts.db)
  },
  // some default exports from the library, however these ideally shouldn't
  // be used, instead the syntax require("@budibase/backend-core/db") should be used
  StaticDatabases: require("./db/utils").StaticDatabases,
  db: require("../db"),
  redis: require("../redis"),
  objectStore: require("../objectStore"),
  utils: require("../utils"),
  users: require("./users"),
  cache: require("../cache"),
  auth: require("../auth"),
  constants: require("../constants"),
  migrations: require("../migrations"),
  errors,
  ...errors.errors,
  env: require("./environment"),
  accounts: require("./cloud/accounts"),
  tenancy: require("./tenancy"),
  featureFlags: require("./featureFlags"),
  events,
  analytics: require("./analytics"),
  sessions: require("./security/sessions"),
  deprovisioning: require("./context/deprovision"),
}
