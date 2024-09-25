import {
  Datasource,
  DocumentType,
  FieldType,
  isLogicalSearchOperator,
  Operation,
  QueryJson,
  RelationshipFieldMetadata,
  RelationshipsJson,
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
} from "../../../../../api/controllers/row/utils"
import sdk from "../../../../index"
import {
  mapToUserColumn,
  USER_COLUMN_PREFIX,
} from "../../../tables/internal/sqs"
import {
  context,
  sql,
  SQLITE_DESIGN_DOC_ID,
  SQS_DATASOURCE_INTERNAL,
} from "@budibase/backend-core"
import { generateJunctionTableID } from "../../../../../db/utils"
import AliasTables from "../../sqlAlias"
import { outputProcessing } from "../../../../../utilities/rowProcessor"
import pick from "lodash/pick"
import { processRowCountResponse } from "../../utils"
import {
  getRelationshipColumns,
  getTableIDList,
  updateFilterKeys,
} from "../filters"
import {
  dataFilters,
  helpers,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import { isSearchingByRowID } from "../utils"
import tracer from "dd-trace"

const builder = new sql.Sql(SqlClient.SQL_LITE)
const SQLITE_COLUMN_LIMIT = 2000
const MISSING_COLUMN_REGEX = new RegExp(`no such column: .+`)
const MISSING_TABLE_REGX = new RegExp(`no such table: .+`)
const DUPLICATE_COLUMN_REGEX = new RegExp(`duplicate column name: .+`)

function buildInternalFieldList(
  table: Table,
  tables: Table[],
  opts?: { relationships?: RelationshipsJson[] }
) {
  let fieldList: string[] = []
  const getJunctionFields = (relatedTable: Table, fields: string[]) => {
    const junctionFields: string[] = []
    fields.forEach(field => {
      junctionFields.push(
        `${generateJunctionTableID(table._id!, relatedTable._id!)}.${field}`
      )
    })
    return junctionFields
  }
  fieldList = fieldList.concat(
    PROTECTED_INTERNAL_COLUMNS.map(col => `${table._id}.${col}`)
  )
  for (let key of Object.keys(table.schema)) {
    const col = table.schema[key]
    const isRelationship = col.type === FieldType.LINK
    if (!opts?.relationships && isRelationship) {
      continue
    }
    if (!isRelationship) {
      fieldList.push(`${table._id}.${mapToUserColumn(key)}`)
    } else {
      const linkCol = col as RelationshipFieldMetadata
      const relatedTable = tables.find(table => table._id === linkCol.tableId)
      if (!relatedTable) {
        continue
      }
      const relatedFields = buildInternalFieldList(relatedTable, tables).concat(
        getJunctionFields(relatedTable, ["doc1.fieldName", "doc2.fieldName"])
      )
      // break out of the loop if we have reached the max number of columns
      if (relatedFields.length + fieldList.length > SQLITE_COLUMN_LIMIT) {
        break
      }
      fieldList = fieldList.concat(relatedFields)
    }
  }
  return [...new Set(fieldList)]
}

function cleanupFilters(
  filters: SearchFilters,
  table: Table,
  allTables: Table[]
) {
  // get a list of all relationship columns in the table for updating
  const relationshipColumns = getRelationshipColumns(table)
  // get table names to ID map for relationships
  const tableNameToID = getTableIDList(allTables)
  // all should be applied at once
  filters = updateFilterKeys(
    filters,
    relationshipColumns
      .map(({ name, definition }) => ({
        original: name,
        updated: definition.tableId,
      }))
      .concat(
        tableNameToID.map(({ name, id }) => ({
          original: name,
          updated: id,
        }))
      )
  )

  // generate a map of all possible column names (these can be duplicated across tables
  // the map of them will always be the same
  const userColumnMap: Record<string, string> = {}
  allTables.forEach(table =>
    Object.keys(table.schema).forEach(
      key => (userColumnMap[key] = mapToUserColumn(key))
    )
  )

  // update the keys of filters to manage user columns
  const keyInAnyTable = (key: string): boolean =>
    allTables.some(table => table.schema[key])

  const splitter = new dataFilters.ColumnSplitter(allTables)

  const prefixFilters = (filters: SearchFilters) => {
    for (const filterKey of Object.keys(filters) as (keyof SearchFilters)[]) {
      if (isLogicalSearchOperator(filterKey)) {
        for (const condition of filters[filterKey]!.conditions) {
          prefixFilters(condition)
        }
      } else {
        const filter = filters[filterKey]!
        if (typeof filter !== "object") {
          continue
        }
        for (const key of Object.keys(filter)) {
          const { numberPrefix, relationshipPrefix, column } = splitter.run(key)
          if (keyInAnyTable(column)) {
            filter[
              `${numberPrefix || ""}${
                relationshipPrefix || ""
              }${mapToUserColumn(column)}`
            ] = filter[key]
            delete filter[key]
          }
        }
      }
    }
  }
  prefixFilters(filters)
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

// table is only needed to handle relationships
function reverseUserColumnMapping(rows: Row[], table?: Table) {
  const prefixLength = USER_COLUMN_PREFIX.length
  return rows.map(row => {
    const finalRow: Row = {}
    for (let key of Object.keys(row)) {
      // handle relationships
      if (
        table?.schema[key]?.type === FieldType.LINK &&
        typeof row[key] === "string"
      ) {
        // no table required, relationship rows don't contain relationships
        row[key] = reverseUserColumnMapping(JSON.parse(row[key]))
      }
      // it should be the first prefix
      const index = key.indexOf(USER_COLUMN_PREFIX)
      if (index !== -1) {
        // cut out the prefix
        const newKey = key.slice(0, index) + key.slice(index + prefixLength)
        const decoded = helpers.schema.decodeNonAscii(newKey)
        finalRow[decoded] = row[key]
      } else {
        finalRow[key] = row[key]
      }
    }
    return finalRow
  })
}

function runSqlQuery(
  json: QueryJson,
  tables: Table[],
  relationships: RelationshipsJson[]
): Promise<Row[]>
function runSqlQuery(
  json: QueryJson,
  tables: Table[],
  relationships: RelationshipsJson[],
  opts: { countTotalRows: true }
): Promise<number>
async function runSqlQuery(
  json: QueryJson,
  tables: Table[],
  relationships: RelationshipsJson[],
  opts?: { countTotalRows?: boolean }
) {
  const relationshipJunctionTableIds = relationships.map(rel => rel.through!)
  const alias = new AliasTables(
    tables.map(table => table.name).concat(relationshipJunctionTableIds)
  )
  if (opts?.countTotalRows) {
    json.endpoint.operation = Operation.COUNT
  }
  const processSQLQuery = async (_: Datasource, json: QueryJson) => {
    const query = builder._query(json, {
      disableReturning: true,
    })

    if (Array.isArray(query)) {
      throw new Error("SQS cannot currently handle multiple queries")
    }

    let sql = query.sql
    let bindings = query.bindings

    // quick hack for docIds
    const fixJunctionDocs = (field: string) =>
      ["doc1", "doc2"].forEach(doc => {
        sql = sql.replaceAll(`\`${doc}\`.\`${field}\``, `\`${doc}.${field}\``)
      })
    fixJunctionDocs("rowId")
    fixJunctionDocs("fieldName")

    if (Array.isArray(query)) {
      throw new Error("SQS cannot currently handle multiple queries")
    }

    const db = context.getAppDB()

    return await tracer.trace("sqs.runSqlQuery", async span => {
      span?.addTags({ sql })
      return await db.sql<Row>(sql, bindings)
    })
  }
  const response = await alias.queryWithAliasing(json, processSQLQuery)
  if (opts?.countTotalRows) {
    return processRowCountResponse(response)
  } else if (Array.isArray(response)) {
    return reverseUserColumnMapping(response, json.meta.table)
  }
  return response
}

function resyncDefinitionsRequired(status: number, message: string) {
  // pre data_ prefix on column names, need to resync
  return (
    // there are tables missing - try a resync
    (status === 400 && message?.match(MISSING_TABLE_REGX)) ||
    // there are columns missing - try a resync
    (status === 400 && message?.match(MISSING_COLUMN_REGEX)) ||
    // duplicate column name in definitions - need to re-run definition sync
    (status === 400 && message?.match(DUPLICATE_COLUMN_REGEX)) ||
    // no design document found, needs a full sync
    (status === 404 && message?.includes(SQLITE_DESIGN_DOC_ID))
  )
}

export async function search(
  options: RowSearchParams,
  table: Table,
  opts?: { retrying?: boolean }
): Promise<SearchResponse<Row>> {
  let { paginate, query, ...params } = options

  const allTables = await sdk.tables.getAllInternalTables()
  const allTablesMap = buildTableMap(allTables)
  // make sure we have the mapped/latest table
  if (table?._id) {
    table = allTablesMap[table?._id]
  }
  if (!table) {
    throw new Error("Unable to find table")
  }

  const relationships = buildInternalRelationships(table, allTables)

  const searchFilters: SearchFilters = {
    ...cleanupFilters(query, table, allTables),
    documentType: DocumentType.ROW,
  }
  const request: QueryJson = {
    endpoint: {
      // not important, we query ourselves
      datasourceId: SQS_DATASOURCE_INTERNAL,
      entityId: table._id!,
      operation: Operation.READ,
    },
    filters: searchFilters,
    table,
    meta: {
      table,
      tables: allTablesMap,
      columnPrefix: USER_COLUMN_PREFIX,
    },
    resource: {
      fields: buildInternalFieldList(table, allTables, { relationships }),
    },
    relationships,
  }

  if (params.sort) {
    const sortField = table.schema[params.sort]
    const sortType =
      sortField.type === FieldType.NUMBER ? SortType.NUMBER : SortType.STRING
    request.sort = {
      [mapToUserColumn(sortField.name)]: {
        direction: params.sortOrder || SortOrder.ASCENDING,
        type: sortType as SortType,
      },
    }
  }

  if (params.bookmark && typeof params.bookmark !== "number") {
    throw new Error("Unable to paginate with string based bookmarks")
  }

  const bookmark: number = (params.bookmark as number) || 0
  // limits don't apply if we doing a row ID search
  if (!isSearchingByRowID(searchFilters) && params.limit) {
    paginate = true
    request.paginate = {
      limit: params.limit + 1,
      offset: bookmark,
    }
  }

  try {
    const [rows, totalRows] = await Promise.all([
      runSqlQuery(request, allTables, relationships),
      options.countRows
        ? runSqlQuery(request, allTables, relationships, {
            countTotalRows: true,
          })
        : Promise.resolve(undefined),
    ])

    // process from the format of tableId.column to expected format also
    // make sure JSON columns corrected
    const processed = builder.convertJsonStringColumns<Row>(
      table,
      await sqlOutputProcessing(rows, table!, allTablesMap, relationships, {
        sqs: true,
      })
    )

    // check for pagination final row
    let nextRow: boolean = false
    if (paginate && params.limit && rows.length > params.limit) {
      // remove the extra row that confirmed if there is another row to move to
      nextRow = true
      if (processed.length > params.limit) {
        processed.pop()
      }
    }

    // get the rows
    let finalRows = await outputProcessing(table, processed, {
      preserveLinks: true,
      squash: true,
      fromViewId: options.viewId,
    })

    // check if we need to pick specific rows out
    if (options.fields) {
      const fields = [...options.fields, ...PROTECTED_INTERNAL_COLUMNS]
      finalRows = finalRows.map((r: any) => pick(r, fields))
    }

    const response: SearchResponse<Row> = {
      rows: finalRows,
    }
    if (totalRows != null) {
      response.totalRows = totalRows
    }
    // check for pagination
    if (paginate && nextRow) {
      response.hasNextPage = true
      response.bookmark = bookmark + processed.length
    }
    if (paginate && !nextRow) {
      response.hasNextPage = false
    }
    return response
  } catch (err: any) {
    const msg = typeof err === "string" ? err : err.message
    if (!opts?.retrying && resyncDefinitionsRequired(err.status, msg)) {
      await sdk.tables.sqs.syncDefinition()
      return search(options, table, { retrying: true })
    }
    // previously the internal table didn't error when a column didn't exist in search
    if (err.status === 400 && msg?.match(MISSING_COLUMN_REGEX)) {
      return { rows: [] }
    }
    throw new Error(`Unable to search by SQL - ${msg}`, { cause: err })
  }
}
