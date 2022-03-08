import { get, writable } from "svelte/store"

const createRowSelectionStore = () => {
  const store = writable({})

  function updateSelection(componentId, tableId, selectedRows) {
    store.update(state => {
      state[componentId] = { tableId: tableId, selectedRows: selectedRows }
      return state
    })
  }

  function getSelection(tableId) {
    const selection = get(store)
    const componentId = Object.keys(selection).find(
      componentId => selection[componentId].tableId === tableId
    )
    return componentId ? selection[componentId] : {}
  }

  return {
    subscribe: store.subscribe,
    set: store.set,
    actions: {
      updateSelection,
      getSelection,
    },
  }
}

export const rowSelectionStore = createRowSelectionStore()
