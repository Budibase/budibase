import { writable } from "svelte/store"

export const createContextStore = existingContext => {
  const store = writable({ ...existingContext })

  // Adds a data context layer to the tree
  const provideData = (key, data) => {
    if (!key) {
      return
    }
    store.update(state => {
      state[key] = data

      // Keep track of the closest component ID so we can later hydrate a "data" prop.
      // This is only required for legacy bindings that used "data" rather than a
      // component ID.
      state.closestComponentId = key
      return state
    })
  }

  // Adds an action context layer to the tree
  const provideAction = (key, actionType, callback) => {
    if (!key || !actionType) {
      return
    }
    store.update(state => {
      state[`${key}_${actionType}`] = callback
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    update: store.update,
    actions: { provideData, provideAction },
  }
}
