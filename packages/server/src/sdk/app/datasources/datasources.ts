import { context, db as dbCore } from "@budibase/backend-core"
import { findHBSBlocks, processObjectSync } from "@budibase/string-templates"
import {
  Datasource,
  DatasourceFieldType,
  Integration,
  PASSWORD_REPLACEMENT,
  RestAuthConfig,
  RestAuthType,
  RestBasicAuthConfig,
  Row,
  RestConfig,
  SourceName,
} from "@budibase/types"
import { cloneDeep } from "lodash/fp"
import { getEnvironmentVariables } from "../../utils"
import { getDefinitions, getDefinition } from "../../../integrations"
import merge from "lodash/merge"
import {
  BudibaseInternalDB,
  getDatasourceParams,
  getDatasourcePlusParams,
  getTableParams,
} from "../../../db/utils"
import sdk from "../../index"

const ENV_VAR_PREFIX = "env."

export async function fetch() {
  // Get internal tables
  const db = context.getAppDB()
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )

  const internal = internalTables.rows.reduce((acc: any, row: Row) => {
    const sourceId = row.doc.sourceId || "bb_internal"
    acc[sourceId] = acc[sourceId] || []
    acc[sourceId].push(row.doc)
    return acc
  }, {})

  const bbInternalDb = {
    ...BudibaseInternalDB,
  }

  // Get external datasources
  const datasources = (
    await db.allDocs(
      getDatasourceParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)

  const allDatasources: Datasource[] = await sdk.datasources.removeSecrets([
    bbInternalDb,
    ...datasources,
  ])

  for (let datasource of allDatasources) {
    if (datasource.type === dbCore.BUDIBASE_DATASOURCE_TYPE) {
      datasource.entities = internal[datasource._id!]
    }
  }

  return [bbInternalDb, ...datasources]
}

export function areRESTVariablesValid(datasource: Datasource) {
  const restConfig = datasource.config as RestConfig
  const varNames: string[] = []
  if (restConfig.dynamicVariables) {
    for (let variable of restConfig.dynamicVariables) {
      if (varNames.includes(variable.name)) {
        return false
      }
      varNames.push(variable.name)
    }
  }
  if (restConfig.staticVariables) {
    for (let name of Object.keys(restConfig.staticVariables)) {
      if (varNames.includes(name)) {
        return false
      }
      varNames.push(name)
    }
  }
  return true
}

export function checkDatasourceTypes(schema: Integration, config: any) {
  for (let key of Object.keys(config)) {
    if (!schema.datasource[key]) {
      continue
    }
    const type = schema.datasource[key].type
    if (
      type === DatasourceFieldType.NUMBER &&
      typeof config[key] === "string"
    ) {
      config[key] = parseFloat(config[key])
    }
  }
  return config
}

async function enrichDatasourceWithValues(datasource: Datasource) {
  const cloned = cloneDeep(datasource)
  const env = await getEnvironmentVariables()
  //Do not process entities, as we do not want to process formulas
  const { entities, ...clonedWithoutEntities } = cloned
  const processed = processObjectSync(
    clonedWithoutEntities,
    { env },
    { onlyFound: true }
  ) as Datasource
  processed.entities = entities
  const definition = await getDefinition(processed.source)
  processed.config = checkDatasourceTypes(definition!, processed.config)
  return {
    datasource: processed,
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
  const datasource = await appDb.get<Datasource>(datasourceId)
  if (opts?.enriched) {
    return (await enrichDatasourceWithValues(datasource)).datasource
  } else {
    return datasource
  }
}

export async function getWithEnvVars(datasourceId: string) {
  const appDb = context.getAppDB()
  const datasource = await appDb.get<Datasource>(datasourceId)
  return enrichDatasourceWithValues(datasource)
}

function hasAuthConfigs(datasource: Datasource) {
  return datasource.source === SourceName.REST && datasource.config?.authConfigs
}

function useEnvVars(str: any) {
  if (typeof str !== "string") {
    return false
  }
  const blocks = findHBSBlocks(str)
  return blocks.find(block => block.includes(ENV_VAR_PREFIX)) != null
}

export async function removeSecrets(datasources: Datasource[]) {
  const definitions = await getDefinitions()
  for (let datasource of datasources) {
    const schema = definitions[datasource.source]
    if (!schema) {
      continue
    }
    if (datasource.config) {
      // strip secrets from response, so they don't show in the network request
      if (datasource.config.auth) {
        delete datasource.config.auth
      }
      // specific to REST datasources, contains passwords
      if (hasAuthConfigs(datasource)) {
        const configs = datasource.config.authConfigs as RestAuthConfig[]
        for (let config of configs) {
          if (config.type !== RestAuthType.BASIC) {
            continue
          }
          const basic = config.config as RestBasicAuthConfig
          if (!useEnvVars(basic.password)) {
            basic.password = PASSWORD_REPLACEMENT
          }
        }
      }
      // remove general passwords
      for (let key of Object.keys(datasource.config)) {
        if (
          schema.datasource?.[key]?.type === DatasourceFieldType.PASSWORD &&
          !useEnvVars(datasource.config[key])
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
  // specific to REST datasources, fix the auth configs again if required
  if (hasAuthConfigs(update)) {
    const configs = update.config.authConfigs as RestAuthConfig[]
    const oldConfigs = (old.config?.authConfigs as RestAuthConfig[]) || []
    for (let config of configs) {
      if (config.type !== RestAuthType.BASIC) {
        continue
      }
      const basic = config.config as RestBasicAuthConfig
      const oldBasic = oldConfigs.find(old => old.name === config.name)
        ?.config as RestBasicAuthConfig
      if (basic.password === PASSWORD_REPLACEMENT) {
        basic.password = oldBasic.password
      }
    }
  }

  if (old.config?.auth) {
    update.config = merge(old.config, update.config)
  }

  // update back to actual passwords for everything else
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

export async function getExternalDatasources(): Promise<Datasource[]> {
  const db = context.getAppDB()

  const externalDatasources = await db.allDocs<Datasource>(
    getDatasourcePlusParams(undefined, {
      include_docs: true,
    })
  )

  return externalDatasources.rows.map(r => r.doc)
}
