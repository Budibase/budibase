import { writable } from "svelte/store"

export const INITIAL_CONTEXT_MENU_STATE = {
  id: null,
  items: [],
  hoverIndex: null,
  position: { x: 0, y: 0 },
  visible: false,
}

export function createViewsStore() {
  const store = writable({ ...INITIAL_CONTEXT_MENU_STATE })

  const open = (id, items, position) => {
    store.set({ id, items, position, hoverIndex: null, visible: true })
  }

  const setHoverIndex = (newHoverIndex) => {
    store.update($store => ({ ...$store, hoverIndex: newHoverIndex }));
  }

  const close = () => {
    store.set({ ...INITIAL_CONTEXT_MENU_STATE })
  }

  return {
    subscribe: store.subscribe,
    open,
    close,
    setHoverIndex
  }
}

export const contextMenuStore = createViewsStore()
