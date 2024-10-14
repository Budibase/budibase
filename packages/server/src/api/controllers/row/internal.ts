import * as linkRows from "../../../db/linkedRows"
import { InternalTables } from "../../../db/utils"
import * as userController from "../user"
import {
  AttachmentCleanup,
  inputProcessing,
  outputProcessing,
} from "../../../utilities/rowProcessor"
import * as utils from "./utils"
import { cloneDeep } from "lodash/fp"
import { context, HTTPError } from "@budibase/backend-core"
import { finaliseRow, updateRelatedFormula } from "./staticFormula"
import {
  FieldType,
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
import { findRow } from "../../../sdk/app/rows/internal"
import { helpers } from "@budibase/shared-core"

export async function patch(ctx: UserCtx<PatchRowRequest, PatchRowResponse>) {
  const { tableId } = utils.getSourceId(ctx)
  const source = await utils.getSource(ctx)

  if (sdk.views.isView(source) && helpers.views.isCalculationView(source)) {
    ctx.throw(400, "Cannot update rows through a calculation view")
  }

  const table = sdk.views.isView(source)
    ? await sdk.views.getTable(source.id)
    : source

  const inputs = ctx.request.body
  const isUserTable = tableId === InternalTables.USER_METADATA
  let oldRow
  try {
    oldRow = await outputProcessing(source, await findRow(tableId, inputs._id!))
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
    if (!table.schema[key]) continue
    combinedRow[key] = inputs[key]
  }

  // this returns the table and row incase they have been updated
  let row = await inputProcessing(ctx.user?._id, source, combinedRow)
  const validateResult = await sdk.rows.utils.validate({
    row,
    source,
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
  await AttachmentCleanup.rowUpdate(table, { row, oldRow })

  if (isUserTable) {
    // the row has been updated, need to put it into the ctx
    ctx.request.body = row as any
    await userController.updateMetadata(ctx as any)
    return { row: ctx.body as Row, table, oldRow }
  }

  const result = await finaliseRow(source, row, {
    updateFormula: true,
  })

  return { ...result, oldRow }
}

export async function destroy(ctx: UserCtx) {
  const db = context.getAppDB()
  const source = await utils.getSource(ctx)

  if (sdk.views.isView(source) && helpers.views.isCalculationView(source)) {
    throw new HTTPError("Cannot delete rows through a calculation view", 400)
  }

  let table: Table
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
  } else {
    table = source
  }

  const { _id } = ctx.request.body
  let row = await db.get<Row>(_id)
  let _rev = ctx.request.body._rev || row._rev

  if (row.tableId !== table._id) {
    throw "Supplied tableId doesn't match the row's tableId"
  }
  // update the row to include full relationships before deleting them
  row = await outputProcessing(table, row, {
    squash: false,
    skipBBReferences: true,
  })
  // now remove the relationships
  await linkRows.updateLinks({
    eventType: linkRows.EventType.ROW_DELETE,
    row,
    tableId: table._id!,
  })
  // remove any attachments that were on the row from object storage
  await AttachmentCleanup.rowDelete(table, [row])
  // remove any static formula
  await updateRelatedFormula(table, row)

  let response
  if (table._id === InternalTables.USER_METADATA) {
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
  const { tableId } = utils.getSourceId(ctx)
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
  await AttachmentCleanup.rowDelete(table, processedRows)
  await updateRelatedFormula(table, processedRows)
  await Promise.all(updates)
  return { response: { ok: true }, rows: processedRows }
}

export async function fetchEnrichedRow(ctx: UserCtx) {
  const fieldName = ctx.request.query.field as string | undefined
  const db = context.getAppDB()
  const { tableId } = utils.getSourceId(ctx)
  const rowId = ctx.params.rowId as string
  // need table to work out where links go in row, as well as the link docs
  const [table, links] = await Promise.all([
    sdk.tables.getTable(tableId),
    linkRows.getLinkDocuments({ tableId, rowId, fieldName }),
  ])
  let row = await findRow(tableId, rowId)
  row = await outputProcessing(table, row)
  const linkVals = links as LinkDocumentValue[]

  // look up the actual rows based on the ids
  let linkedRows = await db.getMultiple<Row>(
    linkVals.map(linkVal => linkVal.id),
    { allowMissing: true }
  )

  // get the linked tables
  const linkTableIds = getLinkedTableIDs(table.schema)
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
    if (field.type === FieldType.LINK) {
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
