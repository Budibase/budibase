import { writable, derived, get } from "svelte/store"
import { tables } from "./"
import { API } from "api"

export function createViewsV2Store() {
  const store = writable({
    selectedViewId: null,
  })
  const derivedStore = derived([store, tables], ([$store, $tables]) => {
    let list = []
    $tables.list?.forEach(table => {
      const views = Object.values(table?.views || {}).filter(view => {
        return view.version === 2
      })
      list = list.concat(views)
    })
    return {
      ...$store,
      list,
      selected: list.find(view => view.id === $store.selectedViewId),
    }
  })

  const select = id => {
    store.update(state => ({
      ...state,
      selectedViewId: id,
    }))
  }

  const deleteView = async view => {
    await API.viewV2.delete(view.id)
    replaceView(view.id, null)
  }

  const create = async view => {
    const savedViewResponse = await API.viewV2.create(view)
    const savedView = savedViewResponse.data
    replaceView(savedView.id, savedView)
    return savedView
  }

  const save = async view => {
    const res = await API.viewV2.update(view)
    const savedView = res?.data
    replaceView(view.id, savedView)
  }

  // Handles external updates of tables
  const replaceView = (viewId, view) => {
    if (!viewId) {
      return
    }
    const existingView = get(derivedStore).list.find(view => view.id === viewId)
    const tableIndex = get(tables).list.findIndex(table => {
      return table._id === view?.tableId || table._id === existingView?.tableId
    })
    if (tableIndex === -1) {
      return
    }

    // Handle deletion
    if (!view) {
      tables.update(state => {
        delete state.list[tableIndex].views[existingView.name]
        return state
      })
      return
    }

    // Add new view
    if (!existingView) {
      tables.update(state => {
        state.list[tableIndex].views[view.name] = view
        return state
      })
    }

    // Update existing view
    else {
      tables.update(state => {
        // Remove old view
        delete state.list[tableIndex].views[existingView.name]

        // Add new view
        state.list[tableIndex].views[view.name] = view
        return state
      })
    }
  }

  return {
    subscribe: derivedStore.subscribe,
    select,
    delete: deleteView,
    create,
    save,
    replaceView,
  }
}

export const viewsV2 = createViewsV2Store()
