import { writable } from "svelte/store"

export const INITIAL_CONTEXT_MENU_STATE = {
  id: null,
  items: [],
  hoverIndex: null,
  secondaryHoverIndex: null,
  position: { x: 0, y: 0 },
  visible: false,
}

export function createViewsStore() {
  const store = writable({ ...INITIAL_CONTEXT_MENU_STATE })

  const open = (id, items, position) => {
    store.set({ id, items, position, hoverIndex: null, secondaryHoverIndex: null, visible: true })
  }

  const setHoverIndex = (newHoverIndex) => {
    store.update($store => ({ ...$store, hoverIndex: newHoverIndex, secondaryHoverIndex: null }));
  }

  const setSecondaryHoverIndex = (newSecondaryHoverIndex) => {
    store.update($store => ({ ...$store, secondaryHoverIndex: newSecondaryHoverIndex }));
  }

  const close = () => {
    store.set({ ...INITIAL_CONTEXT_MENU_STATE })
  }

  return {
    subscribe: store.subscribe,
    open,
    close,
    setHoverIndex,
    setSecondaryHoverIndex
  }
}

export const contextMenuStore = createViewsStore()
