import { init as coreInit } from "@budibase/backend-core"
import env = require("../environment")

export function init() {
  const dbConfig: any = {
    replication: true,
    find: true,
  }

  if (env.isTest() && !env.COUCH_DB_URL) {
    dbConfig.inMemory = true
    dbConfig.allDbs = true
  }

  coreInit({ db: dbConfig })
}
