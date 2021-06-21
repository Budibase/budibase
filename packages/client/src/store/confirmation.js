import { writable, get } from "svelte/store"

const initialState = {
  showConfirmation: false,
  text: null,
  callback: null,
}

const createConfirmationStore = () => {
  const store = writable(initialState)

  const showConfirmation = (text, callback) => {
    store.set({
      showConfirmation: true,
      text,
      callback,
    })
  }
  const confirm = async () => {
    const state = get(store)
    if (!state.showConfirmation || !state.callback) {
      return
    }
    store.set(initialState)
    await state.callback()
  }
  const cancel = () => {
    store.set(initialState)
  }

  return {
    subscribe: store.subscribe,
    actions: { showConfirmation, confirm, cancel },
  }
}

export const confirmationStore = createConfirmationStore()
