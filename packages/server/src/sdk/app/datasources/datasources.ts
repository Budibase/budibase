import { context } from "@budibase/backend-core"
import { processObjectSync, findHBSBlocks } from "@budibase/string-templates"
import {
  Datasource,
  DatasourceFieldType,
  Integration,
  PASSWORD_REPLACEMENT,
} from "@budibase/types"
import { cloneDeep } from "lodash/fp"
import { getEnvironmentVariables } from "../../utils"
import { getDefinitions } from "../../../integrations"

const ENV_VAR_PREFIX = "env."

async function enrichDatasourceWithValues(datasource: Datasource) {
  const cloned = cloneDeep(datasource)
  const env = await getEnvironmentVariables()
  const processed = processObjectSync(cloned, { env })
  return {
    datasource: processed as Datasource,
    envVars: env as Record<string, string>,
  }
}

export async function enrich(datasource: Datasource) {
  const { datasource: response } = await enrichDatasourceWithValues(datasource)
  return response
}

export async function get(
  datasourceId: string,
  opts?: { enriched: boolean }
): Promise<Datasource> {
  const appDb = context.getAppDB()
  const datasource = await appDb.get(datasourceId)
  if (opts?.enriched) {
    return (await enrichDatasourceWithValues(datasource)).datasource
  } else {
    return datasource
  }
}

export async function getWithEnvVars(datasourceId: string) {
  const appDb = context.getAppDB()
  const datasource = await appDb.get(datasourceId)
  const blocks = findHBSBlocks(JSON.stringify(datasource))
  const usesEnvVars =
    blocks.find(block => block.includes(ENV_VAR_PREFIX)) != null
  if (usesEnvVars) {
    return enrichDatasourceWithValues(datasource)
  } else {
    return datasource
  }
}

export function isValid(datasource: Datasource) {
  const blocks = findHBSBlocks(JSON.stringify(datasource))
  const validList = blocks.filter(block => block.includes(ENV_VAR_PREFIX))
  return blocks.length === validList.length
}

export async function removeSecrets(datasources: Datasource[]) {
  const definitions = await getDefinitions()
  for (let datasource of datasources) {
    const schema = definitions[datasource.source]
    if (datasource.config) {
      // strip secrets from response, so they don't show in the network request
      if (datasource.config.auth) {
        delete datasource.config.auth
      }
      // remove passwords
      for (let key of Object.keys(datasource.config)) {
        if (typeof datasource.config[key] !== "string") {
          continue
        }
        const blocks = findHBSBlocks(datasource.config[key] as string)
        const usesEnvVars =
          blocks.find(block => block.includes(ENV_VAR_PREFIX)) != null
        if (
          !usesEnvVars &&
          schema.datasource?.[key]?.type === DatasourceFieldType.PASSWORD
        ) {
          datasource.config[key] = PASSWORD_REPLACEMENT
        }
      }
    }
  }
  return datasources
}

export async function removeSecretSingle(datasource: Datasource) {
  return (await removeSecrets([datasource]))[0]
}
