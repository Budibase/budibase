import { writable, derived } from "svelte/store"
import { Helpers } from "@budibase/bbui"

export const createContextStore = oldContext => {
  const newContext = writable({})
  const contexts = oldContext ? [oldContext, newContext] : [newContext]
  const totalContext = derived(contexts, $contexts => {
    // The key is the serialized representation of context
    let key = ""
    for (let i = 0; i < $contexts.length - 1; i++) {
      key += $contexts[i].key
    }
    key = Helpers.hashString(
      key + JSON.stringify($contexts[$contexts.length - 1])
    )

    // Reduce global state
    const reducer = (total, context) => ({ ...total, ...context })
    const context = $contexts.reduce(reducer, {})

    return {
      ...context,
      key,
    }
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
