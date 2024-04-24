import { InternalTables } from "../../../../db/utils"
import * as userController from "../../user"
import { context } from "@budibase/backend-core"
import {
  Ctx,
  DatasourcePlusQueryResponse,
  FieldType,
  RelationshipsJson,
  Row,
  Table,
  UserCtx,
} from "@budibase/types"
import {
  processDates,
  processFormulas,
} from "../../../../utilities/rowProcessor"
import { updateRelationshipColumns } from "./sqlUtils"
import {
  basicProcessing,
  generateIdForRow,
  fixArrayTypes,
  getInternalRowId,
} from "./basic"
import sdk from "../../../../sdk"
import { processStringSync } from "@budibase/string-templates"
import validateJs from "validate.js"

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

export async function findRow(ctx: UserCtx, tableId: string, rowId: string) {
  const db = context.getAppDB()
  let row: Row
  // TODO remove special user case in future
  if (tableId === InternalTables.USER_METADATA) {
    ctx.params = {
      id: rowId,
    }
    await userController.findMetadata(ctx)
    row = ctx.body
  } else {
    row = await db.get(rowId)
  }
  if (row.tableId !== tableId) {
    throw "Supplied tableId does not match the rows tableId"
  }
  return row
}

export function getTableId(ctx: Ctx): string {
  // top priority, use the URL first
  if (ctx.params?.sourceId) {
    return ctx.params.sourceId
  }
  // now check for old way of specifying table ID
  if (ctx.params?.tableId) {
    return ctx.params.tableId
  }
  // check body for a table ID
  if (ctx.request.body?.tableId) {
    return ctx.request.body.tableId
  }
  // now check if a specific view name
  if (ctx.params?.viewName) {
    return ctx.params.viewName
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

export async function sqlOutputProcessing(
  rows: DatasourcePlusQueryResponse,
  table: Table,
  tables: Record<string, Table>,
  relationships: RelationshipsJson[],
  opts?: { sqs?: boolean }
): Promise<Row[]> {
  if (!Array.isArray(rows) || rows.length === 0 || rows[0].read === true) {
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
    // this is a relationship of some sort
    if (finalRows[rowId]) {
      finalRows = await updateRelationshipColumns(
        table,
        tables,
        row,
        finalRows,
        relationships,
        opts
      )
      continue
    }
    const thisRow = fixArrayTypes(
      basicProcessing({
        row,
        table,
        isLinked: false,
        sqs: opts?.sqs,
      }),
      table
    )
    if (thisRow._id == null) {
      throw new Error("Unable to generate row ID for SQL rows")
    }
    finalRows[thisRow._id] = thisRow
    // do this at end once its been added to the final rows
    finalRows = await updateRelationshipColumns(
      table,
      tables,
      row,
      finalRows,
      relationships,
      opts
    )
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
  return tableId === InternalTables.USER_METADATA
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
