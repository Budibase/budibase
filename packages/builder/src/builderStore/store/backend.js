import { writable, get } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import api from "../api"

const INITIAL_BACKEND_UI_STATE = {
  tables: [],
  views: [],
  datasources: [],
  queries: [],
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
        const [tables, queries] = await Promise.all([
          api.get(`/api/tables`).then(r => r.json()),
          api.get(`/api/queries`).then(r => r.json()),
        ])

        store.update(state => {
          state.selectedDatabase = db
          state.tables = tables
          state.queries = queries
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
    queries: {
      fetch: async () => {
        const response = await api.get(`/api/queries`)
        const json = await response.json()
        store.update(state => {
          state.queries = json
          return state
        })
        return json
      },
      save: async (datasourceId, query) => {
        const integrations = get(store).integrations
        const dataSource = get(store).datasources.filter(
          ds => ds._id === datasourceId
        )
        // check if readable attribute is found
        if (dataSource.length !== 0) {
          const integration = integrations[dataSource[0].source]
          const readable = integration.query[query.queryVerb].readable
          if (readable) {
            query.readable = readable
          }
        }
        query.datasourceId = datasourceId
        const response = await api.post(`/api/queries`, query)
        if (response.status !== 200) {
          throw new Error("Failed saving query.")
        }
        const json = await response.json()
        store.update(state => {
          const currentIdx = state.queries.findIndex(
            query => query._id === json._id
          )

          if (currentIdx >= 0) {
            state.queries.splice(currentIdx, 1, json)
          } else {
            state.queries.push(json)
          }

          state.queries = state.queries
          state.selectedQueryId = json._id
          return state
        })
        return json
      },
      select: query =>
        store.update(state => {
          state.selectedDatasourceId = query.datasourceId
          state.selectedQueryId = query._id
          return state
        }),
      delete: async query => {
        await api.delete(`/api/queries/${query._id}/${query._rev}`)
        store.update(state => {
          state.queries = state.queries.filter(
            existing => existing._id !== query._id
          )
          if (state.selectedQueryId === query._id) {
            state.selectedQueryId = null
          }

          return state
        })
      },
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
        const oldTable = get(store).tables.filter(t => t._id === table._id)[0]

        const fieldNames = []
        // update any renamed schema keys to reflect their names
        for (let key of Object.keys(updatedTable.schema)) {
          // if field name has been seen before remove it
          if (fieldNames.indexOf(key.toLowerCase()) !== -1) {
            delete updatedTable.schema[key]
            continue
          }
          const field = updatedTable.schema[key]
          const oldField = oldTable?.schema[key]
          // if the type has changed then revert back to the old field
          if (oldField != null && oldField.type !== field.type) {
            updatedTable.schema[key] = oldField
          }
          // field has been renamed
          if (field.name && field.name !== key) {
            updatedTable.schema[field.name] = field
            updatedTable._rename = { old: key, updated: field.name }
            delete updatedTable.schema[key]
          }
          // finally record this field has been used
          fieldNames.push(key.toLowerCase())
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
      saveField: ({ originalName, field, primaryDisplay = false, indexes }) => {
        store.update(state => {
          // delete the original if renaming
          // need to handle if the column had no name, empty string
          if (originalName || originalName === "") {
            delete state.draftTable.schema[originalName]
            state.draftTable._rename = {
              old: originalName,
              updated: field.name,
            }
          }

          // Optionally set display column
          if (primaryDisplay) {
            state.draftTable.primaryDisplay = field.name
          }

          if (indexes) {
            state.draftTable.indexes = indexes
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
  }

  return store
}
