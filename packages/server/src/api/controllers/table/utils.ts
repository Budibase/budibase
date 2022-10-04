import { transform } from "../../../utilities/csvParser"
import {
  getRowParams,
  generateRowID,
  InternalTables,
  getTableParams,
  BudibaseInternalDB,
} from "../../../db/utils"
import { isEqual } from "lodash"
import { AutoFieldSubTypes, FieldTypes } from "../../../constants"
import {
  inputProcessing,
  cleanupAttachments,
} from "../../../utilities/rowProcessor"
import {
  USERS_TABLE_SCHEMA,
  SwitchableTypes,
  CanSwitchTypes,
} from "../../../constants"
import {
  isExternalTable,
  breakExternalTableId,
  isSQL,
} from "../../../integrations/utils"
import { getViews, saveView } from "../view/utils"
import viewTemplate from "../view/viewBuilder"
const { getAppDB } = require("@budibase/backend-core/context")
import { cloneDeep } from "lodash/fp"
import { quotas } from "@budibase/pro"
import { events } from "@budibase/backend-core"

export async function clearColumns(table: any, columnNames: any) {
  const db = getAppDB()
  const rows = await db.allDocs(
    getRowParams(table._id, null, {
      include_docs: true,
    })
  )
  return db.bulkDocs(
    rows.rows.map(({ doc }: any) => {
      columnNames.forEach((colName: any) => delete doc[colName])
      return doc
    })
  )
}

export async function checkForColumnUpdates(oldTable: any, updatedTable: any) {
  const db = getAppDB()
  let updatedRows = []
  const rename = updatedTable._rename
  let deletedColumns: any = []
  if (oldTable && oldTable.schema && updatedTable.schema) {
    deletedColumns = Object.keys(oldTable.schema).filter(
      colName => updatedTable.schema[colName] == null
    )
  }
  // check for renaming of columns or deleted columns
  if (rename || deletedColumns.length !== 0) {
    // Update all rows
    const rows = await db.allDocs(
      getRowParams(updatedTable._id, null, {
        include_docs: true,
      })
    )
    const rawRows = rows.rows.map(({ doc }: any) => doc)
    updatedRows = rawRows.map((row: any) => {
      row = cloneDeep(row)
      if (rename) {
        row[rename.updated] = row[rename.old]
        delete row[rename.old]
      } else if (deletedColumns.length !== 0) {
        deletedColumns.forEach((colName: any) => delete row[colName])
      }
      return row
    })

    // cleanup any attachments from object storage for deleted attachment columns
    await cleanupAttachments(updatedTable, { oldTable, rows: rawRows })
    // Update views
    await checkForViewUpdates(updatedTable, rename, deletedColumns)
    delete updatedTable._rename
  }
  return { rows: updatedRows, table: updatedTable }
}

// makes sure the passed in table isn't going to reset the auto ID
export function makeSureTableUpToDate(table: any, tableToSave: any) {
  if (!table) {
    return tableToSave
  }
  // sure sure rev is up to date
  tableToSave._rev = table._rev
  // make sure auto IDs are always updated - these are internal
  // so the client may not know they have changed
  let field: any
  let column: any
  for ([field, column] of Object.entries(table.schema)) {
    if (
      column.autocolumn &&
      column.subtype === AutoFieldSubTypes.AUTO_ID &&
      tableToSave.schema[field]
    ) {
      tableToSave.schema[field].lastID = column.lastID
    }
  }
  return tableToSave
}

