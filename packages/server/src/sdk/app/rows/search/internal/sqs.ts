import {
  Aggregation,
  CalculationType,
  DocumentType,
  EnrichedQueryJson,
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
  ViewV2,
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
import { enrichQueryJson, processRowCountResponse } from "../../utils"
import {
  dataFilters,
  helpers,
  isInternalColumnName,
  PROTECTED_INTERNAL_COLUMNS,
} from "@budibase/shared-core"
import { isSearchingByRowID } from "../utils"
import tracer from "dd-trace"
import { cloneDeep } from "lodash"

const builder = new sql.Sql(SqlClient.SQL_LITE)
const SQLITE_COLUMN_LIMIT = 2000
const MISSING_COLUMN_REGEX = new RegExp(`no such column: .+`)
const MISSING_TABLE_REGX = new RegExp(`no such table: .+`)
const DUPLICATE_COLUMN_REGEX = new RegExp(`duplicate column name: .+`)

export async function buildInternalFieldList(
  source: Table | ViewV2,
  tables: Table[],
  opts?: {
    relationships?: RelationshipsJson[]
    allowedFields?: string[]
    includeHiddenFields?: boolean
  }
) {
  const { relationships, allowedFields, includeHiddenFields } = opts || {}
  let schemaFields: string[] = []

  const isView = sdk.views.isView(source)
  let table: Table
  if (isView) {
    table = await sdk.views.getTable(source.id)
  } else {
    table = source
  }

  if (isView) {
    schemaFields = Object.keys(helpers.views.basicFields(source))
  } else {
    schemaFields = Object.keys(source.schema).filter(
      key => includeHiddenFields || source.schema[key].visible !== false
    )
  }

  const containsFormula = schemaFields.some(
    f => table.schema[f]?.type === FieldType.FORMULA
  )
  // If are requesting for a formula field, we need to retrieve all fields
  if (containsFormula) {
    schemaFields = Object.keys(table.schema)
  } else if (allowedFields) {
    schemaFields = schemaFields.filter(field => allowedFields.includes(field))
  }

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
  if (sdk.tables.isTable(source)) {
    for (const key of PROTECTED_INTERNAL_COLUMNS) {
      if (allowedFields && !allowedFields.includes(key)) {
        continue
      }
      fieldList.push(`${table._id}.${key}`)
    }
  }
  for (let key of schemaFields) {
    const col = table.schema[key]

    const isRelationship = col.type === FieldType.LINK
    if (!relationships && isRelationship) {
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

      // a quirk of how junction documents work in Budibase, refer to the "LinkDocument" type to see the full
      // structure - essentially all relationships between two tables will be inserted into a single "table"
      // we don't use an independent junction table ID for each separate relationship between two tables. For
      // example if we have table A and B, with two relationships between them, all the junction documents will
      // end up in the same junction table ID. We need to retrieve the field name property of the junction documents
      // as part of the relationship to tell us which relationship column the junction is related to.
      const relatedFields = (
        await buildInternalFieldList(relatedTable, tables, {
          includeHiddenFields: containsFormula,
        })
      ).concat(
        getJunctionFields(relatedTable, ["doc1.fieldName", "doc2.fieldName"])
      )
      // break out of the loop if we have reached the max number of columns
      if (relatedFields.length + fieldList.length > SQLITE_COLUMN_LIMIT) {
        break
      }
      fieldList = fieldList.concat(relatedFields)
    }
  }

  if (!isView || !helpers.views.isCalculationView(source)) {
    for (const field of PROTECTED_INTERNAL_COLUMNS) {
      fieldList.push(`${table._id}.${field}`)
    }
  }

  return [...new Set(fieldList)]
}

function cleanupFilters(filters: SearchFilters, allTables: Table[]) {
  // generate a map of all possible column names (these can be duplicated across tables
  // the map of them will always be the same
  const userColumnMap: Record<string, string> = {}
  for (const table of allTables) {
    for (const key of Object.keys(table.schema)) {
      if (isInternalColumnName(key)) {
        continue
      }
      userColumnMap[key] = mapToUserColumn(key)
    }
  }

  // update the keys of filters to manage user columns
  const keyInAnyTable = (key: string): boolean => {
    if (isInternalColumnName(key)) {
      return false
    }
    return allTables.some(table => table.schema[key])
  }

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
  json: EnrichedQueryJson,
  tables: Table[],
  relationships: RelationshipsJson[]
): Promise<Row[]>
function runSqlQuery(
  json: EnrichedQueryJson,
  tables: Table[],
  relationships: RelationshipsJson[],
  opts: { countTotalRows: true }
): Promise<number>
async function runSqlQuery(
  json: EnrichedQueryJson,
  tables: Table[],
  relationships: RelationshipsJson[],
  opts?: { countTotalRows?: boolean }
) {
  const relationshipJunctionTableIds = relationships.map(rel => rel.through!)
  const alias = new AliasTables(
    tables.map(table => table._id!).concat(relationshipJunctionTableIds)
  )
  if (opts?.countTotalRows) {
    json.operation = Operation.COUNT
  }
  const processSQLQuery = async (json: EnrichedQueryJson) => {
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
    return reverseUserColumnMapping(response, json.table)
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
  source: Table | ViewV2,
  opts?: { retrying?: boolean }
): Promise<SearchResponse<Row>> {
  let { paginate, query, ...params } = cloneDeep(options)

  let table: Table
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
  } else {
    table = source
  }

  const allTables = await sdk.tables.getAllInternalTables()
  const allTablesMap = allTables.reduce((acc, table) => {
    acc[table._id!] = table
    return acc
  }, {} as Record<string, Table>)

  // make sure we have the mapped/latest table
  if (table._id) {
    table = allTablesMap[table._id]
  }
  if (!table) {
    throw new Error("Unable to find table")
  }

  const relationships = buildInternalRelationships(table, allTables)

  const searchFilters: SearchFilters = {
    ...cleanupFilters(query, allTables),
    documentType: DocumentType.ROW,
  }

  let aggregations: Aggregation[] = []
  if (sdk.views.isView(source) && helpers.views.isCalculationView(source)) {
    const calculationFields = helpers.views.calculationFields(source)

    for (const [key, field] of Object.entries(calculationFields)) {
      if (options.fields && !options.fields.includes(key)) {
        continue
      }

      if (field.calculationType === CalculationType.COUNT) {
        if ("distinct" in field && field.distinct) {
          aggregations.push({
            name: key,
            distinct: true,
            field: mapToUserColumn(field.field),
            calculationType: field.calculationType,
          })
        } else {
          aggregations.push({
            name: key,
            calculationType: field.calculationType,
            field: mapToUserColumn(field.field),
          })
        }
      } else {
        aggregations.push({
          name: key,
          field: mapToUserColumn(field.field),
          calculationType: field.calculationType,
        })
      }
    }
  }

  const request: QueryJson = {
    endpoint: {
      // not important, we query ourselves
      datasourceId: SQS_DATASOURCE_INTERNAL,
      entityId: table._id!,
      operation: Operation.READ,
    },
    filters: searchFilters,
    meta: {
      columnPrefix: USER_COLUMN_PREFIX,
    },
    resource: {
      fields: await buildInternalFieldList(source, allTables, {
        relationships,
        allowedFields: options.fields,
      }),
      aggregations,
    },
    relationships,
  }

  if (params.sort) {
    const sortField = table.schema[params.sort]
    const isAggregateField = aggregations.some(agg => agg.name === params.sort)

    if (isAggregateField) {
      request.sort = {
        [params.sort]: {
          direction: params.sortOrder || SortOrder.ASCENDING,
          type: SortType.NUMBER,
        },
      }
    } else if (sortField) {
      const sortType =
        sortField.type === FieldType.NUMBER ? SortType.NUMBER : SortType.STRING
      request.sort = {
        [mapToUserColumn(sortField.name)]: {
          direction: params.sortOrder || SortOrder.ASCENDING,
          type: sortType as SortType,
        },
      }
    } else {
      throw new Error(`Unable to sort by ${params.sort}`)
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

  const enrichedRequest = await enrichQueryJson(request)

  try {
    const [rows, totalRows] = await Promise.all([
      runSqlQuery(enrichedRequest, allTables, relationships),
      options.countRows
        ? runSqlQuery(enrichedRequest, allTables, relationships, {
            countTotalRows: true,
          })
        : Promise.resolve(undefined),
    ])

    // process from the format of tableId.column to expected format also
    // make sure JSON columns corrected
    const processed = builder.convertJsonStringColumns<Row>(
      table,
      await sqlOutputProcessing(rows, source, allTablesMap, relationships, {
        sqs: true,
      })
    )

    // check for pagination final row
    let nextRow = false
    if (paginate && params.limit && rows.length > params.limit) {
      // remove the extra row that confirmed if there is another row to move to
      nextRow = true
      if (processed.length > params.limit) {
        processed.pop()
      }
    }

    // get the rows
    let finalRows = await outputProcessing(source, processed, {
      preserveLinks: true,
      squash: true,
    })

    const visibleFields =
      options.fields ||
      Object.keys(source.schema || {}).filter(
        key => source.schema?.[key].visible !== false
      )
    const allowedFields = [...visibleFields, ...PROTECTED_INTERNAL_COLUMNS]
    finalRows = finalRows.map((r: any) => pick(r, allowedFields))

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
      return search(options, source, { retrying: true })
    }
    // previously the internal table didn't error when a column didn't exist in search
    if (err.status === 400 && msg?.match(MISSING_COLUMN_REGEX)) {
      return { rows: [] }
    }
    throw new Error(`Unable to search by SQL - ${msg}`, { cause: err })
  }
}
