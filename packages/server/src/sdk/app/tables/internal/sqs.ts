import { context, SQLITE_DESIGN_DOC_ID } from "@budibase/backend-core"
import { FieldType, SQLiteDefinition, SQLiteType, Table } from "@budibase/types"
import { cloneDeep } from "lodash"
import tablesSdk from "../"
import { CONSTANT_INTERNAL_ROW_COLS } from "../../../../db/utils"

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
  [FieldType.AUTO]: SQLiteType.TEXT,
  [FieldType.OPTIONS]: SQLiteType.TEXT,
  [FieldType.JSON]: SQLiteType.BLOB,
  [FieldType.INTERNAL]: SQLiteType.BLOB,
  [FieldType.BARCODEQR]: SQLiteType.BLOB,
  [FieldType.ATTACHMENT]: SQLiteType.BLOB,
  [FieldType.ARRAY]: SQLiteType.BLOB,
  [FieldType.LINK]: SQLiteType.BLOB,
  [FieldType.BIGINT]: SQLiteType.REAL,
  // TODO: consider the difference between multi-user and single user types (subtyping)
  [FieldType.BB_REFERENCE]: SQLiteType.TEXT,
}

function mapTable(table: Table): { [key: string]: SQLiteType } {
  const fields: Record<string, SQLiteType> = {}
  for (let [key, column] of Object.entries(table.schema)) {
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
  return {
    ...constantMap,
    ...fields,
  }
}

// nothing exists, need to iterate though existing tables
async function buildBaseDefinition(): Promise<SQLiteDefinition> {
  const tables = await tablesSdk.getAllInternalTables()
  const definition = cloneDeep(BASIC_SQLITE_DOC)
  for (let table of tables) {
    definition.sql.tables[table._id!] = {
      fields: mapTable(table),
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
  definition.sql.tables[table._id!] = {
    fields: mapTable(table),
  }
  await db.put(definition)
}
