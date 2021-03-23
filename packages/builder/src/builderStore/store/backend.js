import { writable } from "svelte/store"

const INITIAL_BACKEND_UI_STATE = {}

export const getBackendUiStore = () => {
  const store = writable({ ...INITIAL_BACKEND_UI_STATE })

  store.actions = {
    reset: () => store.set({ ...INITIAL_BACKEND_UI_STATE }),
  }

  return store
}
