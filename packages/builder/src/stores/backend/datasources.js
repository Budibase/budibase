import { writable, derived } from "svelte/store"
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

  const save = async (body, fetchSchema = false) => {
    let response
    if (body._id) {
      response = await API.updateDatasource(body)
    } else {
      response = await API.createDatasource({
        datasource: body,
        fetchSchema,
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

  return {
    subscribe: derivedStore.subscribe,
    fetch,
    init: fetch,
    select,
    updateSchema,
    save,
    delete: deleteDatasource,
    removeSchemaError,
  }
}

export const datasources = createDatasourcesStore()
