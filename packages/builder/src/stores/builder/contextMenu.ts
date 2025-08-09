import { MenuItem } from "@/types"
import { writable, get } from "svelte/store"

interface Position {
  x: number
  y: number
}

interface ContextMenuState {
  id: string | null
  items: MenuItem[]
  position: Position
  visible: boolean
  onClose?: () => void
}

export const INITIAL_CONTEXT_MENU_STATE: ContextMenuState = {
  id: null,
  items: [],
  position: { x: 0, y: 0 },
  visible: false,
}

export function createViewsStore() {
  const store = writable<ContextMenuState>({ ...INITIAL_CONTEXT_MENU_STATE })

  const open = (
    id: string,
    items: MenuItem[],
    position: Position,
    onClose?: () => void
  ): void => {
    store.set({ id, items, position, visible: true, onClose })
  }

  const close = (): void => {
    const onClose = get(store).onClose
    onClose?.()
    store.set({ ...INITIAL_CONTEXT_MENU_STATE })
  }

  return {
    subscribe: store.subscribe,
    open,
    close,
  }
}

export const contextMenuStore = createViewsStore()
