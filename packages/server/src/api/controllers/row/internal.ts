import * as linkRows from "../../../db/linkedRows"
import {
  generateRowID,
  getMultiIDParams,
  getTableIDFromRowID,
  InternalTables,
} from "../../../db/utils"
import * as userController from "../user"
import {
  cleanupAttachments,
  inputProcessing,
  outputProcessing,
} from "../../../utilities/rowProcessor"
import { FieldTypes } from "../../../constants"
import * as utils from "./utils"
import { cloneDeep } from "lodash/fp"
import { context } from "@budibase/backend-core"
import { finaliseRow, updateRelatedFormula } from "./staticFormula"
import {
  LinkDocumentValue,
  PatchRowRequest,
  PatchRowResponse,
  Row,
  Table,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { getLinkedTableIDs } from "../../../db/linkedRows/linkUtils"
import { flatten } from "lodash"

export async function patch(ctx: UserCtx<PatchRowRequest, PatchRowResponse>) {
  const tableId = utils.getTableId(ctx)
  const inputs = ctx.request.body
  const isUserTable = tableId === InternalTables.USER_METADATA
  let oldRow
  const dbTable = await sdk.tables.getTable(tableId)
  try {
    oldRow = await outputProcessing(
      dbTable,
      await utils.findRow(ctx, tableId, inputs._id!)
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

  // need to build up full patch fields before coerce
  let combinedRow: any = cloneDeep(oldRow)
  for (let key of Object.keys(inputs)) {
    if (!dbTable.schema[key]) continue
    combinedRow[key] = inputs[key]
  }

  // need to copy the table so it can be differenced on way out
  const tableClone = cloneDeep(dbTable)

  // this returns the table and row incase they have been updated
  let { table, row } = await inputProcessing(
    ctx.user?._id,
    tableClone,
    combinedRow
  )
  const validateResult = await sdk.rows.utils.validate({
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
    ctx.request.body = row as any
    await userController.updateMetadata(ctx)
    return { row: ctx.body as Row, table }
  }

  return finaliseRow(table, row, {
    oldTable: dbTable,
    updateFormula: true,
  })
}

export async function save(ctx: UserCtx) {
  let inputs = ctx.request.body
  inputs.tableId = utils.getTableId(ctx)

  if (!inputs._rev && !inputs._id) {
    inputs._id = generateRowID(inputs.tableId)
  }

  // this returns the table and row incase they have been updated
  const dbTable = await sdk.tables.getTable(inputs.tableId)

  // need to copy the table so it can be differenced on way out
  const tableClone = cloneDeep(dbTable)

  let { table, row } = await inputProcessing(ctx.user?._id, tableClone, inputs)

  const validateResult = await sdk.rows.utils.validate({
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

export async function find(ctx: UserCtx): Promise<Row> {
  const tableId = utils.getTableId(ctx),
    rowId = ctx.params.rowId
  const table = await sdk.tables.getTable(tableId)
  let row = await utils.findRow(ctx, tableId, rowId)
  row = await outputProcessing(table, row)
  return row
}

export async function destroy(ctx: UserCtx) {
  const db = context.getAppDB()
  const tableId = utils.getTableId(ctx)
  const { _id } = ctx.request.body
  let row = await db.get<Row>(_id)
  let _rev = ctx.request.body._rev || row._rev

  if (row.tableId !== tableId) {
    throw "Supplied tableId doesn't match the row's tableId"
  }
  const table = await sdk.tables.getTable(tableId)
  // update the row to include full relationships before deleting them
  row = await outputProcessing(table, row, {
    squash: false,
    skipBBReferences: true,
  })
  // now remove the relationships
  await linkRows.updateLinks({
    eventType: linkRows.EventType.ROW_DELETE,
    row,
    tableId,
  })
  // remove any attachments that were on the row from object storage
  await cleanupAttachments(table, { row })
  // remove any static formula
  await updateRelatedFormula(table, row)

  let response
  if (tableId === InternalTables.USER_METADATA) {
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
  const tableId = utils.getTableId(ctx)
  const table = await sdk.tables.getTable(tableId)
  let { rows } = ctx.request.body

  // before carrying out any updates, make sure the rows are ready to be returned
  // they need to be the full rows (including previous relationships) for automations
  const processedRows = (await outputProcessing(table, rows, {
    squash: false,
    skipBBReferences: true,
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
    const db = context.getAppDB()
    await db.bulkDocs(processedRows.map(row => ({ ...row, _deleted: true })))
  }
  // remove any attachments that were on the rows from object storage
  await cleanupAttachments(table, { rows: processedRows })
  await updateRelatedFormula(table, processedRows)
  await Promise.all(updates)
  return { response: { ok: true }, rows: processedRows }
}

export async function fetchEnrichedRow(ctx: UserCtx) {
  const fieldName = ctx.request.query.field as string | undefined
  const db = context.getAppDB()
  const tableId = utils.getTableId(ctx)
  const rowId = ctx.params.rowId as string
  // need table to work out where links go in row, as well as the link docs
  let response = await Promise.all([
    sdk.tables.getTable(tableId),
    utils.findRow(ctx, tableId, rowId),
    linkRows.getLinkDocuments({ tableId, rowId, fieldName }),
  ])
  const table = response[0] as Table
  const row = response[1] as Row
  const linkVals = response[2] as LinkDocumentValue[]
  // look up the actual rows based on the ids
  const params = getMultiIDParams(linkVals.map(linkVal => linkVal.id))
  let linkedRows = (await db.allDocs(params)).rows.map(row => row.doc)

  // get the linked tables
  const linkTableIds = getLinkedTableIDs(table as Table)
  const linkTables = await sdk.tables.getTables(linkTableIds)

  // perform output processing
  let final: Promise<Row[]>[] = []
  for (let linkTable of linkTables) {
    const relatedRows = linkedRows.filter(row => row.tableId === linkTable._id)
    // include the row being enriched for performance reasons, don't need to fetch it to include
    final = final.concat(
      outputProcessing(linkTable, relatedRows, {
        // have to clone to avoid JSON cycle
        fromRow: cloneDeep(row),
        squash: true,
      })
    )
  }
  // finalise the promises
  linkedRows = flatten(await Promise.all(final))

  // insert the link rows in the correct place throughout the main row
  for (let fieldName of Object.keys(table.schema)) {
    let field = table.schema[fieldName]
    if (field.type === FieldTypes.LINK) {
      // find the links that pertain to this field
      const links = linkVals.filter(link => link.fieldName === fieldName)
      // find the rows that the links state are linked to this field
      row[fieldName] = linkedRows.filter(linkRow =>
        links.find(link => link.id === linkRow._id)
      )
    }
  }
  return row
}
