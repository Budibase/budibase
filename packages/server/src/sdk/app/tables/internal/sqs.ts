import { context, sql, SQLITE_DESIGN_DOC_ID } from "@budibase/backend-core"
import {
  FieldType,
  RelationshipFieldMetadata,
  SQLiteDefinition,
  PreSaveSQLiteDefinition,
  SQLiteTable,
  SQLiteTables,
  SQLiteType,
  Table,
} from "@budibase/types"
import tablesSdk from "../"
import { generateJunctionTableID } from "../../../../db/utils"
import { isEqual } from "lodash"
import { DEFAULT_TABLES } from "../../../../db/defaultData/datasource_bb_default"
import { helpers, PROTECTED_INTERNAL_COLUMNS } from "@budibase/shared-core"

const FieldTypeMap: Record<FieldType, SQLiteType> = {
  [FieldType.BOOLEAN]: SQLiteType.NUMERIC,
  [FieldType.DATETIME]: SQLiteType.TEXT,
  [FieldType.FORMULA]: SQLiteType.TEXT,
  [FieldType.AI]: SQLiteType.TEXT,
  [FieldType.LONGFORM]: SQLiteType.TEXT,
  [FieldType.NUMBER]: SQLiteType.REAL,
  [FieldType.STRING]: SQLiteType.TEXT,
  [FieldType.AUTO]: SQLiteType.REAL,
  [FieldType.OPTIONS]: SQLiteType.TEXT,
  [FieldType.JSON]: SQLiteType.BLOB,
  [FieldType.INTERNAL]: SQLiteType.BLOB,
  [FieldType.BARCODEQR]: SQLiteType.BLOB,
  [FieldType.ATTACHMENTS]: SQLiteType.BLOB,
  [FieldType.ATTACHMENT_SINGLE]: SQLiteType.BLOB,
  [FieldType.SIGNATURE_SINGLE]: SQLiteType.BLOB,
  [FieldType.ARRAY]: SQLiteType.BLOB,
  [FieldType.LINK]: SQLiteType.BLOB,
  [FieldType.BIGINT]: SQLiteType.TEXT,
  // TODO: consider the difference between multi-user and single user types (subtyping)
  [FieldType.BB_REFERENCE]: SQLiteType.TEXT,
  [FieldType.BB_REFERENCE_SINGLE]: SQLiteType.TEXT,
}

function buildRelationshipDefinitions(
  table: Table,
  relationshipColumn: RelationshipFieldMetadata
): {
  tableId: string
  definition: SQLiteTable
} {
  const tableId = table._id!,
    relatedTableId = relationshipColumn.tableId
  return {
    tableId: generateJunctionTableID(tableId, relatedTableId),
    definition: {
      ["doc1.rowId"]: SQLiteType.TEXT,
      ["doc1.tableId"]: SQLiteType.TEXT,
      ["doc1.fieldName"]: SQLiteType.TEXT,
      ["doc2.rowId"]: SQLiteType.TEXT,
      ["doc2.tableId"]: SQLiteType.TEXT,
      ["doc2.fieldName"]: SQLiteType.TEXT,
      tableId: SQLiteType.TEXT,
    },
  }
}

export const USER_COLUMN_PREFIX = "data_"

// utility function to denote that columns in SQLite are mapped to avoid overlap issues
// the overlaps can occur due to case insensitivity and some of the columns which Budibase requires
export function mapToUserColumn(key: string) {
  return `${USER_COLUMN_PREFIX}${helpers.schema.encodeNonAscii(key)}`
}

// this can generate relationship tables as part of the mapping
function mapTable(table: Table): SQLiteTables {
  const tables: SQLiteTables = {}
  const fields: Record<string, { field: string; type: SQLiteType }> = {}
  // a list to make sure no duplicates - the fields are mapped by SQS with case sensitivity
  // but need to make sure there are no duplicate columns
  const usedColumns: string[] = []
  for (let [key, column] of Object.entries(table.schema)) {
    // relationships should be handled differently
    if (column.type === FieldType.LINK) {
      const { tableId, definition } = buildRelationshipDefinitions(
        table,
        column
      )
      tables[tableId] = { fields: definition }
    }
    if (!FieldTypeMap[column.type]) {
      throw new Error(`Unable to map type "${column.type}" to SQLite type`)
    }
    const lcKey = key.toLowerCase()
    // ignore duplicates
    if (usedColumns.includes(lcKey)) {
      continue
    }
    usedColumns.push(lcKey)
    fields[mapToUserColumn(key)] = {
      field: key,
      type: FieldTypeMap[column.type],
    }
  }
  // there are some extra columns to map - add these in
  const constantMap: Record<string, SQLiteType> = {}
  PROTECTED_INTERNAL_COLUMNS.forEach(col => {
    constantMap[col] = SQLiteType.TEXT
  })
  const thisTable: SQLiteTable = {
    ...constantMap,
    ...fields,
  }
  tables[table._id!] = { fields: thisTable }
  return tables
}

// nothing exists, need to iterate though existing tables
async function buildBaseDefinition(): Promise<PreSaveSQLiteDefinition> {
  const tables = await tablesSdk.getAllInternalTables()
  for (const defaultTable of DEFAULT_TABLES) {
    // the default table doesn't exist in Couch, use the in-memory representation
    if (!tables.find(table => table._id === defaultTable._id)) {
      tables.push(defaultTable)
    }
  }
  const definition = sql.designDoc.base("tableId")
  for (let table of tables) {
    definition.sql.tables = {
      ...definition.sql.tables,
      ...mapTable(table),
    }
  }
  return definition
}

export async function syncDefinition(): Promise<void> {
  const db = context.getAppDB()
  let existing: SQLiteDefinition | undefined
  try {
    existing = await db.get<SQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
  } catch (err: any) {
    if (err.status !== 404) {
      throw err
    }
  }
  const definition = await buildBaseDefinition()
  if (existing) {
    definition._rev = existing._rev
  }
  // only write if something has changed
  if (!existing || !isEqual(existing.sql, definition.sql)) {
    await db.put(definition)
  }
}

export async function addTable(table: Table) {
  const db = context.getAppDB()
  let definition: PreSaveSQLiteDefinition | SQLiteDefinition
  try {
    definition = await db.get<SQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
  } catch (err) {
    definition = await buildBaseDefinition()
  }
  definition.sql.tables = {
    ...definition.sql.tables,
    ...mapTable(table),
  }
  await db.put(definition)
}

export async function removeTable(table: Table) {
  const db = context.getAppDB()
  try {
    const [tables, definition] = await Promise.all([
      tablesSdk.getAllInternalTables(),
      db.get<SQLiteDefinition>(SQLITE_DESIGN_DOC_ID),
    ])
    const tableIds = tables
      .map(tbl => tbl._id!)
      .filter(id => !id.includes(table._id!))
    let cleanup = false
    for (let tableKey of Object.keys(definition.sql?.tables || {})) {
      // there are no tables matching anymore
      if (!tableIds.find(id => tableKey.includes(id))) {
        delete definition.sql.tables[tableKey]
        cleanup = true
      }
    }
    if (cleanup) {
      await db.put(definition)
      // make sure SQS is cleaned up, tables removed
      await db.sqlDiskCleanup()
    }
  } catch (err: any) {
    if (err?.status === 404) {
      return
    } else {
      throw err
    }
  }
}
