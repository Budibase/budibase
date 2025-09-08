import { context, db as dbCore, events } from "@budibase/backend-core"
import { helpers } from "@budibase/shared-core"
import { findHBSBlocks, processObjectSync } from "@budibase/string-templates"
import {
  Datasource,
  DatasourceFieldType,
  Integration,
  INTERNAL_TABLE_SOURCE_ID,
  PASSWORD_REPLACEMENT,
  RestAuthConfig,
  RestAuthType,
  RestBasicAuthConfig,
  RestConfig,
  Row,
  SourceName,
} from "@budibase/types"
import { cloneDeep } from "lodash/fp"
import merge from "lodash/merge"
import {
  BudibaseInternalDB,
  DocumentType,
  generateDatasourceID,
  getDatasourceParams,
  getDatasourcePlusParams,
  getTableParams,
} from "../../../db/utils"
import {
  getDefinition,
  getDefinitions,
  getIntegration,
} from "../../../integrations"
import { setupCreationAuth as googleSetupCreationAuth } from "../../../integrations/googlesheets"
import sdk from "../../index"
import { getEnvironmentVariables } from "../../utils"

const ENV_VAR_PREFIX = "env."

export function addDatasourceFlags(datasource: Datasource) {
  datasource.isSQL = helpers.isSQL(datasource)
  datasource.usesEnvironmentVariables =
    datasourceUsesEnvironmentVariables(datasource)
  return datasource
}

export async function fetch(opts?: {
  enriched: boolean
}): Promise<Datasource[]> {
  // Get internal tables
  const db = context.getWorkspaceDB()
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )

  const internal = internalTables.rows.reduce((acc: any, row: Row) => {
    const sourceId = row.doc.sourceId || INTERNAL_TABLE_SOURCE_ID
    acc[sourceId] = acc[sourceId] || []
    acc[sourceId].push(row.doc)
    return acc
  }, {})

  const bbInternalDb = {
    ...BudibaseInternalDB,
  } as Datasource

  // Get external datasources
  let datasources = (
    await db.allDocs<Datasource>(
      getDatasourceParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc!)

  const allDatasources: Datasource[] = await sdk.datasources.removeSecrets([
    bbInternalDb,
    ...datasources,
  ])

  for (let datasource of allDatasources) {
    if (datasource.type === dbCore.BUDIBASE_DATASOURCE_TYPE) {
      datasource.entities = internal[datasource._id!]
    }
  }

  datasources = datasources.map(datasource => addDatasourceFlags(datasource))
  if (opts?.enriched) {
    const envVars = await getEnvironmentVariables()
    const promises = datasources.map(datasource =>
      enrichDatasourceWithValues(datasource, envVars)
    )
    const enriched = (await Promise.all(promises)).map(
      result => result.datasource
    )
    return [bbInternalDb, ...enriched]
  } else {
    return [bbInternalDb, ...datasources]
  }
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
    if (!schema.datasource?.[key]) {
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

async function enrichDatasourceWithValues(
  datasource: Datasource,
  variables?: Record<string, string>
) {
  const cloned = cloneDeep(datasource)
  const env = variables ? variables : await getEnvironmentVariables()
  //Do not process entities, as we do not want to process formulas
  const { entities, ...clonedWithoutEntities } = cloned
  const processed = processObjectSync(
    clonedWithoutEntities,
    { env },
    { onlyFound: true }
  ) as Datasource
  processed.entities = entities
  const definition = await getDefinition(processed.source)
  if (definition) {
    processed.config = checkDatasourceTypes(definition, processed.config)
  }
  return {
    datasource: processed,
    envVars: env as Record<string, string>,
  }
}

export async function enrich(datasource: Datasource) {
  datasource = addDatasourceFlags(datasource)
  const { datasource: response } = await enrichDatasourceWithValues(datasource)
  return response
}

export async function get(
  datasourceId: string,
  opts?: { enriched: boolean }
): Promise<Datasource> {
  const appDb = context.getWorkspaceDB()
  let datasource = await appDb.get<Datasource>(datasourceId)
  datasource = addDatasourceFlags(datasource)
  if (opts?.enriched) {
    return (await enrichDatasourceWithValues(datasource)).datasource
  } else {
    return datasource
  }
}

export async function getWithEnvVars(datasourceId: string) {
  const appDb = context.getWorkspaceDB()
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

function datasourceUsesEnvironmentVariables(datasource: Datasource): boolean {
  if (!datasource.config) {
    return false
  }

  const checkValue = (value: any): boolean => {
    if (typeof value === "string") {
      return useEnvVars(value)
    }
    if (typeof value === "object" && value !== null) {
      return Object.values(value).some(checkValue)
    }
    return false
  }

  return Object.values(datasource.config).some(checkValue)
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
  if (!update.config || !old.config) {
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
    if (update.config && old.config && old.config?.[key]) {
      update.config[key] = old.config?.[key]
    } else if (update.config) {
      delete update.config[key]
    }
  }

  return update
}

export async function getExternalDatasources(): Promise<Datasource[]> {
  const db = context.getWorkspaceDB()

  let dsResponse = await db.allDocs<Datasource>(
    getDatasourcePlusParams(undefined, {
      include_docs: true,
    })
  )

  const externalDatasources = dsResponse.rows.map(r => r.doc!)
  return externalDatasources.map(datasource => addDatasourceFlags(datasource))
}

export async function save(
  datasource: Datasource,
  opts?: { fetchSchema?: boolean; tablesFilter?: string[] }
): Promise<{ datasource: Datasource; errors: Record<string, string> }> {
  // getIntegration throws an error if the integration is not found
  await getIntegration(datasource.source)

  const db = context.getWorkspaceDB()
  const plus = datasource.plus

  const fetchSchema = opts?.fetchSchema || false
  const tablesFilter = opts?.tablesFilter || []

  datasource = addDatasourceFlags({
    _id: generateDatasourceID({ plus }),
    ...datasource,
    type: plus ? DocumentType.DATASOURCE_PLUS : DocumentType.DATASOURCE,
  })

  let errors: Record<string, string> = {}
  if (fetchSchema) {
    const schema = await sdk.datasources.buildFilteredSchema(
      datasource,
      tablesFilter
    )
    datasource.entities = schema.tables
    setDefaultDisplayColumns(datasource)
    errors = schema.errors
  }

  if (preSaveAction[datasource.source]) {
    await preSaveAction[datasource.source](datasource)
  }

  const dbResp = await db.put(
    sdk.tables.populateExternalTableSchemas(datasource)
  )
  await events.datasource.created(datasource)
  datasource._rev = dbResp.rev

  return { datasource, errors }
}

const preSaveAction: Partial<Record<SourceName, any>> = {
  [SourceName.GOOGLE_SHEETS]: async (datasource: Datasource) => {
    await googleSetupCreationAuth(datasource.config as any)
  },
}

/**
 * Make sure all datasource entities have a display name selected
 */
export function setDefaultDisplayColumns(datasource: Datasource) {
  for (const entity of Object.values(datasource.entities || {})) {
    if (entity.primaryDisplay) {
      continue
    }
    const notAutoColumn = Object.values(entity.schema).find(
      schema => !schema.autocolumn
    )
    if (notAutoColumn) {
      entity.primaryDisplay = notAutoColumn.name
    }
  }
}
