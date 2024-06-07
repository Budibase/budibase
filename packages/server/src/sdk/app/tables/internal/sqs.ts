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
import {
  CONSTANT_INTERNAL_ROW_COLS,
  generateJunctionTableID,
} from "../../../../db/utils"
import { isEqual } from "lodash"

const FieldTypeMap: Record<FieldType, SQLiteType> = {
  [FieldType.BOOLEAN]: SQLiteType.NUMERIC,
  [FieldType.DATETIME]: SQLiteType.TEXT,
  [FieldType.FORMULA]: SQLiteType.TEXT,
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

// this can generate relationship tables as part of the mapping
function mapTable(table: Table): SQLiteTables {
  const tables: SQLiteTables = {}
  const fields: Record<string, SQLiteType> = {}
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
    fields[key] = FieldTypeMap[column.type]
  }
  // there are some extra columns to map - add these in
  const constantMap: Record<string, SQLiteType> = {}
  CONSTANT_INTERNAL_ROW_COLS.forEach(col => {
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
    const definition = await db.get<SQLiteDefinition>(SQLITE_DESIGN_DOC_ID)
    if (definition.sql?.tables?.[table._id!]) {
      delete definition.sql.tables[table._id!]
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
