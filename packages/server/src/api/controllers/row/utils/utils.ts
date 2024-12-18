import * as utils from "../../../../db/utils"

import { docIds, sql } from "@budibase/backend-core"
import {
  Ctx,
  DatasourcePlusQueryResponse,
  FieldType,
  RelationshipsJson,
  Row,
  Table,
  ViewV2,
} from "@budibase/types"
import {
  processDates,
  processFormulas,
} from "../../../../utilities/rowProcessor"
import { isKnexRows } from "./sqlUtils"
import { basicProcessing, generateIdForRow, getInternalRowId } from "./basic"
import sdk from "../../../../sdk"
import { processStringSync } from "@budibase/string-templates"
import validateJs from "validate.js"
import { helpers } from "@budibase/shared-core"

validateJs.extend(validateJs.validators.datetime, {
  parse: function (value: string) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function (value: string) {
    return new Date(value).toISOString()
  },
})

export async function processRelationshipFields(
  table: Table,
  tables: Record<string, Table>,
  row: Row,
  relationships: RelationshipsJson[]
): Promise<Row> {
  for (let relationship of relationships) {
    const linkedTable = tables[relationship.tableName]
    if (!linkedTable || !row[relationship.column]) {
      continue
    }
    for (let key of Object.keys(row[relationship.column])) {
      let relatedRow: Row = row[relationship.column][key]
      // add this row as context for the relationship
      for (let col of Object.values(linkedTable.schema)) {
        if (col.type === FieldType.LINK && col.tableId === table._id) {
          relatedRow[col.name] = [row]
        }
      }
      // process additional types
      relatedRow = processDates(table, relatedRow)
      relatedRow = await processFormulas(linkedTable, relatedRow)
      row[relationship.column][key] = relatedRow
    }
  }
  return row
}

export function getSourceId(ctx: Ctx): { tableId: string; viewId?: string } {
  // top priority, use the URL first
  if (ctx.params?.sourceId) {
    const { sourceId } = ctx.params
    if (docIds.isViewId(sourceId)) {
      return {
        tableId: utils.extractViewInfoFromID(sourceId).tableId,
        viewId: sql.utils.encodeViewId(sourceId),
      }
    }
    return { tableId: sql.utils.encodeTableId(ctx.params.sourceId) }
  }
  // now check for old way of specifying table ID
  if (ctx.params?.tableId) {
    return { tableId: sql.utils.encodeTableId(ctx.params.tableId) }
  }
  // check body for a table ID
  if (ctx.request.body?.tableId) {
    return { tableId: sql.utils.encodeTableId(ctx.request.body.tableId) }
  }
  throw new Error("Unable to find table ID in request")
}

export async function getSource(ctx: Ctx): Promise<Table | ViewV2> {
  const { tableId, viewId } = getSourceId(ctx)
  if (viewId) {
    return sdk.views.get(viewId)
  }
  return sdk.tables.getTable(tableId)
}

export async function getTableFromSource(source: Table | ViewV2) {
  if (sdk.views.isView(source)) {
    return await sdk.views.getTable(source.id)
  }
  return source
}

function fixBooleanFields(row: Row, table: Table) {
  for (let col of Object.values(table.schema)) {
    if (col.type === FieldType.BOOLEAN) {
      if (row[col.name] === 1) {
        row[col.name] = true
      } else if (row[col.name] === 0) {
        row[col.name] = false
      }
    }
  }
  return row
}

export function getSourceFields(source: Table | ViewV2): string[] {
  const isView = sdk.views.isView(source)
  if (isView) {
    const fields = Object.keys(
      helpers.views.basicFields(source, { visible: true })
    )
    return fields
  }

  const fields = Object.entries(source.schema)
    .filter(([_, field]) => field.visible !== false)
    .map(([columnName]) => columnName)
  return fields
}

export async function sqlOutputProcessing(
  rows: DatasourcePlusQueryResponse,
  source: Table | ViewV2,
  tables: Record<string, Table>,
  relationships: RelationshipsJson[],
  opts?: { sqs?: boolean }
): Promise<Row[]> {
  if (!isKnexRows(rows)) {
    return []
  }

  let table: Table
  let isCalculationView = false
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
    isCalculationView = helpers.views.isCalculationView(source)
  } else {
    table = source
  }

  let processedRows: Row[] = []
  for (let row of rows) {
    if (opts?.sqs) {
      row._id = getInternalRowId(row, table)
    } else if (row._id == null && !isCalculationView) {
      row._id = generateIdForRow(row, table)
    }

    row = await basicProcessing({
      row,
      source,
      tables: Object.values(tables),
      isLinked: false,
      sqs: opts?.sqs,
    })
    row = fixBooleanFields(row, table)
    row = await processRelationshipFields(table, tables, row, relationships)
    processedRows.push(row)
  }

  return processDates(table, processedRows)
}

export function isUserMetadataTable(tableId: string) {
  return tableId === utils.InternalTables.USER_METADATA
}

export async function enrichArrayContext(
  fields: any[],
  inputs = {},
  helpers = true
): Promise<any[]> {
  const map: Record<string, any> = {}
  for (let index in fields) {
    map[index] = fields[index]
  }
  const output = await enrichSearchContext(map, inputs, helpers)
  const outputArray: any[] = []
  for (let [key, value] of Object.entries(output)) {
    outputArray[parseInt(key)] = value
  }
  return outputArray
}

export async function enrichSearchContext(
  fields: Record<string, any> | undefined,
  inputs = {},
  helpers = true
): Promise<Record<string, any>> {
  const enrichedQuery: Record<string, any> = {}
  if (!fields || !inputs) {
    return enrichedQuery
  }
  const parameters = { ...inputs }

  if (Array.isArray(fields)) {
    return enrichArrayContext(fields, inputs, helpers)
  }

  // enrich the fields with dynamic parameters
  for (let key of Object.keys(fields)) {
    if (fields[key] == null) {
      enrichedQuery[key] = null
      continue
    }
    if (typeof fields[key] === "object") {
      // enrich nested fields object
      enrichedQuery[key] = await enrichSearchContext(
        fields[key],
        parameters,
        helpers
      )
    } else if (typeof fields[key] === "string") {
      // enrich string value as normal
      enrichedQuery[key] = processStringSync(fields[key], parameters, {
        noEscaping: true,
        noHelpers: !helpers,
        escapeNewlines: true,
      })
    } else {
      enrichedQuery[key] = fields[key]
    }
  }

  return enrichedQuery
}
