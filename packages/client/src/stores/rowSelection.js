import { writable } from "svelte/store"

const createRowSelectionStore = () => {
  const store = writable({})

  function updateSelection(componentId, selectedRows) {
    store.update(state => {
      state[componentId] = [...selectedRows]
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    set: store.set,
    actions: {
      updateSelection,
    },
  }
}

export const rowSelectionStore = createRowSelectionStore()
