import { writable } from "svelte/store"
import api from "../../api"

function createDatasourcesStore() {
  const { subscribe, update, set } = writable({
    list: [],
    selected: null,
  })

  return {
    subscribe,
    set,
    update,
    fetch: async () => {
      const response = await api.get(`/api/datasources`)
      const json = await response.json()
      update(state => ({ ...state, list: json }))
      return json
    },
    select: async datasourceId => {
      update(state => ({ ...state, selected: datasourceId }))
    },
    save: async datasource => {
      const response = await api.post("/api/datasources", datasource)
      const json = await response.json()

      update(state => {
        const currentIdx = state.list.findIndex(ds => ds._id === json._id)

        const sources = state.list

        if (currentIdx >= 0) {
          sources.splice(currentIdx, 1, json)
        } else {
          sources.push(json)
        }

        return { sources, selected: json._id }
      })
      return json
    },
    delete: async datasource => {
      await api.delete(`/api/datasources/${datasource._id}/${datasource._rev}`)
      update(state => {
        const sources = state.list.filter(
          existing => existing._id !== datasource._id
        )
        return { sources, selected: null }
      })
    },
  }
}

export const datasources = createDatasourcesStore()
