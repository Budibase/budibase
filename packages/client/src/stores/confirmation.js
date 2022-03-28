import { writable, get } from "svelte/store"

const initialState = {
  showConfirmation: false,
  title: null,
  text: null,
  onConfirm: null,
  onCancel: null,
}

const createConfirmationStore = () => {
  const store = writable(initialState)

  const showConfirmation = (title, text, onConfirm, onCancel) => {
    store.set({
      showConfirmation: true,
      title,
      text,
      onConfirm,
      onCancel,
    })
  }
  const confirm = async () => {
    const state = get(store)
    if (!state.showConfirmation || !state.onConfirm) {
      return
    }
    store.set(initialState)
    await state.onConfirm()
  }
  const cancel = () => {
    const state = get(store)
    store.set(initialState)
    if (state.onCancel) {
      state.onCancel()
    }
  }

  return {
    subscribe: store.subscribe,
    actions: { showConfirmation, confirm, cancel },
  }
}

export const confirmationStore = createConfirmationStore()
