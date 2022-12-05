import { writable, derived } from "svelte/store"

export const createSidePanelStore = () => {
  const initialState = {
    contentId: null,
  }
  const store = writable(initialState)
  const derivedStore = derived(store, $store => {
    return {
      ...$store,
      open: $store.contentId != null,
    }
  })

  const open = id => {
    store.update(state => {
      state.contentId = id
      return state
    })
  }
  const close = () => {
    store.update(state => {
      state.contentId = null
      return state
    })
  }

  return {
    subscribe: derivedStore.subscribe,
    actions: {
      open,
      close,
    },
  }
}

export const sidePanelStore = createSidePanelStore()
