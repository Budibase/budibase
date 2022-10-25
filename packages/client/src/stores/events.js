import { writable, get } from "svelte/store"

const createEventStore = () => {
  const initialState = {
    eventResolvers: {},
  }
  const store = writable(initialState)

  const actions = {
    dispatchEvent: (type, data) => {
      const id = Math.random()
      return new Promise(resolve => {
        window.parent.postMessage({ type, data, id })
        store.update(state => {
          state.eventResolvers[id] = resolve
          return state
        })
      })
    },
    resolveEvent: data => {
      get(store).eventResolvers[data]?.()
    },
  }

  return {
    subscribe: store.subscribe,
    actions,
  }
}

export const eventStore = createEventStore()
