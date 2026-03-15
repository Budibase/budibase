import { writable, derived } from "svelte/store"

export const createSidePanelStore = () => {
  const initialState = {
    contentId: null,
    ignoreClicksOutside: true,
    // size can be: 'small', 'medium', 'large', 'fullscreen'
    // null means no explicit size selected (allow component defaults)
    size: null,
  }
  const store = writable(initialState)
  const derivedStore = derived(store, $store => {
    return {
      ...$store,
      open: $store.contentId != null,
    }
  })
  let timeout

  const open = (id, opts = {}) => {
    clearTimeout(timeout)
    store.update(state => {
      state.contentId = id
      // If size explicitly provided, set it; otherwise clear so component
      // instance defaults can apply.
      state.size = opts.size || null
      return state
    })
  }

  // Delay closing by 50ms to avoid toggling visibility when cycling though
  // records
  const close = () => {
    timeout = setTimeout(() => {
      store.update(state => {
        state.contentId = null
        return state
      })
    }, 50)
  }

  const setIgnoreClicksOutside = bool => {
    store.update(state => {
      state.ignoreClicksOutside = bool
      return state
    })
  }

  const setSize = size => {
    store.update(state => {
      state.size = size
      return state
    })
  }
  return {
    subscribe: derivedStore.subscribe,
    actions: {
      open,
      close,
      setIgnoreClicksOutside,
      setSize,
    },
  }
}

export const sidePanelStore = createSidePanelStore()
