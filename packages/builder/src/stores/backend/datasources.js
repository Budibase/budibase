import { writable } from "svelte/store"
import { queries, tables, views } from "./"
import api from "../../builderStore/api"

export const INITIAL_DATASOURCE_VALUES = {
  list: [],
  selected: null,
}

export function createDatasourcesStore() {
  const { subscribe, update, set } = writable(INITIAL_DATASOURCE_VALUES)

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
      update(state => ({ ...state, list: json, selected: null }))
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
    save: async datasource => {
      let url = "/api/datasources"

      const response = await api.post(url, datasource)
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
