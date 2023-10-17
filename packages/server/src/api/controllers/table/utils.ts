import { parse, isSchema, isRows } from "../../../utilities/schema"
import { getRowParams, generateRowID, InternalTables } from "../../../db/utils"
import isEqual from "lodash/isEqual"
import {
  AutoFieldSubTypes,
  FieldTypes,
  GOOGLE_SHEETS_PRIMARY_KEY,
} from "../../../constants"
import {
  inputProcessing,
  cleanupAttachments,
} from "../../../utilities/rowProcessor"
import {
  USERS_TABLE_SCHEMA,
  SwitchableTypes,
  CanSwitchTypes,
} from "../../../constants"
import { getViews, saveView } from "../view/utils"
import viewTemplate from "../view/viewBuilder"
import { cloneDeep } from "lodash/fp"
import { quotas } from "@budibase/pro"
import { events, context } from "@budibase/backend-core"
import {
  ContextUser,
  Datasource,
  Row,
  SourceName,
  Table,
} from "@budibase/types"

export async function clearColumns(table: any, columnNames: any) {
  const db = context.getAppDB()
  const rows = await db.allDocs(
    getRowParams(table._id, null, {
      include_docs: true,
    })
  )
  return (await db.bulkDocs(
    rows.rows.map(({ doc }: any) => {
      columnNames.forEach((colName: any) => delete doc[colName])
      return doc
    })
  )) as { id: string; _rev?: string }[]
}

export async function checkForColumnUpdates(oldTable: any, updatedTable: any) {
  const db = context.getAppDB()
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

export async function importToRows(
  data: any[],
  table: Table,
  user: ContextUser | null = null
) {
  let originalTable = table
  let finalData: any = []
  for (let i = 0; i < data.length; i++) {
    let row = data[i]
    row._id = generateRowID(table._id!)
    row.tableId = table._id

    // We use a reference to table here and update it after input processing,
    // so that we can auto increment auto IDs in imported data properly
    const processed = await inputProcessing(user?._id, table, row, {
      noAutoRelationships: true,
    })
    row = processed.row
    table = processed.table

    // However here we must reference the original table, as we want to mutate
    // the real schema of the table passed in, not the clone used for
    // incrementing auto IDs
    for (const [fieldName, schema] of Object.entries(originalTable.schema)) {
      const rowVal = Array.isArray(row[fieldName])
        ? row[fieldName]
        : [row[fieldName]]
      if (
        (schema.type === FieldTypes.OPTIONS ||
          schema.type === FieldTypes.ARRAY) &&
        row[fieldName]
      ) {
        let merged = [...schema.constraints!.inclusion!, ...rowVal]
        let superSet = new Set(merged)
        schema.constraints!.inclusion = Array.from(superSet)
        schema.constraints!.inclusion.sort()
      }
    }

    finalData.push(row)
  }
  return finalData
}

export async function handleDataImport(
  user: ContextUser,
  table: Table,
  rows: Row[],
  identifierFields: Array<string> = []
) {
  const schema = table.schema

  if (!rows || !isRows(rows) || !isSchema(schema)) {
    return table
  }

  const db = context.getAppDB()
  const data = parse(rows, schema)

  let finalData: any = await importToRows(data, table, user)

  //Set IDs of finalData to match existing row if an update is expected
  if (identifierFields.length > 0) {
    const allDocs = await db.allDocs(
      getRowParams(table._id, null, {
        include_docs: true,
      })
    )
    allDocs.rows
      .map(existingRow => existingRow.doc)
      .forEach((doc: any) => {
        finalData.forEach((finalItem: any) => {
          let match = true
          for (const field of identifierFields) {
            if (finalItem[field] !== doc[field]) {
              match = false
              break
            }
          }
          if (match) {
            finalItem._id = doc._id
            finalItem._rev = doc._rev
          }
        })
      })
  }

  await quotas.addRows(finalData.length, () => db.bulkDocs(finalData), {
    tableId: table._id,
  })

  await events.rows.imported(table, finalData.length)
  return table
}

export async function handleSearchIndexes(table: any) {
  const db = context.getAppDB()
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
  importRows: any
  rows: any

  constructor({ user, oldTable, importRows }: any) {
    this.db = context.getAppDB()
    this.user = user
    this.oldTable = oldTable
    this.importRows = importRows
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
    table = await handleDataImport(this.user, table, this.importRows)
    return table
  }

  getUpdatedRows() {
    return this.rows
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
      const groupByField: any = Object.values(table.schema).find(
        (field: any) => field.name == view.groupBy
      )
      const newViewTemplate = viewTemplate(
        view.meta,
        groupByField?.type === FieldTypes.ARRAY
      )
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

export function foreignKeyStructure(keyName: any, meta?: any) {
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

export function hasTypeChanged(table: Table, oldTable: Table | undefined) {
  if (!oldTable) {
    return false
  }
  for (let [key, field] of Object.entries(oldTable.schema)) {
    if (!table.schema[key]) {
      continue
    }
    const oldType = field.type
    const newType = table.schema[key].type
    if (oldType !== newType && !areSwitchableTypes(oldType, newType)) {
      return true
    }
  }
  return false
}

// used for external tables, some of them will have static schemas that need
// to be hard set
export function setStaticSchemas(datasource: Datasource, table: Table) {
  // GSheets is a specific case - only ever has a static primary key
  if (table && datasource.source === SourceName.GOOGLE_SHEETS) {
    table.primary = [GOOGLE_SHEETS_PRIMARY_KEY]
    // if there is an id column, remove it, should never exist in GSheets
    delete table.schema?.id
  }
  return table
}

const _TableSaveFunctions = TableSaveFunctions
export { _TableSaveFunctions as TableSaveFunctions }
