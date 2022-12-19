import { writable, get, derived } from "svelte/store"
import { tables } from "./"
import { API } from "api"

export function createViewsStore() {
  const store = writable({
    selectedViewName: null,
  })
  const derivedStore = derived([store, tables], ([$store, $tables]) => {
    let list = []
    $tables.list?.forEach(table => {
      list = list.concat(Object.values(table?.views || {}))
    })
    return {
      ...$store,
      list,
      selected: list.find(view => view.name === $store.selectedViewName),
    }
  })

  const select = name => {
    store.update(state => ({
      ...state,
      selectedViewName: name,
    }))
  }

  const deleteView = async view => {
    await API.deleteView(view)
    await tables.fetch()
  }

  const save = async view => {
    const savedView = await API.saveView(view)
    const viewMeta = {
      name: view.name,
      ...savedView,
    }

    const viewTable = get(tables).list.find(table => table._id === view.tableId)

    if (view.originalName) delete viewTable.views[view.originalName]
    viewTable.views[view.name] = viewMeta
    await tables.save(viewTable)
  }

  return {
    subscribe: derivedStore.subscribe,
    select,
    delete: deleteView,
    save,
  }
}

export const views = createViewsStore()
