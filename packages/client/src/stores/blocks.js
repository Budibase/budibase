import { get, writable } from "svelte/store"

const createBlockStore = () => {
  const store = writable({})

  const registerBlock = (id, instance) => {
    store.update(state => ({
      ...state,
      [id]: instance,
    }))
  }

  const unregisterBlock = id => {
    store.update(state => {
      delete state[id]
      return state
    })
  }

  const getBlock = id => {
    return get(store)[id]
  }

  return {
    subscribe: store.subscribe,
    actions: {
      registerBlock,
      unregisterBlock,
      getBlock,
    },
  }
}

export const blockStore = createBlockStore()
