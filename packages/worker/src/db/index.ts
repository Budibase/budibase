import * as core from "@budibase/backend-core"
import env from "../environment"

export function init() {
  const dbConfig: any = {
    replication: true,
    find: true,
  }

  if (env.isTest() && !env.COUCH_DB_URL) {
    dbConfig.inMemory = true
    dbConfig.allDbs = true
  }

  core.init({ db: dbConfig })
}
