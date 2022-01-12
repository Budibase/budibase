const { setDB } = require("./db")

module.exports = {
  init(pouch) {
    setDB(pouch)
  },
  // some default exports from the library, however these ideally shouldn't
  // be used, instead the syntax require("@budibase/backend-core/db") should be used
  StaticDatabases: require("./db/utils").StaticDatabases,
  db: require("../db"),
  redis: require("../redis"),
  objectStore: require("../objectStore"),
  utils: require("../utils"),
  cache: require("../cache"),
  auth: require("../auth"),
  constants: require("../constants"),
  migrations: require("../migrations"),
}
