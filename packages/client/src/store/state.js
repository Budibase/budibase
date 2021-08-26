import { writable } from "svelte/store"

const createStateStore = () => {
  const store = writable({})

  const setValue = (key, value) => {
    store.update(state => {
      state[key] = value
      return state
    })
  }
  const deleteValue = key => {
    store.update(state => {
      delete state[key]
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    actions: { setValue, deleteValue },
  }
}

export const stateStore = createStateStore()
