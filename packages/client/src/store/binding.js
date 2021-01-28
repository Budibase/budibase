import { writable } from "svelte/store"

const createBindingStore = () => {
  const store = writable({})

  const setBindableValue = (componentId, value) => {
    store.update(state => {
      if (componentId) {
        state[componentId] = value
      }
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { setBindableValue },
  }
}

export const bindingStore = createBindingStore()
