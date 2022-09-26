const core = require("@budibase/backend-core")
const env = require("../environment")

exports.init = () => {
  const dbConfig = {}
  if (env.isTest() && !env.COUCH_DB_URL) {
    dbConfig.inMemory = true
    dbConfig.allDbs = true
  }
  core.init({ db: dbConfig })
}
