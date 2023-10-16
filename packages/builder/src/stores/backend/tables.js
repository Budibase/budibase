import { get, writable, derived } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { API } from "api"
import { SWITCHABLE_TYPES, FIELDS } from "constants/backend"

export function createTablesStore() {
  const store = writable({
    list: [],
    selectedTableId: null,
  })
  const derivedStore = derived(store, $store => ({
    ...$store,
    selected: $store.list?.find(table => table._id === $store.selectedTableId),
  }))

  const fetch = async () => {
    const tables = await API.getTables()
    store.update(state => ({
      ...state,
      list: tables,
    }))
  }

  const singleFetch = async tableId => {
    const table = await API.getTable(tableId)
    store.update(state => {
      const list = []
      // update the list, keep order accurate
      for (let tbl of state.list) {
        if (table._id === tbl._id) {
          list.push(table)
        } else {
          list.push(tbl)
        }
      }
      state.list = list
      return state
    })
  }

  const select = tableId => {
    store.update(state => ({
      ...state,
      selectedTableId: tableId,
    }))
  }

  const save = async table => {
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
    replaceTable(savedTable._id, savedTable)
    select(savedTable._id)
    // make sure tables up to date (related)
    let tableIdsToFetch = []
    for (let column of Object.values(updatedTable?.schema || {})) {
      if (column.type === FIELDS.LINK.type) {
        tableIdsToFetch.push(column.tableId)
      }
    }
    tableIdsToFetch = [...new Set(tableIdsToFetch)]
    // too many tables to fetch, just get all
    if (tableIdsToFetch.length > 3) {
      await fetch()
    } else {
      await Promise.all(tableIdsToFetch.map(id => singleFetch(id)))
    }
    return savedTable
  }

  const deleteTable = async table => {
    if (!table?._id) {
      return
    }
    await API.deleteTable({
      tableId: table._id,
      tableRev: table._rev || "rev",
    })
    replaceTable(table._id, null)
  }

  const saveField = async ({
    originalName,
    field,
    primaryDisplay = false,
    indexes,
  }) => {
    let draft = cloneDeep(get(derivedStore).selected)

    // delete the original if renaming
    // need to handle if the column had no name, empty string
    if (originalName != null && originalName !== field.name) {
      delete draft.schema[originalName]
      draft._rename = {
        old: originalName,
        updated: field.name,
      }
    }

    // Optionally set display column
    if (primaryDisplay) {
      draft.primaryDisplay = field.name
    } else if (draft.primaryDisplay === originalName) {
      const fields = Object.keys(draft.schema)
      // pick another display column randomly if unselecting
      draft.primaryDisplay = fields.filter(
        name => name !== originalName || name !== field
      )[0]
    }
    if (indexes) {
      draft.indexes = indexes
    }
    draft.schema = {
      ...draft.schema,
      [field.name]: cloneDeep(field),
    }

    await save(draft)
  }

  const deleteField = async field => {
    let draft = cloneDeep(get(derivedStore).selected)
    delete draft.schema[field.name]
    await save(draft)
  }

  // Handles external updates of tables
  const replaceTable = (tableId, table) => {
    if (!tableId) {
      return
    }

    // Handle deletion
    if (!table) {
      store.update(state => ({
        ...state,
        list: state.list.filter(x => x._id !== tableId),
      }))
      return
    }

    // Add new table
    const index = get(store).list.findIndex(x => x._id === table._id)
    if (index === -1) {
      store.update(state => ({
        ...state,
        list: [...state.list, table],
      }))
    }

    // Update existing table
    else if (table) {
      // This function has to merge state as there discrepancies with the table
      // API endpoints. The table list endpoint and get table endpoint use the
      // "type" property to mean different things.
      store.update(state => {
        state.list[index] = {
          ...table,
          type: state.list[index].type,
        }
        return state
      })
    }
  }

  const removeDatasourceTables = datasourceId => {
    store.update(state => ({
      ...state,
      list: state.list.filter(table => table.sourceId !== datasourceId),
    }))
  }

  return {
    ...store,
    subscribe: derivedStore.subscribe,
    fetch,
    init: fetch,
    select,
    save,
    delete: deleteTable,
    saveField,
    deleteField,
    replaceTable,
    removeDatasourceTables,
  }
}

export const tables = createTablesStore()
