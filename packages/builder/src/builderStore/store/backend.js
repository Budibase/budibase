import { writable } from "svelte/store"
import api from "../api"

const INITIAL_BACKEND_UI_STATE = {
  tables: [],
  views: [],
  datasources: [],
  selectedDatabase: {},
  selectedTable: {},
  draftTable: {},
}

export const getBackendUiStore = () => {
  const store = writable({ ...INITIAL_BACKEND_UI_STATE })

  store.actions = {
    reset: () => store.set({ ...INITIAL_BACKEND_UI_STATE }),
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
