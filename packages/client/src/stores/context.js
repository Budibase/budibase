import { writable, derived } from "svelte/store"
import { ContextScopes } from "constants"

export const createContextStore = parentContext => {
  const context = writable({})
  let observers = []

  // Derive the total context state at this point in the tree
  const contexts = parentContext ? [parentContext, context] : [context]
  const totalContext = derived(contexts, $contexts => {
    return $contexts.reduce((total, context) => ({ ...total, ...context }), {})
  })

  // Subscribe to updates in the parent context, so that we can proxy on any
  // change messages to our own subscribers
  if (parentContext) {
    parentContext.actions.observeChanges(key => {
      broadcastChange(key)
    })
  }

  // Provide some data in context
  const provideData = (providerId, data, scope = ContextScopes.Global) => {
    if (!providerId || data === undefined) {
      return
    }

    // Proxy message up the chain if we have a parent and are providing global
    // context
    if (scope === ContextScopes.Global && parentContext) {
      parentContext.actions.provideData(providerId, data, scope)
    }

    // Otherwise this is either the context root, or we're providing a local
    // context override, so we need to update the local context instead
    else {
      context.update(state => {
        state[providerId] = data
        return state
      })
      broadcastChange(providerId)
    }
  }

  // Provides some action in context
  const provideAction = (
    providerId,
    actionType,
    callback,
    scope = ContextScopes.Global
  ) => {
    if (!providerId || !actionType) {
      return
    }

    // Proxy message up the chain if we have a parent and are providing global
    // context
    if (scope === ContextScopes.Global && parentContext) {
      parentContext.actions.provideAction(
        providerId,
        actionType,
        callback,
        scope
      )
    }

    // Otherwise this is either the context root, or we're providing a local
    // context override, so we need to update the local context instead
    else {
      const key = `${providerId}_${actionType}`
      context.update(state => {
        state[key] = callback
        return state
      })
      broadcastChange(key)
    }
  }

  const observeChanges = callback => {
    observers.push(callback)
    return () => {
      observers = observers.filter(cb => cb !== callback)
    }
  }

  const broadcastChange = key => {
    observers.forEach(cb => cb(key))
  }

  return {
    subscribe: totalContext.subscribe,
    actions: {
      provideData,
      provideAction,
      observeChanges,
    },
  }
}
