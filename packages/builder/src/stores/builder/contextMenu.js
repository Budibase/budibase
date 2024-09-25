import { writable } from "svelte/store"

export const INITIAL_CONTEXT_MENU_STATE = {
  id: null,
  items: [],
  position: { x: 0, y: 0 },
  visible: false,
}

export function createViewsStore() {
  const store = writable({ ...INITIAL_CONTEXT_MENU_STATE })

  const open = (id, items, position) => {
    store.set({ id, items, position, visible: true })
  }

  const close = () => {
    store.set({ ...INITIAL_CONTEXT_MENU_STATE })
  }

  return {
    subscribe: store.subscribe,
    open,
    close,
  }
}

export const contextMenuStore = createViewsStore()
