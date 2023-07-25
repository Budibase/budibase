import * as linkRows from "../../../db/linkedRows"
import {
  generateRowID,
  getTableIDFromRowID,
  InternalTables,
} from "../../../db/utils"
import * as userController from "../user"
import {
  inputProcessing,
  outputProcessing,
  cleanupAttachments,
} from "../../../utilities/rowProcessor"
import { FieldTypes } from "../../../constants"
import * as utils from "./utils"
import { cloneDeep } from "lodash/fp"
import { context, db as dbCore } from "@budibase/backend-core"
import { finaliseRow, updateRelatedFormula } from "./staticFormula"
import { UserCtx, LinkDocumentValue, Row, Table } from "@budibase/types"
import sdk from "../../../sdk"

export async function patch(ctx: UserCtx) {
  const db = context.getAppDB()
  const inputs = ctx.request.body
  const tableId = inputs.tableId
  const isUserTable = tableId === InternalTables.USER_METADATA
  let oldRow
  try {
    let dbTable = await sdk.tables.getTable(tableId)
    oldRow = await outputProcessing(
      dbTable,
      await utils.findRow(ctx, tableId, inputs._id)
    )
  } catch (err) {
    if (isUserTable) {
      // don't include the rev, it'll be the global rev
      // this time
      oldRow = {
        _id: inputs._id,
      }
    } else {
      throw "Row does not exist"
    }
  }
  let dbTable = await sdk.tables.getTable(tableId)
  // need to build up full patch fields before coerce
  let combinedRow: any = cloneDeep(oldRow)
  for (let key of Object.keys(inputs)) {
    if (!dbTable.schema[key]) continue
    combinedRow[key] = inputs[key]
  }

  // need to copy the table so it can be differenced on way out
  const tableClone = cloneDeep(dbTable)

  // this returns the table and row incase they have been updated
  let { table, row } = inputProcessing(ctx.user, tableClone, combinedRow)
  const validateResult = await utils.validate({
    row,
    table,
  })

  if (!validateResult.valid) {
    ctx.throw(400, { validation: validateResult.errors })
  }

  // returned row is cleaned and prepared for writing to DB
  row = (await linkRows.updateLinks({
    eventType: linkRows.EventType.ROW_UPDATE,
    row,
    tableId: row.tableId,
    table,
  })) as Row
  // check if any attachments removed
  await cleanupAttachments(table, { oldRow, row })

  if (isUserTable) {
    // the row has been updated, need to put it into the ctx
    ctx.request.body = row
    await userController.updateMetadata(ctx)
    return { row: ctx.body, table }
  }

  return finaliseRow(table, row, {
    oldTable: dbTable,
    updateFormula: true,
  })
}

export async function save(ctx: UserCtx) {
  const db = context.getAppDB()
  let inputs = ctx.request.body
  inputs.tableId = ctx.params.tableId

  if (!inputs._rev && !inputs._id) {
    inputs._id = generateRowID(inputs.tableId)
  }

  // this returns the table and row incase they have been updated
  const dbTable = await sdk.tables.getTable(inputs.tableId)

  // need to copy the table so it can be differenced on way out
  const tableClone = cloneDeep(dbTable)

  let { table, row } = inputProcessing(ctx.user, tableClone, inputs)

  const validateResult = await utils.validate({
    row,
    table,
  })

  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }

  // make sure link rows are up to date
  row = (await linkRows.updateLinks({
    eventType: linkRows.EventType.ROW_SAVE,
    row,
    tableId: row.tableId,
    table,
  })) as Row

  return finaliseRow(table, row, {
    oldTable: dbTable,
    updateFormula: true,
  })
}

export async function find(ctx: UserCtx) {
  const db = dbCore.getDB(ctx.appId)
  const table = await sdk.tables.getTable(ctx.params.tableId)
  let row = await utils.findRow(ctx, ctx.params.tableId, ctx.params.rowId)
  row = await outputProcessing(table, row)
  return row
}

