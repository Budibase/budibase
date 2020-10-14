import { writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import api from "../api"

const INITIAL_BACKEND_UI_STATE = {
  tables: [],
  views: [],
  users: [],
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
        const tablesResponse = await api.get(`/api/tables`)
        const tables = await tablesResponse.json()
        store.update(state => {
          state.selectedDatabase = db
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
      select: row =>
        store.update(state => {
          state.selectedRow = row
          return state
        }),
    },
    tables: {
      fetch: async () => {
        const tablesResponse = await api.get(`/api/tables`)
        const tables = await tablesResponse.json()
        store.update(state => {
          state.tables = tables
          return state
        })
      },
      select: table =>
        store.update(state => {
          state.selectedTable = table
          state.draftTable = cloneDeep(table)
          state.selectedView = { name: `all_${table._id}` }
          return state
        }),
      save: async table => {
        const updatedTable = cloneDeep(table)

        // update any renamed schema keys to reflect their names
        for (let key in updatedTable.schema) {
          const field = updatedTable.schema[key]
          // field has been renamed
          if (field.name && field.name !== key) {
            updatedTable.schema[field.name] = field
            updatedTable._rename = { old: key, updated: field.name }
            delete updatedTable.schema[key]
          }
        }

        const SAVE_TABLE_URL = `/api/tables`
        const response = await api.post(SAVE_TABLE_URL, updatedTable)
        const savedTable = await response.json()
        await store.actions.tables.fetch()
        store.actions.tables.select(savedTable)
        return savedTable
      },
      delete: async table => {
        await api.delete(`/api/tables/${table._id}/${table._rev}`)
        store.update(state => {
          state.tables = state.tables.filter(
            existing => existing._id !== table._id
          )
          state.selectedTable = {}
          return state
        })
      },
      saveField: ({ originalName, field, primaryDisplay = false }) => {
        store.update(state => {
          // delete the original if renaming
          if (originalName) {
            delete state.draftTable.schema[originalName]
            state.draftTable._rename = {
              old: originalName,
              updated: field.name,
            }
          }

          // Optionally set primary display
          if (primaryDisplay) {
            state.draftTable.primaryDisplay = field.name
          }

          state.draftTable.schema[field.name] = cloneDeep(field)
          store.actions.tables.save(state.draftTable)
          return state
        })
      },
      deleteField: field => {
        store.update(state => {
          delete state.draftTable.schema[field.name]
          store.actions.tables.save(state.draftTable)
          return state
        })
      },
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
    users: {
      create: user =>
        store.update(state => {
          state.users.push(user)
          state.users = state.users
          return state
        }),
    },
  }

  return store
}
