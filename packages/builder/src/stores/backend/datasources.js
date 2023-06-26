import { writable, derived, get } from "svelte/store"
import {
  IntegrationTypes,
  DEFAULT_BB_DATASOURCE_ID,
  BUDIBASE_INTERNAL_DB_ID,
} from "constants/backend"
import { queries, tables } from "./"
import { API } from "api"
import { DatasourceFeature } from "@budibase/types"
import { TableNames } from "constants"

export class ImportTableError extends Error {
  constructor(message) {
    super(message)
    const [title, description] = message.split(" - ")

    this.name = "TableSelectionError"
    // Capitalize the first character of both the title and description
    this.title = title[0].toUpperCase() + title.substr(1)
    this.description = description[0].toUpperCase() + description.substr(1)
  }
}

export function createDatasourcesStore() {
  const store = writable({
    list: [],
    selectedDatasourceId: null,
    schemaError: null,
  })

  const derivedStore = derived([store, tables], ([$store, $tables]) => {
    // Set the internal datasource entities from the table list, which we're
    // able to keep updated unlike the egress generated definition of the
    // internal datasource
    let internalDS = $store.list?.find(ds => ds._id === BUDIBASE_INTERNAL_DB_ID)
    let otherDS = $store.list?.find(ds => ds._id !== BUDIBASE_INTERNAL_DB_ID)
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
      hasDefaultData: list?.some(
        datasource => datasource._id === DEFAULT_BB_DATASOURCE_ID
      ),
      hasData: !!internalDS?.entities?.length || list?.length > 1,
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
      // Remove any possible schema error
      schemaError: null,
    }))
  }

  const updateDatasource = response => {
    const { datasource, error } = response
    store.update(state => {
      const currentIdx = state.list.findIndex(ds => ds._id === datasource._id)
      const sources = state.list
      if (currentIdx >= 0) {
        sources.splice(currentIdx, 1, datasource)
      } else {
        sources.push(datasource)
      }
      return {
        list: sources,
        selectedDatasourceId: datasource._id,
        schemaError: error,
      }
    })
    return datasource
  }

  const updateSchema = async (datasource, tablesFilter) => {
    try {
      const response = await API.buildDatasourceSchema({
        datasourceId: datasource?._id,
        tablesFilter,
      })
      updateDatasource(response)
    } catch (e) {
      // buildDatasourceSchema call returns user presentable errors with two parts divided with a " - ".
      if (e.message.split(" - ").length === 2) {
        throw new ImportTableError(e.message)
      } else {
        throw e
      }
    }
  }

  const sourceCount = source => {
    return get(store).list.filter(datasource => datasource.source === source)
      .length
  }

  const isDatasourceInvalid = async (integration, datasource) => {
    if (integration.features?.[DatasourceFeature.CONNECTION_CHECKING]) {
      const { connected } = await API.validateDatasource(datasource)
      if (!connected) return true
    }

    return false
  }

  const create = async ({ integration, config }) => {
    const datasource = {
      type: "datasource",
      source: integration.name,
      config,
      name: `${integration.friendlyName}-${sourceCount(integration.name) + 1}`,
      plus: integration.plus && integration.name !== IntegrationTypes.REST,
    }

    if (await isDatasourceInvalid(integration, datasource)) {
      throw new Error("Unable to connect")
    }

    const response = await API.createDatasource({
      datasource,
      fetchSchema:
        integration.plus && integration.name !== IntegrationTypes.GOOGLE_SHEETS,
    })

    return updateDatasource(response)
  }

  const update = async ({ integration, datasource }) => {
    if (await isDatasourceInvalid(integration, datasource)) {
      throw new Error("Unable to connect")
    }

    const response = await API.updateDatasource(datasource)

    return updateDatasource(response)
  }

  const deleteDatasource = async datasource => {
    await API.deleteDatasource({
      datasourceId: datasource?._id,
      datasourceRev: datasource?._rev,
    })
    store.update(state => {
      const sources = state.list.filter(
        existing => existing._id !== datasource._id
      )
      return { list: sources, selected: null }
    })
    await queries.fetch()
    await tables.fetch()
  }

  const removeSchemaError = () => {
    store.update(state => {
      return { ...state, schemaError: null }
    })
  }

  // Handles external updates of datasources
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
    removeSchemaError,
    replaceDatasource,
    getTableNames,
  }
}

export const datasources = createDatasourcesStore()
