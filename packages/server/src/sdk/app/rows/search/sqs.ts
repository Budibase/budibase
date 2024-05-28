import {
  FieldType,
  Operation,
  QueryJson,
  RelationshipFieldMetadata,
  Row,
  RowSearchParams,
  SearchFilters,
  SearchResponse,
  SortDirection,
  SortOrder,
  SortType,
  SqlClient,
  Table,
} from "@budibase/types"
import {
  buildInternalRelationships,
  sqlOutputProcessing,
} from "../../../../api/controllers/row/utils"
import sdk from "../../../index"
import {
  context,
  sql,
  SQLITE_DESIGN_DOC_ID,
  SQS_DATASOURCE_INTERNAL,
} from "@budibase/backend-core"
import { CONSTANT_INTERNAL_ROW_COLS } from "../../../../db/utils"
import AliasTables from "../sqlAlias"
import { outputProcessing } from "../../../../utilities/rowProcessor"
import pick from "lodash/pick"

const builder = new sql.Sql(SqlClient.SQL_LITE)

function buildInternalFieldList(
  table: Table,
  tables: Table[],
  opts: { relationships: boolean } = { relationships: true }
) {
  let fieldList: string[] = []
  fieldList = fieldList.concat(
    CONSTANT_INTERNAL_ROW_COLS.map(col => `${table._id}.${col}`)
  )
  for (let col of Object.values(table.schema)) {
    const isRelationship = col.type === FieldType.LINK
    if (!opts.relationships && isRelationship) {
      continue
    }
    if (isRelationship) {
      const linkCol = col as RelationshipFieldMetadata
      const relatedTable = tables.find(table => table._id === linkCol.tableId)!
      fieldList = fieldList.concat(
        buildInternalFieldList(relatedTable, tables, { relationships: false })
      )
    } else {
      fieldList.push(`${table._id}.${col.name}`)
    }
  }
  return fieldList
}

function tableNameInFieldRegex(tableName: string) {
  return new RegExp(`^${tableName}.|:${tableName}.`, "g")
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
          table.originalName &&
          key.match(tableNameInFieldRegex(table.originalName))
      )
      if (tableRelated && tableRelated.originalName) {
        // only replace the first, not replaceAll
        filter[key.replace(tableRelated.originalName, tableRelated._id!)] =
          filter[key]
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

async function runSqlQuery(json: QueryJson, tables: Table[]) {
  const alias = new AliasTables(tables.map(table => table.name))
  return await alias.queryWithAliasing(json, async json => {
    const query = builder._query(json, {
      disableReturning: true,
    })

    if (Array.isArray(query)) {
      throw new Error("SQS cannot currently handle multiple queries")
    }

    let sql = query.sql
    let bindings = query.bindings

    // quick hack for docIds
    sql = sql.replace(/`doc1`.`rowId`/g, "`doc1.rowId`")
    sql = sql.replace(/`doc2`.`rowId`/g, "`doc2.rowId`")

    if (Array.isArray(query)) {
      throw new Error("SQS cannot currently handle multiple queries")
    }

    const db = context.getAppDB()
    return await db.sql<Row>(sql, bindings)
  })
}

export async function search(
  options: RowSearchParams,
  table: Table
): Promise<SearchResponse<Row>> {
  const { paginate, query, ...params } = options

  const allTables = await sdk.tables.getAllInternalTables()
  const allTablesMap = buildTableMap(allTables)
  if (!table) {
    throw new Error("Unable to find table")
  }

  const relationships = buildInternalRelationships(table)

  const request: QueryJson = {
    endpoint: {
      // not important, we query ourselves
      datasourceId: SQS_DATASOURCE_INTERNAL,
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

  if (params.bookmark && typeof params.bookmark !== "number") {
    throw new Error("Unable to paginate with string based bookmarks")
  }
  const bookmark: number = (params.bookmark as number) || 1
  const limit = params.limit
  if (paginate && params.limit) {
    request.paginate = {
      limit: params.limit + 1,
      page: bookmark,
    }
  }
  try {
    const rows = await runSqlQuery(request, allTables)

    // process from the format of tableId.column to expected format also
    // make sure JSON columns corrected
    const processed = builder.convertJsonStringColumns<Row>(
      table,
      await sqlOutputProcessing(rows, table!, allTablesMap, relationships, {
        sqs: true,
      })
    )

    // check for pagination final row
    let nextRow: Row | undefined
    if (paginate && params.limit && processed.length > params.limit) {
      nextRow = processed.pop()
    }

    // get the rows
    let finalRows = await outputProcessing<Row[]>(table, processed, {
      preserveLinks: true,
      squash: true,
    })

    // check if we need to pick specific rows out
    if (options.fields) {
      const fields = [...options.fields, ...CONSTANT_INTERNAL_ROW_COLS]
      finalRows = finalRows.map((r: any) => pick(r, fields))
    }

    // check for pagination
    if (paginate && limit) {
      const response: SearchResponse<Row> = {
        rows: finalRows,
      }
      const prevLimit = request.paginate!.limit
      request.paginate = {
        limit: 1,
        page: bookmark * prevLimit + 1,
      }
      const hasNextPage = !!nextRow
      response.hasNextPage = hasNextPage
      if (hasNextPage) {
        response.bookmark = bookmark + 1
      }
      return response
    } else {
      return {
        rows: finalRows,
      }
    }
  } catch (err: any) {
    const msg = typeof err === "string" ? err : err.message
    if (err.status === 404 && msg?.includes(SQLITE_DESIGN_DOC_ID)) {
      await sdk.tables.sqs.syncDefinition()
      return search(options, table)
    }
    throw new Error(`Unable to search by SQL - ${msg}`, { cause: err })
  }
}
