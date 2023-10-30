import { writable, derived, get } from "svelte/store"
import { componentStore } from "stores/frontend"
import { API } from "api"

// Review the purpose of these
const INITIAL_LAYOUT_STATE = {
  layouts: [],
  selectedLayoutId: null,
}

export const createLayoutStore = () => {
  const store = writable({
    ...INITIAL_LAYOUT_STATE,
  })

  const reset = () => {
    store.set({ ...INITIAL_LAYOUT_STATE })
  }

  const syncAppLayouts = pkg => {
    store.update(state => ({
      ...state,
      layouts: [...pkg.layouts],
    }))
  }

  const select = layoutId => {
    // Check this layout exists
    const state = get(store)
    const componentState = get(componentStore)
    const layout = state.layouts.find(layout => layout._id === layoutId)
    if (!layout) {
      return
    }

    // Check layout isn't already selected
    if (
      state.selectedLayoutId === layout._id &&
      componentState.selectedComponentId === layout.props?._id
    ) {
      return
    }

    // Select new layout
    store.update(state => {
      state.selectedLayoutId = layout._id
      return state
    })

    componentStore.select(layout.props?._id)
  }

  const deleteLayout = async layout => {
    if (!layout?._id) {
      return
    }
    await API.deleteLayout({
      layoutId: layout._id,
      layoutRev: layout._rev,
    })
    store.update(state => {
      state.layouts = state.layouts.filter(x => x._id !== layout._id)
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    syncAppLayouts,
    select,
    delete: deleteLayout,
    reset,
  }
}

export const layoutStore = createLayoutStore()

export const selectedLayout = derived(layoutStore, $layoutStore => {
  return $layoutStore.layouts?.find(
    layout => layout._id === $layoutStore.selectedLayoutId
  )
})
