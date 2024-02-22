import { writable, derived, get } from "svelte/store"
import {
  IntegrationTypes,
  DEFAULT_BB_DATASOURCE_ID,
  BUDIBASE_INTERNAL_DB_ID,
} from "constants/backend"
import { tables } from "./tables"
import { queries } from "./queries"
import { API } from "api"
import { DatasourceFeature } from "@budibase/types"
import { TableNames } from "constants"

class TableImportError extends Error {
  constructor(errors) {
    super()
    this.name = "TableImportError"
    this.errors = errors
  }

  get description() {
    let message = ""
    for (const key in this.errors) {
      message += `${key}: ${this.errors[key]}\n`
    }
    return message
  }
}

export function createDatasourcesStore() {
  const store = writable({
    list: [],
    selectedDatasourceId: null,
  })

  const derivedStore = derived([store, tables], ([$store, $tables]) => {
    // Set the internal datasource entities from the table list, which we're
    // able to keep updated unlike the egress generated definition of the
    // internal datasource
    let internalDS = $store.list?.find(ds => ds._id === BUDIBASE_INTERNAL_DB_ID)
    let otherDS = $store.list?.filter(ds => ds._id !== BUDIBASE_INTERNAL_DB_ID)
    if (internalDS) {
      internalDS = {
        ...internalDS,
        entities: $tables.list?.filter(table => {
          return (
            table.sourceId === BUDIBASE_INTERNAL_DB_ID &&
            table._id !== TableNames.USERS
          )
        }),
      }
    }

    // Build up enriched DS list
    // Only add the internal DS if we have at least one non-users table
    let list = []
    if (internalDS?.entities?.length) {
      list.push(internalDS)
    }
    list = list.concat(otherDS || [])

    return {
      ...$store,
      list,
      selected: list?.find(ds => ds._id === $store.selectedDatasourceId),
      hasDefaultData: list?.some(ds => ds._id === DEFAULT_BB_DATASOURCE_ID),
      hasData: list?.length > 0,
    }
  })

  const fetch = async () => {
    const datasources = await API.getDatasources()
    store.update(state => ({
      ...state,
      list: datasources,
    }))
  }

  const select = id => {
    store.update(state => ({
      ...state,
      selectedDatasourceId: id,
    }))
  }

  const updateDatasource = (response, { ignoreErrors } = {}) => {
    const { datasource, errors } = response
    if (!ignoreErrors && errors && Object.keys(errors).length > 0) {
      throw new TableImportError(errors)
    }
    replaceDatasource(datasource._id, datasource)
    select(datasource._id)
    return datasource
  }

  const updateSchema = async (datasource, tablesFilter) => {
    const response = await API.buildDatasourceSchema({
      datasourceId: datasource?._id,
      tablesFilter,
    })
    updateDatasource(response)
  }

  const sourceCount = source => {
    return get(store).list.filter(datasource => datasource.source === source)
      .length
  }

  const checkDatasourceValidity = async (integration, datasource) => {
    if (integration.features?.[DatasourceFeature.CONNECTION_CHECKING]) {
      const { connected, error } = await API.validateDatasource(datasource)
      if (connected) {
        return
      }

      throw new Error(`Unable to connect: ${error}`)
    }
  }

  const create = async ({ integration, config }) => {
    const count = sourceCount(integration.name)
    const nameModifier = count === 0 ? "" : ` ${count + 1}`

    const datasource = {
      type: "datasource",
      source: integration.name,
      config,
      name: `${integration.friendlyName}${nameModifier}`,
      plus: integration.plus && integration.name !== IntegrationTypes.REST,
      isSQL: integration.isSQL,
    }

    if (await checkDatasourceValidity(integration, datasource)) {
      throw new Error("Unable to connect")
    }

    const response = await API.createDatasource({
      datasource,
      fetchSchema: integration.plus,
    })

    return updateDatasource(response, { ignoreErrors: true })
  }

  const update = async ({ integration, datasource }) => {
    if (await checkDatasourceValidity(integration, datasource)) {
      throw new Error("Unable to connect")
    }

    const response = await API.updateDatasource(datasource)

    return updateDatasource(response)
  }

  const deleteDatasource = async datasource => {
    if (!datasource?._id || !datasource?._rev) {
      return
    }
    await API.deleteDatasource({
      datasourceId: datasource._id,
      datasourceRev: datasource._rev,
    })
    replaceDatasource(datasource._id, null)
  }

  const replaceDatasource = (datasourceId, datasource) => {
    if (!datasourceId) {
      return
    }

    // Handle deletion
    if (!datasource) {
      store.update(state => ({
        ...state,
        list: state.list.filter(x => x._id !== datasourceId),
      }))
      tables.removeDatasourceTables(datasourceId)
      queries.removeDatasourceQueries(datasourceId)
      return
    }

    // Add new datasource
    const index = get(store).list.findIndex(x => x._id === datasource._id)
    if (index === -1) {
      store.update(state => ({
        ...state,
        list: [...state.list, datasource],
      }))

      // If this is a new datasource then we should refresh the tables list,
      // because otherwise we'll never see the new tables
      tables.fetch()
    }

    // Update existing datasource
    else if (datasource) {
      store.update(state => {
        state.list[index] = datasource
        return state
      })
    }
  }

  const getTableNames = async datasource => {
    const info = await API.fetchInfoForDatasource(datasource)
    return info.tableNames || []
  }

  return {
    subscribe: derivedStore.subscribe,
    fetch,
    init: fetch,
    select,
    updateSchema,
    create,
    update,
    delete: deleteDatasource,
    replaceDatasource,
    getTableNames,
  }
}

export const datasources = createDatasourcesStore()
