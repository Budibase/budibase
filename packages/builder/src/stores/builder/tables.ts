import {
  FieldSchema,
  FieldType,
  SaveTableRequest,
  Table,
} from "@budibase/types"
import { SWITCHABLE_TYPES } from "@budibase/shared-core"
import { get, derived, Writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { API } from "@/api"
import { DerivedBudiStore } from "@/stores/BudiStore"

interface BuilderTableStore {
  list: Table[]
  selectedTableId?: string
}

interface DerivedTableStore extends BuilderTableStore {
  selected?: Table
}

export class TableStore extends DerivedBudiStore<
  BuilderTableStore,
  DerivedTableStore
> {
  constructor() {
    const makeDerivedStore = (store: Writable<BuilderTableStore>) => {
      return derived(store, $store => ({
        ...$store,
        selected: $store.list?.find(
          table => table._id === $store.selectedTableId
        ),
      }))
    }

    super(
      {
        list: [],
        selectedTableId: undefined,
      },
      makeDerivedStore
    )

    this.select = this.select.bind(this)
  }

  async init() {
    return this.fetch()
  }

  async fetch() {
    const tables = await API.getTables()
    this.store.update(state => ({
      ...state,
      list: tables,
    }))
  }

  private async singleFetch(tableId: string) {
    const table = await API.getTable(tableId)
    this.store.update(state => {
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

  select(tableId: string | undefined) {
    this.store.update(state => ({
      ...state,
      selectedTableId: tableId,
    }))
  }

  async save(table: Table) {
    const updatedTable: SaveTableRequest = cloneDeep(table)
    const oldTable = get(this.store).list.filter(t => t._id === table._id)[0]

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
        !SWITCHABLE_TYPES[oldField?.type]?.includes(field.type)
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
    this.replaceTable(savedTable._id, savedTable)
    this.select(savedTable._id)
    // make sure tables up to date (related)
    let newTableIds = []
    for (let column of Object.values(updatedTable?.schema || {})) {
      if (column.type === FieldType.LINK) {
        newTableIds.push(column.tableId)
      }
    }

    let oldTableIds = []
    for (let column of Object.values(oldTable?.schema || {})) {
      if (column.type === FieldType.LINK) {
        oldTableIds.push(column.tableId)
      }
    }

    const tableIdsToFetch = [...new Set([...newTableIds, ...oldTableIds])]
    // too many tables to fetch, just get all
    if (tableIdsToFetch.length > 3) {
      await this.fetch()
    } else {
      await Promise.all(tableIdsToFetch.map(id => this.singleFetch(id)))
    }
    return savedTable
  }

  async delete(table: { _id: string; _rev: string }) {
    await API.deleteTable(table._id, table._rev)
    this.replaceTable(table._id, null)
  }

  async saveField({
    originalName,
    field,
    primaryDisplay = false,
    indexes,
  }: {
    originalName: string
    field: FieldSchema
    primaryDisplay: boolean
    indexes: Record<string, any>
  }) {
    const draft: SaveTableRequest = cloneDeep(get(this.derivedStore).selected!)

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
        name => name !== originalName || name !== field.name
      )[0]
    }
    if (indexes) {
      draft.indexes = indexes
    }
    draft.schema = {
      ...draft.schema,
      [field.name]: cloneDeep(field),
    }

    await this.save(draft)
  }

  async deleteField(field: { name: string | number }) {
    let draft = cloneDeep(get(this.derivedStore).selected!)
    delete draft.schema[field.name]
    await this.save(draft)
  }

  // Handles external updates of tables
  replaceTable(tableId: string | undefined, table: Table | null) {
    if (!tableId) {
      return
    }

    // Handle deletion
    if (!table) {
      this.store.update(state => ({
        ...state,
        list: state.list.filter(x => x._id !== tableId),
      }))
      return
    }

    // Add new table
    const index = get(this.store).list.findIndex(x => x._id === table._id)
    if (index === -1) {
      this.store.update(state => ({
        ...state,
        list: [...state.list, table],
      }))
    }

    // Update existing table
    else if (table) {
      // This function has to merge state as there discrepancies with the table
      // API endpoints. The table list endpoint and get table endpoint use the
      // "type" property to mean different things.
      this.store.update(state => {
        state.list[index] = {
          ...table,
          type: state.list[index].type,
        }
        return state
      })
    }
  }

  removeDatasourceTables(datasourceId: string) {
    this.store.update(state => ({
      ...state,
      list: state.list.filter(table => table.sourceId !== datasourceId),
    }))
  }
}

export const tables = new TableStore()
