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
const USER_PREFIX = "user"

async function enrichDatasourceWithValues(datasource: Datasource) {
  const cloned = cloneDeep(datasource)
  const env = await getEnvironmentVariables()
  const processed = processObjectSync(cloned, { env }, { onlyFound: true })
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
  return enrichDatasourceWithValues(datasource)
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

export function mergeConfigs(update: Datasource, old: Datasource) {
  if (!update.config) {
    return update
  }
  for (let [key, value] of Object.entries(update.config)) {
    if (value !== PASSWORD_REPLACEMENT) {
      continue
    }
    if (old.config?.[key]) {
      update.config[key] = old.config?.[key]
    } else {
      delete update.config[key]
    }
  }
  return update
}
