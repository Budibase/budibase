import { writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"

const initialValue = {
  data: null,
}

export const createDataStore = existingContext => {
  const initial = existingContext ? cloneDeep(existingContext) : initialValue
  const store = writable(initial)

  // Adds a context layer to the data context tree
  const addContext = (row, componentId) => {
    store.update(state => {
      if (componentId) {
        state[componentId] = row
        state.data = row
      }
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { addContext },
  }
}
