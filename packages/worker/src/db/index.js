const core = require("@budibase/backend-core")
const env = require("../environment")

exports.init = () => {
  const dbConfig = {}
  if (env.isTest()) {
    dbConfig.inMemory = true
  }

  if (env.isCypress()) {
    dbConfig.allDbs = true
  }

  core.init({ db: dbConfig })
}
