import {
  DocumentType,
  FieldType,
  Operation,
  QueryJson,
  RelationshipFieldMetadata,
  Row,
  RowSearchParams,
  SearchFilters,
  SearchResponse,
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
    // need a primary for sorting, lookups etc
    table.primary = ["_id"]
    tableMap[table._id!] = table
  }
  return tableMap
}

function runSqlQuery(json: QueryJson, tables: Table[]): Promise<Row[]>
function runSqlQuery(
  json: QueryJson,
  tables: Table[],
  opts: { countTotalRows: boolean }
): Promise<number>
async function runSqlQuery(
  json: QueryJson,
  tables: Table[],
  opts?: { countTotalRows?: boolean }
) {
  const alias = new AliasTables(tables.map(table => table.name))
  if (opts?.countTotalRows) {
    json.endpoint.operation = Operation.COUNT
  }
  const processSQLQuery = async (json: QueryJson) => {
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
  }
  if (opts?.countTotalRows) {
    return await alias.countWithAliasing(json, processSQLQuery)
  } else {
    return await alias.queryWithAliasing(json, processSQLQuery)
  }
}

export async function search(
  options: RowSearchParams,
  table: Table
): Promise<SearchResponse<Row>> {
  const { paginate, query, ...params } = options

  const allTables = await sdk.tables.getAllInternalTables()
  const allTablesMap = buildTableMap(allTables)
  // make sure we have the mapped/latest table
  if (table?._id) {
    table = allTablesMap[table?._id]
  }
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
    filters: {
      ...cleanupFilters(query, allTables),
      documentType: DocumentType.ROW,
    },
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
    request.sort = {
      [sortField.name]: {
        direction: params.sortOrder || SortOrder.DESCENDING,
        type: sortType as SortType,
      },
    }
  }

  if (params.bookmark && typeof params.bookmark !== "number") {
    throw new Error("Unable to paginate with string based bookmarks")
  }

  const bookmark: number = (params.bookmark as number) || 0
  if (paginate && params.limit) {
    request.paginate = {
      limit: params.limit + 1,
      offset: bookmark * params.limit,
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
    if (paginate && params.limit && rows.length > params.limit) {
      // remove the extra row that confirmed if there is another row to move to
      nextRow = processed.pop()
    }

    let totalRows: number | undefined
    if (options.countRows) {
      // get the total count of rows
      totalRows = await runSqlQuery(request, allTables, {
        countTotalRows: true,
      })
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

    const response: SearchResponse<Row> = {
      rows: finalRows,
    }
    if (totalRows) {
      response.totalRows = totalRows
    }
    // check for pagination
    if (paginate && nextRow) {
      response.hasNextPage = true
      response.bookmark = bookmark + 1
    }
    return response
  } catch (err: any) {
    const msg = typeof err === "string" ? err : err.message
    if (err.status === 404 && msg?.includes(SQLITE_DESIGN_DOC_ID)) {
      await sdk.tables.sqs.syncDefinition()
      return search(options, table)
    }
    throw new Error(`Unable to search by SQL - ${msg}`, { cause: err })
  }
}
