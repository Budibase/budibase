import { environmentVariables } from "@budibase/pro"
import { context } from "@budibase/backend-core"
import { processObject } from "@budibase/string-templates"
import { Datasource } from "@budibase/types"
import { cloneDeep } from "lodash/fp"

export async function enrichDatasourceWithValues(datasource: Datasource) {
  const cloned = cloneDeep(datasource)
  const envVars = await environmentVariables.fetchValues()
  return (await processObject(cloned, envVars)) as Datasource
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
