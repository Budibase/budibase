import * as core from "@budibase/backend-core"
import env from "../environment"

export async function init() {
  const dbConfig: any = {
    replication: true,
    find: true,
  }

  if (env.isTest() && !env.COUCH_DB_URL) {
    dbConfig.inMemory = true
    dbConfig.allDbs = true
  }

  await core.init({ db: dbConfig })
}
