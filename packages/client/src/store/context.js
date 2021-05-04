import { writable, derived } from "svelte/store"

export const createContextStore = oldContext => {
  const newContext = writable({})
  const contexts = oldContext ? [oldContext, newContext] : [newContext]
  const totalContext = derived(contexts, $contexts => {
    return $contexts.reduce((total, context) => ({ ...total, ...context }), {})
  })

  // Adds a data context layer to the tree
  const provideData = (providerId, data) => {
    if (!providerId || data === undefined) {
      return
    }
    newContext.update(state => {
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
    newContext.update(state => {
      state[`${providerId}_${actionType}`] = callback
      return state
    })
  }

  return {
    subscribe: totalContext.subscribe,
    actions: { provideData, provideAction },
  }
}
