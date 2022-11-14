import core from "@budibase/backend-core"
import env from "../environment"

export const init = () => {
  const dbConfig: any = {}
  if (env.isTest() && !env.COUCH_DB_URL) {
    dbConfig.inMemory = true
  }
  core.init({ db: dbConfig })
}
