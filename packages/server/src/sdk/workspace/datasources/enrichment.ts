import { context, NotFoundError } from "@budibase/backend-core"
import { processObjectSync } from "@budibase/string-templates"
import type { Datasource } from "@budibase/types"
import { cloneDeep } from "lodash/fp"
import { getEnvironmentVariables } from "../../utils"

export async function getDatasourceWithEnvVars(datasourceId: string) {
  const datasource = await context
    .getWorkspaceDB()
    .tryGet<Datasource>(datasourceId)
  if (!datasource) {
    throw new NotFoundError(`Datasource '${datasourceId}' not found`)
  }
  return enrichDatasourceWithEnvironmentValues(datasource)
}

export async function enrichDatasourceWithEnvironmentValues(
  datasource: Datasource,
  variables?: Record<string, string>
) {
  const cloned = cloneDeep(datasource)
  const env = variables ? variables : await getEnvironmentVariables()
  // Do not process entities, as we do not want to process formulas
  const { entities, ...clonedWithoutEntities } = cloned
  // Do not process static variables, bindings are not permitted in them
  const staticVariables = clonedWithoutEntities.config?.staticVariables
  if (clonedWithoutEntities.config) {
    delete clonedWithoutEntities.config.staticVariables
  }
  const processed = processObjectSync(
    clonedWithoutEntities,
    { env },
    { onlyFound: true }
  ) as Datasource
  processed.entities = entities
  if (staticVariables && processed.config) {
    processed.config.staticVariables = staticVariables
  }
  return {
    datasource: processed,
    envVars: env as Record<string, string>,
  }
}
