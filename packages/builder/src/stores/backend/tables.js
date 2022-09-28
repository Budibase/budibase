import { get, writable } from "svelte/store"
import { datasources, queries, views } from "./"
import { cloneDeep } from "lodash/fp"
import { API } from "api"
import { SWITCHABLE_TYPES } from "constants/backend"

export function createTablesStore() {
  const store = writable({})
  const { subscribe, update, set } = store

  async function fetch() {
    const tables = await API.getTables()
    update(state => ({
      ...state,
      list: tables,
    }))
    return tables
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
      views.unselect()
      queries.unselect()
      datasources.unselect()
    }
  }

  async function save(table) {
    const updatedTable = cloneDeep(table)
    const oldTable = get(store).list.filter(t => t._id === table._id)[0]

    const fieldNames = []
    // Update any renamed schema keys to reflect their names
    for (let key of Object.keys(updatedTable.schema)) {
      // If field name has been seen before remove it
      if (fieldNames.indexOf(key.toLowerCase()) !== -1) {
        delete updatedTable.schema[key]
        continue
      }
      const field = updatedTable.schema[key]
      const oldField = oldTable?.schema[key]
      // If the type has changed then revert back to the old field
      if (
        oldField != null &&
        oldField?.type !== field.type &&
        SWITCHABLE_TYPES.indexOf(oldField?.type) === -1
      ) {
        updatedTable.schema[key] = oldField
      }
      // Field has been renamed
      if (field.name && field.name !== key) {
        updatedTable.schema[field.name] = field
        updatedTable._rename = { old: key, updated: field.name }
        delete updatedTable.schema[key]
      }
      // Finally record this field has been used
      fieldNames.push(key.toLowerCase())
    }

    const savedTable = await API.saveTable(updatedTable)
    await fetch()
    if (table.type === "external") {
      await datasources.fetch()
    }
    await select(savedTable)
    return savedTable
  }

  return {
    subscribe,
    update,
    fetch,
    select,
    unselect: () => {
      update(state => ({
        ...state,
        selected: null,
      }))
    },
    save,
    init: async () => {
      const tables = await API.getTables()
      set({
        list: tables,
        selected: {},
        draft: {},
      })
    },
    delete: async table => {
      await API.deleteTable({
        tableId: table?._id,
        tableRev: table?._rev,
      })
      update(state => ({
        ...state,
        list: state.list.filter(existing => existing._id !== table._id),
        selected: {},
      }))
    },
    saveField: async ({
      originalName,
      field,
      primaryDisplay = false,
      indexes,
    }) => {
      let promise
      update(state => {
        // delete the original if renaming
        // need to handle if the column had no name, empty string
        if (originalName != null && originalName !== field.name) {
          delete state.draft.schema[originalName]
          state.draft._rename = {
            old: originalName,
            updated: field.name,
          }
        }

        // Optionally set display column
        if (primaryDisplay) {
          state.draft.primaryDisplay = field.name
        } else if (state.draft.primaryDisplay === originalName) {
          const fields = Object.keys(state.draft.schema)
          // pick another display column randomly if unselecting
          state.draft.primaryDisplay = fields.filter(
            name => name !== originalName || name !== field
          )[0]
        }

        if (indexes) {
          state.draft.indexes = indexes
        }

        state.draft.schema = {
          ...state.draft.schema,
          [field.name]: cloneDeep(field),
        }
        promise = save(state.draft)
        return state
      })
      if (promise) {
        await promise
      }
    },
    deleteField: async field => {
      let promise
      update(state => {
        delete state.draft.schema[field.name]
        promise = save(state.draft)
        return state
      })
      if (promise) {
        await promise
      }
    },
  }
}

export const tables = createTablesStore()
