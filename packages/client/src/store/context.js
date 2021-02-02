import { writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"

export const createContextStore = existingContext => {
  const store = writable({ ...existingContext })

  // Adds a data context layer to the tree
  const provideData = (componentId, data) => {
    store.update(state => {
      if (componentId) {
        state[componentId] = data

        // Keep track of the closest component ID so we can later hydrate a "data" prop.
        // This is only required for legacy bindings that used "data" rather than a
        // component ID.
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
