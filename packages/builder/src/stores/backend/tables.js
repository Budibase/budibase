import { writable, get } from "svelte/store"
import { views } from "./"
import { cloneDeep } from "lodash/fp"
import api from "builderStore/api"


export function createTablesStore() {
  const store = writable({})
  const { subscribe, update, set } = store

  async function fetch() {
    const tablesResponse = await api.get(`/api/tables`)
    const tables = await tablesResponse.json()
    update(state => ({ ...state, list: tables }))
  }

  async function select(table) {
    if (!table) {
      update(state => ({
        ...state,
        selected: {},
      }))
    } else {
      update(state => ({
        ...state,
        selected: table,
        draft: cloneDeep(table),
      }))
      views.select({ name: `all_${table._id}` })
    }
  }

  async function save(table) {
    const updatedTable = cloneDeep(table)
    const oldTable = get(store).list.filter(t => t._id === table._id)[0]

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
      if (oldField != null && oldField?.type !== field.type) {
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

    const response = await api.post(`/api/tables`, updatedTable)
    const savedTable = await response.json()
    await fetch()
    await select(savedTable)
    return savedTable
  }

  return {
    subscribe,
    fetch,
    select,
    save,
    init: async () => {
      const response = await api.get("/api/tables")
      const json = await response.json()
      set({
        list: json,
        selected: {},
        draft: {},
      })
    },
    delete: async table => {
      await api.delete(`/api/tables/${table._id}/${table._rev}`)
      update(state => ({
        ...state,
        list: state.list.filter(existing => existing._id !== table._id),
        selected: {},
      }))
    },
    saveField: ({ originalName, field, primaryDisplay = false, indexes }) => {
      update(state => {
        // delete the original if renaming
        // need to handle if the column had no name, empty string
        if (originalName || originalName === "") {
          delete state.draft.schema[originalName]
          state.draft._rename = {
            old: originalName,
            updated: field.name,
          }
        }

        // Optionally set display column
        if (primaryDisplay) {
          state.draft.primaryDisplay = field.name
        }

        if (indexes) {
          state.draft.indexes = indexes
        }

        state.draft.schema[field.name] = cloneDeep(field)
        save(state.draft)
        return state
      })
    },
    deleteField: field => {
      update(state => {
        delete state.draft.schema[field.name]
        save(state.draft)
        return state
      })
    },
  }
}

export const tables = createTablesStore()
