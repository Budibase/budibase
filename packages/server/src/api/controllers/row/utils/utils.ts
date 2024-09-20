import * as utils from "../../../../db/utils"

import { context } from "@budibase/backend-core"
import {
  Ctx,
  DatasourcePlusQueryResponse,
  FieldType,
  RelationshipsJson,
  Row,
  Table,
} from "@budibase/types"
import {
  processDates,
  processFormulas,
} from "../../../../utilities/rowProcessor"
import { isKnexEmptyReadResponse } from "./sqlUtils"
import { basicProcessing, generateIdForRow, getInternalRowId } from "./basic"
import sdk from "../../../../sdk"
import { processStringSync } from "@budibase/string-templates"
import validateJs from "validate.js"
import { getFullUser } from "../../../../utilities/users"

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

export async function findRow(tableId: string, rowId: string) {
  const db = context.getAppDB()
  let row: Row
  // TODO remove special user case in future
  if (tableId === utils.InternalTables.USER_METADATA) {
    row = await getFullUser(rowId)
  } else {
    row = await db.get(rowId)
  }
  if (row.tableId !== tableId) {
    throw "Supplied tableId does not match the rows tableId"
  }
  return row
}

export function getSourceId(ctx: Ctx): { tableId: string; viewId?: string } {
  // top priority, use the URL first
  if (ctx.params?.sourceId) {
    const { sourceId } = ctx.params
    if (utils.isViewID(sourceId)) {
      return {
        tableId: utils.extractViewInfoFromID(sourceId).tableId,
        viewId: sourceId,
      }
    }
    return { tableId: ctx.params.sourceId }
  }
  // now check for old way of specifying table ID
  if (ctx.params?.tableId) {
    return { tableId: ctx.params.tableId }
  }
  // check body for a table ID
  if (ctx.request.body?.tableId) {
    return { tableId: ctx.request.body.tableId }
  }
  throw new Error("Unable to find table ID in request")
}

export async function validate(
  opts: { row: Row } & ({ tableId: string } | { table: Table })
) {
  let fetchedTable: Table
  if ("tableId" in opts) {
    fetchedTable = await sdk.tables.getTable(opts.tableId)
  } else {
    fetchedTable = opts.table
  }
  return sdk.rows.utils.validate({
    ...opts,
    table: fetchedTable,
  })
}

function fixBooleanFields({ row, table }: { row: Row; table: Table }) {
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

export async function sqlOutputProcessing(
  rows: DatasourcePlusQueryResponse,
  table: Table,
  tables: Record<string, Table>,
  relationships: RelationshipsJson[],
  opts?: { sqs?: boolean }
): Promise<Row[]> {
  if (isKnexEmptyReadResponse(rows)) {
    return []
  }
  let finalRows: { [key: string]: Row } = {}
  for (let row of rows as Row[]) {
    let rowId = row._id
    if (opts?.sqs) {
      rowId = getInternalRowId(row, table)
      row._id = rowId
    } else if (!rowId) {
      rowId = generateIdForRow(row, table)
      row._id = rowId
    }
    const thisRow = basicProcessing({
      row,
      table,
      tables: Object.values(tables),
      isLinked: false,
      sqs: opts?.sqs,
    })
    if (thisRow._id == null) {
      throw new Error("Unable to generate row ID for SQL rows")
    }

    finalRows[thisRow._id] = fixBooleanFields({ row: thisRow, table })
  }

  // make sure all related rows are correct
  let finalRowArray = []
  for (let row of Object.values(finalRows)) {
    finalRowArray.push(
      await processRelationshipFields(table, tables, row, relationships)
    )
  }

  // process some additional types
  finalRowArray = processDates(table, finalRowArray)
  return finalRowArray
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
  fields: Record<string, any>,
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
