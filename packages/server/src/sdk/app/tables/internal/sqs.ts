import { context, SQLITE_DESIGN_DOC_ID } from "@budibase/backend-core"
import {
  FieldType,
  RelationshipFieldMetadata,
  SQLiteDefinition,
  SQLiteTable,
  SQLiteTables,
  SQLiteType,
  Table,
} from "@budibase/types"
import { cloneDeep } from "lodash"
import tablesSdk from "../"
import {
  CONSTANT_INTERNAL_ROW_COLS,
  generateJunctionTableID,
} from "../../../../db/utils"

const BASIC_SQLITE_DOC: SQLiteDefinition = {
  _id: SQLITE_DESIGN_DOC_ID,
  language: "sqlite",
  sql: {
    tables: {},
    options: {
      table_name: "tableId",
    },
  },
}

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
async function buildBaseDefinition(): Promise<SQLiteDefinition> {
  const tables = await tablesSdk.getAllInternalTables()
  const definition = cloneDeep(BASIC_SQLITE_DOC)
  for (let table of tables) {
    definition.sql.tables = {
      ...definition.sql.tables,
      ...mapTable(table),
    }
  }
  return definition
}

export async function addTableToSqlite(table: Table) {
  const db = context.getAppDB()
  let definition: SQLiteDefinition
  try {
    definition = await db.get(SQLITE_DESIGN_DOC_ID)
  } catch (err) {
    definition = await buildBaseDefinition()
  }
  definition.sql.tables = {
    ...definition.sql.tables,
    ...mapTable(table),
  }
  await db.put(definition)
}
