import { writable, get } from "svelte/store"
import { queries, tables, views } from "./"
import api from "../../builderStore/api"

export const INITIAL_DATASOURCE_VALUES = {
  list: [],
  selected: null,
  schemaError: null,
}

export function createDatasourcesStore() {
  const store = writable(INITIAL_DATASOURCE_VALUES)
  const { subscribe, update, set } = store

  async function updateDatasource(response) {
    if (response.status !== 200) {
      throw new Error(await response.text())
    }

    const { datasource, error } = await response.json()
    update(state => {
      const currentIdx = state.list.findIndex(ds => ds._id === datasource._id)

      const sources = state.list

      if (currentIdx >= 0) {
        sources.splice(currentIdx, 1, datasource)
      } else {
        sources.push(datasource)
      }

      return { list: sources, selected: datasource._id, schemaError: error }
    })
    return datasource
  }

  return {
    subscribe,
    update,
    init: async () => {
      const response = await api.get(`/api/datasources`)
      const json = await response.json()
      set({ list: json, selected: null })
    },
    fetch: async () => {
      const response = await api.get(`/api/datasources`)
      const json = await response.json()

      // Clear selected if it no longer exists, otherwise keep it
      const selected = get(store).selected
      let nextSelected = null
      if (selected && json.find(source => source._id === selected)) {
        nextSelected = selected
      }

      update(state => ({ ...state, list: json, selected: nextSelected }))
      return json
    },
    select: async datasourceId => {
      update(state => ({ ...state, selected: datasourceId }))
      queries.unselect()
      tables.unselect()
      views.unselect()
    },
    unselect: () => {
      update(state => ({ ...state, selected: null }))
    },
    updateSchema: async datasource => {
      let url = `/api/datasources/${datasource._id}/schema`

      const response = await api.post(url)
      return updateDatasource(response)
    },
    save: async (body, fetchSchema = false) => {
      let response
      if (body._id) {
        response = await api.put(`/api/datasources/${body._id}`, body)
      } else {
        response = await api.post("/api/datasources", {
          datasource: body,
          fetchSchema,
        })
      }

      return updateDatasource(response)
    },
    delete: async datasource => {
      const response = await api.delete(
        `/api/datasources/${datasource._id}/${datasource._rev}`
      )
      update(state => {
        const sources = state.list.filter(
          existing => existing._id !== datasource._id
        )
        return { list: sources, selected: null }
      })

      await queries.fetch()
      return response
    },
    removeSchemaError: () => {
      update(state => {
        return { ...state, schemaError: null }
      })
    },
  }
}

export const datasources = createDatasourcesStore()
