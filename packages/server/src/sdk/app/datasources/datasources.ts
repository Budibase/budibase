import { environmentVariables } from "@budibase/pro"
import { context, db as dbCore } from "@budibase/backend-core"
import { processObjectSync } from "@budibase/string-templates"
import { AppEnvironment, Datasource } from "@budibase/types"
import { cloneDeep } from "lodash/fp"

export async function enrichDatasourceWithValues(datasource: Datasource) {
  const appId = context.getAppId()
  const appEnv = dbCore.isDevAppID(appId)
    ? AppEnvironment.DEVELOPMENT
    : AppEnvironment.PRODUCTION
  const cloned = cloneDeep(datasource)
  const envVars = await environmentVariables.fetchValues(appEnv)
  const processed = processObjectSync(cloned, { env: envVars })
  return processed as Datasource
}

export async function get(
  datasourceId: string,
  opts?: { withEnvVars: boolean }
): Promise<Datasource> {
  const appDb = context.getAppDB()
  const datasource = await appDb.get(datasourceId)
  if (opts?.withEnvVars) {
    return await enrichDatasourceWithValues(datasource)
  } else {
    return datasource
  }
}