export async function handleDataImport(user: any, table: any, dataImport: any) {
  if (!dataImport || !dataImport.csvString) {
    return table
  }

  const db = getAppDB()
  // Populate the table with rows imported from CSV in a bulk update
  const data = await transform({
    ...dataImport,
    existingTable: table,
  })

  let finalData: any = []
  for (let i = 0; i < data.length; i++) {
    let row = data[i]
    row._id = generateRowID(table._id)
    row.tableId = table._id
    const processed: any = inputProcessing(user, table, row, {
      noAutoRelationships: true,
    })
    table = processed.table
    row = processed.row

    let fieldName: any
    let schema: any
    for ([fieldName, schema] of Object.entries(table.schema)) {
      // check whether the options need to be updated for inclusion as part of the data import
      if (
        schema.type === FieldTypes.OPTIONS &&
        (!schema.constraints.inclusion ||
          schema.constraints.inclusion.indexOf(row[fieldName]) === -1)
      ) {
        schema.constraints.inclusion = [
          ...schema.constraints.inclusion,
          row[fieldName],
        ]
      }
    }

    finalData.push(row)
  }

  await quotas.addRows(finalData.length, () => db.bulkDocs(finalData))
  await events.rows.imported(table, "csv", finalData.length)
  return table
}

export async function handleSearchIndexes(table: any) {
  const db = getAppDB()
  // create relevant search indexes
  if (table.indexes && table.indexes.length > 0) {
    const currentIndexes = await db.getIndexes()
    const indexName = `search:${table._id}`

    const existingIndex = currentIndexes.indexes.find(
      (existing: any) => existing.name === indexName
    )

    if (existingIndex) {
      const currentFields = existingIndex.def.fields.map(
        (field: any) => Object.keys(field)[0]
      )

      // if index fields have changed, delete the original index
      if (!isEqual(currentFields, table.indexes)) {
        await db.deleteIndex(existingIndex)
        // create/recreate the index with fields
        await db.createIndex({
          index: {
            fields: table.indexes,
            name: indexName,
            ddoc: "search_ddoc",
            type: "json",
          },
        })
      }
    } else {
      // create/recreate the index with fields
      await db.createIndex({
        index: {
          fields: table.indexes,
          name: indexName,
          ddoc: "search_ddoc",
          type: "json",
        },
      })
    }
  }
  return table
}

export function checkStaticTables(table: any) {
  // check user schema has all required elements
  if (table._id === InternalTables.USER_METADATA) {
    for (let [key, schema] of Object.entries(USERS_TABLE_SCHEMA.schema)) {
      // check if the schema exists on the table to be created/updated
      if (table.schema[key] == null) {
        table.schema[key] = schema
      }
    }
  }
  return table
}

class TableSaveFunctions {
  db: any
  user: any
  oldTable: any
  dataImport: any
  rows: any

  constructor({ user, oldTable, dataImport }: any) {
    this.db = getAppDB()
    this.user = user
    this.oldTable = oldTable
    this.dataImport = dataImport
    // any rows that need updated
    this.rows = []
  }

  // before anything is done
  async before(table: any) {
    if (this.oldTable) {
      table = makeSureTableUpToDate(this.oldTable, table)
    }
    table = checkStaticTables(table)
    return table
  }

  // when confirmed valid
  async mid(table: any) {
    let response = await checkForColumnUpdates(this.oldTable, table)
    this.rows = this.rows.concat(response.rows)
    return table
  }

  // after saving
  async after(table: any) {
    table = await handleSearchIndexes(table)
    table = await handleDataImport(this.user, table, this.dataImport)
    return table
  }

  getUpdatedRows() {
    return this.rows
  }
}

export async function getAllInternalTables() {
  const db = getAppDB()
  const internalTables = await db.allDocs(
    getTableParams(null, {
      include_docs: true,
    })
  )
  return internalTables.rows.map((tableDoc: any) => ({
    ...tableDoc.doc,
    type: "internal",
    sourceId: BudibaseInternalDB._id,
  }))
}

export async function getAllExternalTables(datasourceId: any) {
  const db = getAppDB()
  const datasource = await db.get(datasourceId)
  if (!datasource || !datasource.entities) {
    throw "Datasource is not configured fully."
  }
  return datasource.entities
}

export async function getExternalTable(datasourceId: any, tableName: any) {
  const entities = await getAllExternalTables(datasourceId)
  return entities[tableName]
}

