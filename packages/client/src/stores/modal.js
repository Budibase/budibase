import { writable } from "svelte/store"

export const createModalStore = () => {
  const initialState = {
    contentId: null,
  }
  const store = writable(initialState)

  const open = id => {
    store.update(state => {
      state.contentId = id
      return state
    })
  }

  const close = () => {
    store.update(state => {
      state.contentId = null
      return state
    })
  }

  return {
    subscribe: store.subscribe,
    actions: {
      open,
      close,
    },
  }
}

export const modalStore = createModalStore()
