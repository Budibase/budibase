import {
  FieldType,
  Operation,
  QueryJson,
  RelationshipFieldMetadata,
  Row,
  SearchFilters,
  RowSearchParams,
  SearchResponse,
  SortDirection,
  SortOrder,
  SortType,
  Table,
} from "@budibase/types"
import SqlQueryBuilder from "../../../../integrations/base/sql"
import { SqlClient } from "../../../../integrations/utils"
import {
  buildInternalRelationships,
  sqlOutputProcessing,
} from "../../../../api/controllers/row/utils"
import sdk from "../../../index"
import { context } from "@budibase/backend-core"
import { CONSTANT_INTERNAL_ROW_COLS } from "../../../../db/utils"

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

export async function search(
  options: RowSearchParams
): Promise<SearchResponse<Row>> {
  const { tableId, paginate, query, ...params } = options

  const builder = new SqlQueryBuilder(SqlClient.SQL_LITE)
  const allTables = await sdk.tables.getAllInternalTables()
  const allTablesMap = buildTableMap(allTables)
  const table = allTables.find(table => table._id === tableId)
  if (!table) {
    throw new Error("Unable to find table")
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

  if (params.sort) {
    const sortField = table.schema[params.sort]
    const sortType =
      sortField.type === FieldType.NUMBER ? SortType.NUMBER : SortType.STRING
    const sortDirection =
      params.sortOrder === SortOrder.ASCENDING
        ? SortDirection.ASCENDING
        : SortDirection.DESCENDING
    request.sort = {
      [sortField.name]: {
        direction: sortDirection,
        type: sortType as SortType,
      },
    }
  }
  if (paginate && params.limit) {
    request.paginate = {
      limit: params.limit,
      page: params.bookmark,
    }
  }
  try {
    const query = builder._query(request, {
      disableReturning: true,
    })

    if (Array.isArray(query)) {
      throw new Error("SQS cannot currently handle multiple queries")
    }

    let sql = query.sql,
      bindings = query.bindings

    // quick hack for docIds
    sql = sql.replace(/`doc1`.`rowId`/g, "`doc1.rowId`")
    sql = sql.replace(/`doc2`.`rowId`/g, "`doc2.rowId`")

    const db = context.getAppDB()
    const rows = await db.sql<Row>(sql, bindings)

    return {
      rows: await sqlOutputProcessing(
        rows,
        table!,
        allTablesMap,
        relationships,
        {
          sqs: true,
        }
      ),
    }
  } catch (err: any) {
    const msg = typeof err === "string" ? err : err.message
    throw new Error(`Unable to search by SQL - ${msg}`)
  }
}
