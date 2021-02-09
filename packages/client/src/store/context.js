import { writable } from "svelte/store"

export const createContextStore = () => {
  const store = writable({})

  // Adds a data context layer to the tree
  const provideData = (providerId, context, data) => {
    let newData = { ...context }
    if (providerId && data !== undefined) {
      newData[providerId] = data

      // Keep track of the closest component ID so we can later hydrate a "data" prop.
      // This is only required for legacy bindings that used "data" rather than a
      // component ID.
      newData.closestComponentId = providerId
    }
    store.set(newData)
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
    actions: { provideData, provideAction },
  }
}
