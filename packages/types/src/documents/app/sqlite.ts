export enum SQLiteType {
  REAL = "REAL",
  TEXT = "VARCHAR",
  INT = "INTEGER",
  BLOB = "BLOB",
  NUMERIC = "NUMERIC",
}

export interface SQLiteDefinition {
  _id: string
  language: string
  sql: {
    tables: {
      [tableName: string]: {
        fields: {
          [key: string]: SQLiteType | { field: string; type: SQLiteType }
        }
      }
    }
    options: {
      table_name: string
    }
  }
}
