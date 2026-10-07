import { Client } from "pg"
import type { ColumnMapping } from "./schemaMapping.js"
import type { BudibaseRow } from "./types.js"

const ID_COLUMN = "_bb_id"

function quoteIdent(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`
}

export class PostgresSink {
  private readonly client: Client

  constructor(config: {
    host: string
    port: number
    database: string
    user: string
    password: string
    ssl: boolean
  }) {
    this.client = new Client(config)
  }

  async connect(): Promise<void> {
    await this.client.connect()
  }

  async close(): Promise<void> {
    await this.client.end()
  }

  async ensureSchema(schema: string): Promise<void> {
    await this.client.query(`CREATE SCHEMA IF NOT EXISTS ${quoteIdent(schema)}`)
  }

  async createTable(
    schema: string,
    table: string,
    columns: ColumnMapping[]
  ): Promise<void> {
    const columnDefs = columns
      .map(c => `${quoteIdent(c.column)} ${c.pgType}`)
      .join(",\n  ")
    const ddl = `
CREATE TABLE IF NOT EXISTS ${quoteIdent(schema)}.${quoteIdent(table)} (
  ${quoteIdent(ID_COLUMN)} text PRIMARY KEY,
  ${columnDefs}
)`
    await this.client.query(ddl)
  }

  async upsertBatch(
    schema: string,
    table: string,
    columns: ColumnMapping[],
    rows: BudibaseRow[]
  ): Promise<void> {
    if (rows.length === 0) {
      return
    }
    const allColumns = [ID_COLUMN, ...columns.map(c => c.column)]
    const valuesSql: string[] = []
    const params: unknown[] = []
    let paramIndex = 1

    for (const row of rows) {
      const placeholders: string[] = [`$${paramIndex++}`]
      params.push(row._id)
      for (const col of columns) {
        placeholders.push(`$${paramIndex++}`)
        params.push(toPgValue(row[col.column], col.pgType))
      }
      valuesSql.push(`(${placeholders.join(", ")})`)
    }

    const updateSet = columns
      .map(c => `${quoteIdent(c.column)} = EXCLUDED.${quoteIdent(c.column)}`)
      .join(",\n  ")

    const sql = `
INSERT INTO ${quoteIdent(schema)}.${quoteIdent(table)} (${allColumns.map(quoteIdent).join(", ")})
VALUES ${valuesSql.join(",\n")}
ON CONFLICT (${quoteIdent(ID_COLUMN)}) DO UPDATE SET
  ${updateSet}`

    await this.client.query(sql, params)
  }
}

function toPgValue(value: unknown, pgType: string): unknown {
  if (value === undefined) {
    return null
  }
  if (pgType === "jsonb" && value !== null) {
    return JSON.stringify(value)
  }
  return value
}
