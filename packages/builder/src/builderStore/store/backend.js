import { writable, get } from "svelte/store"
import { cloneDeep } from "lodash/fp"
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
    database: {
      select: async db => {
        const [tables] = await Promise.all([
          api.get(`/api/tables`).then(r => r.json()),
        ])

        store.update(state => {
          state.tables = tables
          return state
        })
      },
    },
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
    views: {
      select: view =>
        store.update(state => {
          state.selectedView = view
          state.selectedTable = {}
          return state
        }),
      delete: async view => {
        await api.delete(`/api/views/${view}`)
        await store.actions.tables.fetch()
      },
      save: async view => {
        const response = await api.post(`/api/views`, view)
        const json = await response.json()

        const viewMeta = {
          name: view.name,
          ...json,
        }

        store.update(state => {
          const viewTable = state.tables.find(
            table => table._id === view.tableId
          )

          if (view.originalName) delete viewTable.views[view.originalName]
          viewTable.views[view.name] = viewMeta

          state.tables = state.tables
          state.selectedView = viewMeta
          return state
        })
      },
    },
  }

  return store
}
