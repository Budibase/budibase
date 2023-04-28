import { writable } from "svelte/store"

export const createContextStore = () => {
  const context = writable({})
  let observers = []

  // Adds a data context layer to the tree
  const provideData = (providerId, data) => {
    if (!providerId || data === undefined) {
      return
    }
    // console.log(`[${providerId}]`, data)
    context.update(state => {
      state[providerId] = data
      return state
    })

    broadcastChange(providerId)
  }

  // Adds an action context layer to the tree
  const provideAction = (providerId, actionType, callback) => {
    if (!providerId || !actionType) {
      return
    }
    context.update(state => {
      state[`${providerId}_${actionType}`] = callback
      return state
    })
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
    subscribe: context.subscribe,
    actions: {
      provideData,
      provideAction,
      observeChanges,
    },
  }
}
