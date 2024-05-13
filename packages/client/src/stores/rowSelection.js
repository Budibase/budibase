import { get, writable } from "svelte/store"

const createRowSelectionStore = () => {
  const store = writable({})

  function updateSelection(componentId, tableId, selectedRows) {
    store.update(state => {
      state[componentId] = { tableId, selectedRows }
      return state
    })
  }

  function getSelection(tableComponentId) {
    const selection = get(store)
    const componentId = Object.keys(selection).find(
      componentId => componentId === tableComponentId
    )
    return selection[componentId]
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
