export enum SQLiteType {
  REAL = "REAL",
  TEXT = "VARCHAR",
  INT = "INTEGER",
  BLOB = "BLOB",
  NUMERIC = "NUMERIC",
}

export type SQLiteTable = Record<
  string,
  SQLiteType | { field: string; type: SQLiteType }
>

export type SQLiteTables = Record<
  string,
  {
    fields: SQLiteTable
  }
>

export interface SQLiteDefinition {
  _id: string
  _rev: string
  language: string
  sql: {
    tables: SQLiteTables
    options: {
      table_name: string
    }
  }
}

export interface PreSaveSQLiteDefinition
  extends Omit<SQLiteDefinition, "_rev"> {
  _rev?: string
}
