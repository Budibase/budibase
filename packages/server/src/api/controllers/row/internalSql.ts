import {
  FieldType,
  Operation,
  QueryJson,
  RelationshipFieldMetadata,
  Row,
  SearchFilters,
  SortType,
  Table,
  UserCtx,
} from "@budibase/types"
import SqlQueryBuilder from "../../../integrations/base/sql"
import { SqlClient } from "../../../integrations/utils"
import { buildInternalRelationships, sqlOutputProcessing } from "./utils"
import sdk from "../../../sdk"
import { context } from "@budibase/backend-core"
import { CONSTANT_INTERNAL_ROW_COLS } from "../../../db/utils"

function buildInternalFieldList(
  table: Table,
  tables: Table[],
  opts: { relationships: boolean } = { relationships: true }
) {
  let fieldList: string[] = []
  fieldList = fieldList.concat(
    CONSTANT_INTERNAL_ROW_COLS.map(col => `${table._id}.${col}`)
  )
  if (opts.relationships) {
    for (let col of Object.values(table.schema)) {
      if (col.type === FieldType.LINK) {
        const linkCol = col as RelationshipFieldMetadata
        const relatedTable = tables.find(
          table => table._id === linkCol.tableId
        )!
        fieldList = fieldList.concat(
          buildInternalFieldList(relatedTable, tables, { relationships: false })
        )
      } else {
        fieldList.push(`${table._id}.${col.name}`)
      }
    }
  }
  return fieldList
}

function tableInFilter(name: string) {
  return `:${name}.`
}

function cleanupFilters(filters: SearchFilters, tables: Table[]) {
  for (let filter of Object.values(filters)) {
    if (typeof filter !== "object") {
      continue
    }
    for (let [key, keyFilter] of Object.entries(filter)) {
      if (keyFilter === "") {
        delete filter[key]
      }

      // relationship, switch to table ID
      const tableRelated = tables.find(
        table =>
          table.originalName && key.includes(tableInFilter(table.originalName))
      )
      if (tableRelated && tableRelated.originalName) {
        filter[
          key.replace(
            tableInFilter(tableRelated.originalName),
            tableInFilter(tableRelated._id!)
          )
        ] = filter[key]
        delete filter[key]
      }
    }
  }
  return filters
}

function buildTableMap(tables: Table[]) {
  const tableMap: Record<string, Table> = {}
  for (let table of tables) {
    // update the table name, should never query by name for SQLite
    table.originalName = table.name
    table.name = table._id!
    tableMap[table._id!] = table
  }
  return tableMap
}

export async function sqlSearch(ctx: UserCtx) {
  const { tableId } = ctx.params
  const { paginate, query, ...params } = ctx.request.body

  const builder = new SqlQueryBuilder(SqlClient.SQL_LITE)
  const allTables = await sdk.tables.getAllInternalTables()
  const allTablesMap = buildTableMap(allTables)
  const table = allTables.find(table => table._id === tableId)
  if (!table) {
    ctx.throw(400, "Unable to find table")
  }

  const relationships = buildInternalRelationships(table)

  const request: QueryJson = {
    endpoint: {
      // not important, we query ourselves
      datasourceId: "internal",
      entityId: table._id!,
      operation: Operation.READ,
    },
    filters: cleanupFilters(query, allTables),
    table,
    meta: {
      table,
      tables: allTablesMap,
    },
    resource: {
      fields: buildInternalFieldList(table, allTables),
    },
    relationships,
  }
  // make sure only rows returned
  request.filters!.equal = {
    ...request.filters?.equal,
    type: "row",
  }

  if (params.sort && !params.sortType) {
    const sortField = table.schema[params.sort]
    const sortType = sortField.type == "number" ? "number" : "string"
    request.sort = {
      [sortField.name]: {
        direction: params.sortOrder,
        type: sortType as SortType,
      },
    }
  }
  if (paginate) {
    request.paginate = {
      limit: params.limit,
      page: params.bookmark,
    }
  }
  try {
    let sql = builder._query(request, {
      disableReturning: true,
      disablePreparedStatements: true,
    }) as string

    // quick hack for docIds
    sql = sql.replace(/`doc1`.`rowId`/g, "`doc1.rowId`")
    sql = sql.replace(/`doc2`.`rowId`/g, "`doc2.rowId`")

    const db = context.getAppDB()
    const rows = await db.sql<Row[]>(sql)

    return {
      rows: sqlOutputProcessing(rows, table!, allTablesMap, relationships, {
        internal: true,
      }),
    }
  } catch (err: any) {
    const msg = typeof err === "string" ? err : err.message
    throw new Error(`Unable to search by SQL - ${msg}`)
  }
}
