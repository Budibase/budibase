import { writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"

export const createContextStore = existingContext => {
  const store = writable({ ...existingContext })

  // Adds a data context layer to the tree
  const provideData = (componentId, data) => {
    store.update(state => {
      if (componentId) {
        state[componentId] = data
        state[`${componentId}_draft`] = cloneDeep(data)
        state.closestComponentId = componentId
      }
      return state
    })
  }

  // Adds an action context layer to the tree
  const provideAction = (componentId, actionType, callback) => {
    store.update(state => {
      if (actionType && componentId) {
        state[`${componentId}_${actionType}`] = callback
      }
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    update: store.update,
    actions: { provideData, provideAction },
  }
}
