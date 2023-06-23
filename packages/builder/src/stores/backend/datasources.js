import { writable, derived, get } from "svelte/store"
import { queries, tables } from "./"
import { API } from "api"

export function createDatasourcesStore() {
  const store = writable({
    list: [],
    selectedDatasourceId: null,
    schemaError: null,
  })
  const derivedStore = derived(store, $store => ({
    ...$store,
    selected: $store.list?.find(ds => ds._id === $store.selectedDatasourceId),
  }))

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
    const response = await API.buildDatasourceSchema({
      datasourceId: datasource?._id,
      tablesFilter,
    })
    return updateDatasource(response)
  }

  const save = async (body, { fetchSchema, tablesFilter } = {}) => {
    if (fetchSchema == null) {
      fetchSchema = false
    }
    let response
    if (body._id) {
      response = await API.updateDatasource(body)
    } else {
      response = await API.createDatasource({
        datasource: body,
        fetchSchema,
        tablesFilter,
      })
    }
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

  return {
    subscribe: derivedStore.subscribe,
    fetch,
    init: fetch,
    select,
    updateSchema,
    save,
    delete: deleteDatasource,
    removeSchemaError,
    replaceDatasource,
  }
}

export const datasources = createDatasourcesStore()
