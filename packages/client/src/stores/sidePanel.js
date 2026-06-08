import { writable, derived } from "svelte/store"

export const createSidePanelStore = () => {
  const initialState = {
    contentId: null,
    ignoreClicksOutside: true,
    // size can be: 'small', 'medium', 'large', 'fullscreen'
    // null means no explicit size selected (allow component defaults)
    size: null,
    // position can be: 'left', 'right'
    // null means no explicit position selected (allow component defaults)
    position: null,
  }
  // Tracks each panel component's configured default position so open() can
  // apply it atomically, avoiding a two-render-cycle flash when no action
  // override is provided.
  const defaultPositions = {}
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
      state.size = opts.size || null
      state.position = opts.position || defaultPositions[id] || null
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

  const setPosition = position => {
    store.update(state => {
      state.position = position
      return state
    })
  }

  const registerDefaultPosition = (id, position) => {
    if (id) {
      defaultPositions[id] = position || null
    }
  }

  return {
    subscribe: derivedStore.subscribe,
    actions: {
      open,
      close,
      setIgnoreClicksOutside,
      setSize,
      setPosition,
      registerDefaultPosition,
    },
  }
}

export const sidePanelStore = createSidePanelStore()
