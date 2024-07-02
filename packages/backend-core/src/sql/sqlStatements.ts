import { FieldType, Table, FieldSchema, SqlClient } from "@budibase/types"
import { Knex } from "knex"

export class SqlStatements {
  client: string
  table: Table
  allOr: boolean | undefined
  columnPrefix: string | undefined

  constructor(
    client: string,
    table: Table,
    { allOr, columnPrefix }: { allOr?: boolean; columnPrefix?: string } = {}
  ) {
    this.client = client
    this.table = table
    this.allOr = allOr
    this.columnPrefix = columnPrefix
  }

  getField(key: string): FieldSchema | undefined {
    const fieldName = key.split(".")[1]
    let found = this.table.schema[fieldName]
    if (!found && this.columnPrefix) {
      const prefixRemovedFieldName = fieldName.replace(this.columnPrefix, "")
      found = this.table.schema[prefixRemovedFieldName]
    }
    return found
  }

  between(
    query: Knex.QueryBuilder,
    key: string,
    low: number | string,
    high: number | string
  ) {
    // Use a between operator if we have 2 valid range values
    const field = this.getField(key)
    if (
      field?.type === FieldType.BIGINT &&
      this.client === SqlClient.SQL_LITE
    ) {
      query = query.whereRaw(
        `CAST(${key} AS INTEGER) BETWEEN CAST(? AS INTEGER) AND CAST(? AS INTEGER)`,
        [low, high]
      )
    } else {
      const fnc = this.allOr ? "orWhereBetween" : "whereBetween"
      query = query[fnc](key, [low, high])
    }
    return query
  }

  lte(query: Knex.QueryBuilder, key: string, low: number | string) {
    // Use just a single greater than operator if we only have a low
    const field = this.getField(key)
    if (
      field?.type === FieldType.BIGINT &&
      this.client === SqlClient.SQL_LITE
    ) {
      query = query.whereRaw(`CAST(${key} AS INTEGER) >= CAST(? AS INTEGER)`, [
        low,
      ])
    } else {
      const fnc = this.allOr ? "orWhere" : "where"
      query = query[fnc](key, ">=", low)
    }
    return query
  }

  gte(query: Knex.QueryBuilder, key: string, high: number | string) {
    const field = this.getField(key)
    // Use just a single less than operator if we only have a high
    if (
      field?.type === FieldType.BIGINT &&
      this.client === SqlClient.SQL_LITE
    ) {
      query = query.whereRaw(`CAST(${key} AS INTEGER) <= CAST(? AS INTEGER)`, [
        high,
      ])
    } else {
      const fnc = this.allOr ? "orWhere" : "where"
      query = query[fnc](key, "<=", high)
    }
    return query
  }
}
