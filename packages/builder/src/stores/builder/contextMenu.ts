import { writable } from "svelte/store"

interface Position {
  x: number
  y: number
}

interface MenuItem {
  label: string
  icon?: string
  action: () => void
}

interface ContextMenuState {
  id: string | null
  items: MenuItem[]
  position: Position
  visible: boolean
}

export const INITIAL_CONTEXT_MENU_STATE: ContextMenuState = {
  id: null,
  items: [],
  position: { x: 0, y: 0 },
  visible: false,
}

export function createViewsStore() {
  const store = writable<ContextMenuState>({ ...INITIAL_CONTEXT_MENU_STATE })

  const open = (id: string, items: MenuItem[], position: Position): void => {
    store.set({ id, items, position, visible: true })
  }

  const close = (): void => {
    store.set({ ...INITIAL_CONTEXT_MENU_STATE })
  }

  return {
    subscribe: store.subscribe,
    open,
    close,
  }
}

export const contextMenuStore = createViewsStore()
