import { writable, get } from "svelte/store"
import { tables, datasources, queries } from "./"
import { API } from "api"

export function createViewsStore() {
  const { subscribe, update } = writable({
    list: [],
    selected: null,
  })

  return {
    subscribe,
    update,
    select: view => {
      update(state => ({
        ...state,
        selected: view,
      }))
      tables.unselect()
      queries.unselect()
      datasources.unselect()
    },
    unselect: () => {
      update(state => ({
        ...state,
        selected: null,
      }))
    },
    delete: async view => {
      await API.deleteView(view)
      await tables.fetch()
    },
    save: async view => {
      const savedView = await API.saveView(view)
      const viewMeta = {
        name: view.name,
        ...savedView,
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
