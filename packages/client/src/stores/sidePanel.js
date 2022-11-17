import { writable, derived } from "svelte/store"
import { screenStore } from "./screens.js"

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

// Close side panel every time we change screen
const activeScreenId = derived(screenStore, $screenStore => {
  return $screenStore?.activeScreen?._id
})
activeScreenId.subscribe(() => {
  sidePanelStore.actions.close()
})
