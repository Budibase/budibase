import { datasources, tables } from "../stores/backend"
import { IntegrationNames } from "../constants/backend"
import { get } from "svelte/store"
import cloneDeep from "lodash/cloneDeepWith"
import { API } from "api"

function prepareData(config) {
  let datasource = {}
  let existingTypeCount = get(datasources).list.filter(
    ds => ds.source === config.type
  ).length

  let baseName = IntegrationNames[config.type] || config.name
  let name =
    existingTypeCount === 0 ? baseName : `${baseName}-${existingTypeCount + 1}`

  datasource.type = "datasource"
  datasource.source = config.type
  datasource.config = config.config
  datasource.name = name
  datasource.plus = config.plus

  return datasource
}

export async function saveDatasource(config, { skipFetch, tablesFilter } = {}) {
  const datasource = prepareData(config)
  // Create datasource
  const fetchSchema = !skipFetch && datasource.plus
  const resp = await datasources.save(datasource, { fetchSchema, tablesFilter })

  // update the tables incase datasource plus
  await tables.fetch()
  await datasources.select(resp._id)
  return resp
}

export async function createRestDatasource(integration) {
  const config = cloneDeep(integration)
  return saveDatasource(config)
}

export async function validateDatasourceConfig(config) {
  const datasource = prepareData(config)
  return await API.validateDatasource(datasource)
}

export async function getDatasourceInfo(config) {
  let datasource = config
  if (!config._id) {
    datasource = prepareData(config)
  }
  return await API.fetchInfoForDatasource(datasource)
}
