import { writable } from "svelte/store"

export const createContextStore = existingContext => {
  const store = writable({ ...existingContext })

  // Adds a data context layer to the tree
  const provideData = (providerId, data) => {
    if (!providerId) {
      return
    }
    store.update(state => {
      state[providerId] = data

      // Keep track of the closest component ID so we can later hydrate a "data" prop.
      // This is only required for legacy bindings that used "data" rather than a
      // component ID.
      state.closestComponentId = providerId
      return state
    })
  }

  // Adds an action context layer to the tree
  const provideAction = (providerId, actionType, callback) => {
    if (!providerId || !actionType) {
      return
    }
    store.update(state => {
      state[`${providerId}_${actionType}`] = callback
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    update: store.update,
    actions: { provideData, provideAction },
  }
}
