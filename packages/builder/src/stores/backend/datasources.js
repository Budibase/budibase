import { writable, get } from "svelte/store"
import { queries, tables, views } from "./"
import api from "../../builderStore/api"

export const INITIAL_DATASOURCE_VALUES = {
  list: [],
  selected: null,
}

export function createDatasourcesStore() {
  const store = writable(INITIAL_DATASOURCE_VALUES)
  const { subscribe, update, set } = store

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
      const json = await response.json()

      if (response.status !== 200) {
        throw new Error(json.message)
      }

      update(state => {
        const currentIdx = state.list.findIndex(ds => ds._id === json._id)

        const sources = state.list

        if (currentIdx >= 0) {
          sources.splice(currentIdx, 1, json)
        } else {
          sources.push(json)
        }

        return { list: sources, selected: json._id }
      })
      return json
    },
    save: async (datasource, fetchSchema = false) => {
      let response
      if (datasource._id) {
        response = await api.put(
          `/api/datasources/${datasource._id}`,
          datasource
        )
      } else {
        response = await api.post("/api/datasources", {
          datasource: datasource,
          fetchSchema,
        })
      }

      const json = await response.json()

      if (response.status !== 200) {
        throw new Error(json.message)
      }

      update(state => {
        const currentIdx = state.list.findIndex(ds => ds._id === json._id)

        const sources = state.list

        if (currentIdx >= 0) {
          sources.splice(currentIdx, 1, json)
        } else {
          sources.push(json)
        }

        return { list: sources, selected: json._id }
      })
      return json
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

      return response
    },
  }
}

export const datasources = createDatasourcesStore()
