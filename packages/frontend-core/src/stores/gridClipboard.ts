import { writable, get, type Writable } from "svelte/store"

export interface GridClipboardState {
  value: any
  multiCellCopy: boolean
  sourceTableId?: string
  sourceViewId?: string
}

export interface GridClipboardStore extends Writable<GridClipboardState> {
  copy: (
    value: any,
    multiCellCopy: boolean,
    tableId?: string,
    viewId?: string
  ) => void
  clear: () => void
  get: () => GridClipboardState
}

export interface ExternalClipboardData {
  clipboard: GridClipboardStore
  tableId?: string
  viewId?: string
  onCopy: (data: {
    value: any
    multiCellCopy: boolean
    tableId?: string
    viewId?: string
  }) => void
}

export type Store = GridClipboardStore

const createGridClipboard = (): GridClipboardStore => {
  const store = writable<GridClipboardState>({
    value: undefined,
    multiCellCopy: false,
    sourceTableId: undefined,
    sourceViewId: undefined,
  })

  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
    copy: (value, multiCellCopy, tableId, viewId) => {
      store.set({
        value,
        multiCellCopy,
        sourceTableId: tableId,
        sourceViewId: viewId,
      })
    },
    clear: () => {
      store.set({
        value: undefined,
        multiCellCopy: false,
        sourceTableId: undefined,
        sourceViewId: undefined,
      })
    },
    get: () => get(store),
  }
}

export const gridClipboard = createGridClipboard()
