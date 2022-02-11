import { writable } from "svelte/store"

const createRowSelectionStore = () => {
  const store = writable([])

  function update(rows) {
    console.log(rows)
    store.update(state => {
      state = rows
      return state
    })
  }
  return {
    subscribe: store.subscribe,
    actions: {
      update,
    },
  }
}

export const rowSelectionStore = createRowSelectionStore()
