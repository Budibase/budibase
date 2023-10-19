import { InternalTables } from "../../../../db/utils"
import * as userController from "../../user"
import { context } from "@budibase/backend-core"
import { Ctx, RelationshipsJson, Row, Table, UserCtx } from "@budibase/types"
import {
  processDates,
  processFormulas,
} from "../../../../utilities/rowProcessor"
import {
  squashRelationshipColumns,
  updateRelationshipColumns,
} from "./sqlUtils"
import { basicProcessing, generateIdForRow, fixArrayTypes } from "./basic"
import sdk from "../../../../sdk"

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

export function sqlOutputProcessing(
  rows: Row[] = [],
  table: Table,
  tables: Record<string, Table>,
  relationships: RelationshipsJson[],
  opts?: { internal?: boolean }
) {
  if (!rows || rows.length === 0 || rows[0].read === true) {
    return []
  }
  let finalRows: { [key: string]: Row } = {}
  for (let row of rows) {
    let rowId = row._id
    if (!rowId) {
      rowId = generateIdForRow(row, table)
      row._id = rowId
    }
    // this is a relationship of some sort
    if (finalRows[rowId]) {
      finalRows = updateRelationshipColumns(
        table,
        tables,
        row,
        finalRows,
        relationships
      )
      continue
    }
    const thisRow = fixArrayTypes(
      basicProcessing({
        row,
        table,
        isLinked: false,
        internal: opts?.internal,
      }),
      table
    )
    if (thisRow._id == null) {
      throw "Unable to generate row ID for SQL rows"
    }
    finalRows[thisRow._id] = thisRow
    // do this at end once its been added to the final rows
    finalRows = updateRelationshipColumns(
      table,
      tables,
      row,
      finalRows,
      relationships,
      opts
    )
  }

  // Process some additional data types
  let finalRowArray = Object.values(finalRows)
  finalRowArray = processDates(table, finalRowArray)
  finalRowArray = processFormulas(table, finalRowArray) as Row[]

  return finalRowArray.map((row: Row) =>
    squashRelationshipColumns(table, tables, row, relationships)
  )
}

export function isUserMetadataTable(tableId: string) {
  return tableId === InternalTables.USER_METADATA
}
