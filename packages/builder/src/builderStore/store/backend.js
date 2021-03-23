import { writable } from "svelte/store"

export const getBackendUiStore = () => {
  const store = writable({})

  store.actions = {
    rows: {
      save: () =>
        store.update(state => {
          state.selectedView = state.selectedView
          return state
        }),
      delete: () =>
        store.update(state => {
          state.selectedView = state.selectedView
          return state
        }),
    },
  }

  return store
}
