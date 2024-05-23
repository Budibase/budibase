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
import { context, SQLITE_DESIGN_DOC_ID } from "@budibase/backend-core"
import {
  CONSTANT_INTERNAL_ROW_COLS,
  SQS_DATASOURCE_INTERNAL,
} from "../../../../db/utils"
import AliasTables from "../sqlAlias"
import { outputProcessing } from "../../../../utilities/rowProcessor"
import pick from "lodash/pick"

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

export async function search(
  options: RowSearchParams,
  table: Table
): Promise<SearchResponse<Row>> {
  const { paginate, query, ...params } = options

  const builder = new SqlQueryBuilder(SqlClient.SQL_LITE)
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
  if (paginate && params.limit) {
    request.paginate = {
      limit: params.limit,
      page: params.bookmark,
    }
  }
  try {
    const alias = new AliasTables(allTables.map(table => table.name))
    const rows = await alias.queryWithAliasing(request, async json => {
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

      const db = context.getAppDB()
      return await db.sql<Row>(sql, bindings)
    })

    // process from the format of tableId.column to expected format
    const processed = await sqlOutputProcessing(
      rows,
      table!,
      allTablesMap,
      relationships,
      {
        sqs: true,
      }
    )

    const output = {
      rows: await outputProcessing<Row[]>(table, processed, {
        preserveLinks: true,
        squash: true,
      }),
    }

    if (options.fields) {
      const fields = [...options.fields, ...CONSTANT_INTERNAL_ROW_COLS]
      output.rows = output.rows.map((r: any) => pick(r, fields))
    }

    return output
  } catch (err: any) {
    const msg = typeof err === "string" ? err : err.message
    if (err.status === 404 && err.message?.includes(SQLITE_DESIGN_DOC_ID)) {
      await sdk.tables.sqs.syncDefinition()
      return search(options, table)
    }
    throw new Error(`Unable to search by SQL - ${msg}`, { cause: err })
  }
}
