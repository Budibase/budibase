import { writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"

export const createDataStore = existingContext => {
  const store = writable({ ...existingContext })

  // Adds a context layer to the data context tree
  const addContext = (row, componentId) => {
    store.update(state => {
      if (componentId) {
        state[componentId] = row
        state[`${componentId}_draft`] = cloneDeep(row)
        state.closestComponentId = componentId
      }
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    update: store.update,
    actions: { addContext },
  }
}

export const dataStore = createDataStore()