export async function destroy(ctx: UserCtx) {
  const db = context.getAppDB()
  const { _id } = ctx.request.body
  let row = await db.get<Row>(_id)
  let _rev = ctx.request.body._rev || row._rev

  if (row.tableId !== ctx.params.tableId) {
    throw "Supplied tableId doesn't match the row's tableId"
  }
  const table = await sdk.tables.getTable(row.tableId)
  // update the row to include full relationships before deleting them
  row = await outputProcessing(table, row, { squash: false })
  // now remove the relationships
  await linkRows.updateLinks({
    eventType: linkRows.EventType.ROW_DELETE,
    row,
    tableId: row.tableId,
  })
  // remove any attachments that were on the row from object storage
  await cleanupAttachments(table, { row })
  // remove any static formula
  await updateRelatedFormula(table, row)

  let response
  if (ctx.params.tableId === InternalTables.USER_METADATA) {
    ctx.params = {
      id: _id,
    }
    await userController.destroyMetadata(ctx)
    response = ctx.body
  } else {
    response = await db.remove(_id, _rev)
  }
  return { response, row }
}

export async function bulkDestroy(ctx: UserCtx) {
  const db = context.getAppDB()
  const tableId = ctx.params.tableId
  const table = await sdk.tables.getTable(tableId)
  let { rows } = ctx.request.body

  // before carrying out any updates, make sure the rows are ready to be returned
  // they need to be the full rows (including previous relationships) for automations
  const processedRows = (await outputProcessing(table, rows, {
    squash: false,
  })) as Row[]

  // remove the relationships first
  let updates: Promise<any>[] = processedRows.map(row =>
    linkRows.updateLinks({
      eventType: linkRows.EventType.ROW_DELETE,
      row,
      tableId: row.tableId,
    })
  )
  if (tableId === InternalTables.USER_METADATA) {
    updates = updates.concat(
      processedRows.map(row => {
        ctx.params = {
          id: row._id,
        }
        return userController.destroyMetadata(ctx)
      })
    )
  } else {
    await db.bulkDocs(processedRows.map(row => ({ ...row, _deleted: true })))
  }
  // remove any attachments that were on the rows from object storage
  await cleanupAttachments(table, { rows: processedRows })
  await updateRelatedFormula(table, processedRows)
  await Promise.all(updates)
  return { response: { ok: true }, rows: processedRows }
}

export async function fetchEnrichedRow(ctx: UserCtx) {
  const db = context.getAppDB()
  const tableId = ctx.params.tableId
  const rowId = ctx.params.rowId
  // need table to work out where links go in row
  let [table, row] = await Promise.all([
    sdk.tables.getTable(tableId),
    utils.findRow(ctx, tableId, rowId),
  ])
  // get the link docs
  const linkVals = (await linkRows.getLinkDocuments({
    tableId,
    rowId,
  })) as LinkDocumentValue[]
  // look up the actual rows based on the ids
  let response = (
    await db.allDocs({
      include_docs: true,
      keys: linkVals.map(linkVal => linkVal.id),
    })
  ).rows.map(row => row.doc)
  // group responses by table
  let groups: any = {},
    tables: Record<string, Table> = {}
  for (let row of response) {
    if (!row.tableId) {
      row.tableId = getTableIDFromRowID(row._id)
    }
    const linkedTableId = row.tableId
    if (groups[linkedTableId] == null) {
      groups[linkedTableId] = [row]
      tables[linkedTableId] = await db.get(linkedTableId)
    } else {
      groups[linkedTableId].push(row)
    }
  }
  let linkedRows: Row[] = []
  for (let [tableId, rows] of Object.entries(groups)) {
    // need to include the IDs in these rows for any links they may have
    linkedRows = linkedRows.concat(
      await outputProcessing(tables[tableId], rows as Row[])
    )
  }

  // insert the link rows in the correct place throughout the main row
  for (let fieldName of Object.keys(table.schema)) {
    let field = table.schema[fieldName]
    if (field.type === FieldTypes.LINK) {
      // find the links that pertain to this field, get their indexes
      const linkIndexes = linkVals
        .filter(link => link.fieldName === fieldName)
        .map(link => linkVals.indexOf(link))
      // find the rows that the links state are linked to this field
      row[fieldName] = linkedRows.filter((linkRow, index) =>
        linkIndexes.includes(index)
      )
    }
  }
  return row
}
