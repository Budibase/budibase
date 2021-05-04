import { writable, get } from "svelte/store"
import { tables } from "./"
import api from "builderStore/api"

export function createViewsStore() {
  const { subscribe, update } = writable({
    list: [],
    selected: null,
  })

  return {
    subscribe,
    select: async view => {
      update(state => ({
        ...state,
        selected: view,
      }))
    },
    delete: async view => {
      await api.delete(`/api/views/${view}`)
      await tables.fetch()
    },
    save: async view => {
      const response = await api.post(`/api/views`, view)
      const json = await response.json()

      const viewMeta = {
        name: view.name,
        ...json,
      }

      const viewTable = get(tables).list.find(
        table => table._id === view.tableId
      )

      if (view.originalName) delete viewTable.views[view.originalName]
      viewTable.views[view.name] = viewMeta
      await tables.save(viewTable)

      update(state => ({ ...state, selected: viewMeta }))
    },
  }
}

export const views = createViewsStore()
