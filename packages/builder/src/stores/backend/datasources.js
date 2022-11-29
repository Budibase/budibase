import { writable, get } from "svelte/store"
import { queries, tables, views } from "./"
import { API } from "api"

export const INITIAL_DATASOURCE_VALUES = {
  list: [],
  selected: null,
  schemaError: null,
}

export function createDatasourcesStore() {
  const store = writable(INITIAL_DATASOURCE_VALUES)
  const { subscribe, update, set } = store

  async function updateDatasource(response) {
    const { datasource, error } = response
    update(state => {
      const currentIdx = state.list.findIndex(ds => ds._id === datasource._id)
      const sources = state.list
      if (currentIdx >= 0) {
        sources.splice(currentIdx, 1, datasource)
      } else {
        sources.push(datasource)
      }
      return {
        list: sources,
        selected: datasource._id,
        schemaError: error,
      }
    })
    return datasource
  }

  return {
    subscribe,
    update,
    init: async () => {
      const datasources = await API.getDatasources()
      set({
        list: datasources,
        selected: null,
      })
    },
    fetch: async () => {
      const datasources = await API.getDatasources()

      // Clear selected if it no longer exists, otherwise keep it
      const selected = get(store).selected
      let nextSelected = null
      if (selected && datasources.find(source => source._id === selected)) {
        nextSelected = selected
      }

      update(state => ({ ...state, list: datasources, selected: nextSelected }))
    },
    select: datasourceId => {
      update(state => ({ ...state, selected: datasourceId }))
      queries.unselect()
      tables.unselect()
      views.unselect()
    },
    unselect: () => {
      update(state => ({ ...state, selected: null }))
    },
    updateSchema: async (datasource, tablesFilter) => {
      const response = await API.buildDatasourceSchema({
        datasourceId: datasource?._id,
        tablesFilter,
      })
      return await updateDatasource(response)
    },
    save: async (body, fetchSchema = false) => {
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
    },
    delete: async datasource => {
      await API.deleteDatasource({
        datasourceId: datasource?._id,
        datasourceRev: datasource?._rev,
      })
      update(state => {
        const sources = state.list.filter(
          existing => existing._id !== datasource._id
        )
        return { list: sources, selected: null }
      })
      await queries.fetch()
      await tables.fetch()
    },
    removeSchemaError: () => {
      update(state => {
        return { ...state, schemaError: null }
      })
    },
  }
}

export const datasources = createDatasourcesStore()