export async function getTable(tableId: any) {
  const db = getAppDB()
  if (isExternalTable(tableId)) {
    let { datasourceId, tableName } = breakExternalTableId(tableId)
    const datasource = await db.get(datasourceId)
    const table = await getExternalTable(datasourceId, tableName)
    return { ...table, sql: isSQL(datasource) }
  } else {
    return db.get(tableId)
  }
}

export async function checkForViewUpdates(
  table: any,
  rename: any,
  deletedColumns: any
) {
  const views = await getViews()
  const tableViews = views.filter(view => view.meta.tableId === table._id)

  // Check each table view to see if impacted by this table action
  for (let view of tableViews) {
    let needsUpdated = false

    // First check for renames, otherwise check for deletions
    if (rename) {
      // Update calculation field if required
      if (view.meta.field === rename.old) {
        view.meta.field = rename.updated
        needsUpdated = true
      }

      // Update group by field if required
      if (view.meta.groupBy === rename.old) {
        view.meta.groupBy = rename.updated
        needsUpdated = true
      }

      // Update filters if required
      if (view.meta.filters) {
        view.meta.filters.forEach((filter: any) => {
          if (filter.key === rename.old) {
            filter.key = rename.updated
            needsUpdated = true
          }
        })
      }
    } else if (deletedColumns) {
      deletedColumns.forEach((column: any) => {
        // Remove calculation statement if required
        if (view.meta.field === column) {
          delete view.meta.field
          delete view.meta.calculation
          delete view.meta.groupBy
          needsUpdated = true
        }

        // Remove group by field if required
        if (view.meta.groupBy === column) {
          delete view.meta.groupBy
          needsUpdated = true
        }

        // Remove filters referencing deleted field if required
        if (view.meta.filters && view.meta.filters.length) {
          const initialLength = view.meta.filters.length
          view.meta.filters = view.meta.filters.filter((filter: any) => {
            return filter.key !== column
          })
          if (initialLength !== view.meta.filters.length) {
            needsUpdated = true
          }
        }
      })
    }

    // Update view if required
    if (needsUpdated) {
      const newViewTemplate = viewTemplate(view.meta)
      await saveView(null, view.name, newViewTemplate)
      if (!newViewTemplate.meta.schema) {
        newViewTemplate.meta.schema = table.schema
      }
      table.views[view.name] = newViewTemplate.meta
    }
  }
}

export function generateForeignKey(column: any, relatedTable: any) {
  return `fk_${relatedTable.name}_${column.fieldName}`
}

export function generateJunctionTableName(
  column: any,
  table: any,
  relatedTable: any
) {
  return `jt_${table.name}_${relatedTable.name}_${column.name}_${column.fieldName}`
}

export function foreignKeyStructure(keyName: any, meta = null) {
  const structure: any = {
    type: FieldTypes.NUMBER,
    constraints: {},
    name: keyName,
  }
  if (meta) {
    structure.meta = meta
  }
  return structure
}

export function areSwitchableTypes(type1: any, type2: any) {
  if (
    SwitchableTypes.indexOf(type1) === -1 &&
    SwitchableTypes.indexOf(type2) === -1
  ) {
    return false
  }
  for (let option of CanSwitchTypes) {
    const index1 = option.indexOf(type1),
      index2 = option.indexOf(type2)
    if (index1 !== -1 && index2 !== -1 && index1 !== index2) {
      return true
    }
  }
  return false
}

export function hasTypeChanged(table: any, oldTable: any) {
  if (!oldTable) {
    return false
  }
  let key: any
  let field: any
  for ([key, field] of Object.entries(oldTable.schema)) {
    const oldType = field.type
    if (!table.schema[key]) {
      continue
    }
    const newType = table.schema[key].type
    if (oldType !== newType && !areSwitchableTypes(oldType, newType)) {
      return true
    }
  }
  return false
}

const _TableSaveFunctions = TableSaveFunctions
export { _TableSaveFunctions as TableSaveFunctions }
