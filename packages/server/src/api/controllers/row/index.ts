import { quotas } from "@budibase/pro"
import * as internal from "./internal"
import * as external from "./external"
import { isExternalTable } from "../../../integrations/utils"
import {
  Ctx,
  UserCtx,
  DeleteRowRequest,
  DeleteRow,
  DeleteRows,
  Row,
  PatchRowRequest,
  PatchRowResponse,
  SearchRowResponse,
  SearchRowRequest,
  SearchParams,
  GetRowResponse,
  ValidateResponse,
  ExportRowsRequest,
  ExportRowsResponse,
} from "@budibase/types"
import * as utils from "./utils"
import { gridSocket } from "../../../websockets"
import { addRev } from "../public/utils"
import { fixRow } from "../public/rows"
import sdk from "../../../sdk"
import * as exporters from "../view/exporters"
import { apiFileReturn } from "../../../utilities/fileSystem"
export * as views from "./views"

function pickApi(tableId: any) {
  if (isExternalTable(tableId)) {
    return external
  }
  return internal
}

export async function patch(
  ctx: UserCtx<PatchRowRequest, PatchRowResponse>
): Promise<any> {
  const appId = ctx.appId
  const tableId = utils.getTableId(ctx)
  const body = ctx.request.body

  // if it doesn't have an _id then its save
  if (body && !body._id) {
    return save(ctx)
  }
  try {
    const { row, table } = await quotas.addQuery(
      () => pickApi(tableId).patch(ctx),
      {
        datasourceId: tableId,
      }
    )
    if (!row) {
      ctx.throw(404, "Row not found")
    }
    ctx.status = 200
    ctx.eventEmitter &&
      ctx.eventEmitter.emitRow(`row:update`, appId, row, table)
    ctx.message = `${table.name} updated successfully.`
    ctx.body = row
    gridSocket?.emitRowUpdate(ctx, row)
  } catch (err: any) {
    ctx.throw(400, err)
  }
}

export const save = async (ctx: UserCtx<Row, Row>) => {
  const appId = ctx.appId
  const tableId = utils.getTableId(ctx)
  const body = ctx.request.body

  // user metadata doesn't exist yet - don't allow creation
  if (utils.isUserMetadataTable(tableId) && !body._rev) {
    ctx.throw(400, "Cannot create new user entry.")
  }

  // if it has an ID already then its a patch
  if (body && body._id) {
    return patch(ctx as UserCtx<PatchRowRequest, PatchRowResponse>)
  }
  const { row, table, squashed } = await quotas.addRow(() =>
    quotas.addQuery(() => pickApi(tableId).save(ctx), {
      datasourceId: tableId,
    })
  )
  ctx.status = 200
  ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:save`, appId, row, table)
  ctx.message = `${table.name} saved successfully`
  // prefer squashed for response
  ctx.body = row || squashed
  gridSocket?.emitRowUpdate(ctx, row || squashed)
}

export async function fetchView(ctx: any) {
  const tableId = utils.getTableId(ctx)
  const viewName = decodeURIComponent(ctx.params.viewName)

  const { calculation, group, field } = ctx.query

  ctx.body = await quotas.addQuery(
    () =>
      sdk.rows.fetchView(tableId, viewName, {
        calculation,
        group: calculation ? group : null,
        field,
      }),
    {
      datasourceId: tableId,
    }
  )
}

export async function fetch(ctx: any) {
  const tableId = utils.getTableId(ctx)
  ctx.body = await quotas.addQuery(() => sdk.rows.fetch(tableId), {
    datasourceId: tableId,
  })
}

export async function find(ctx: UserCtx<void, GetRowResponse>) {
  const tableId = utils.getTableId(ctx)
  ctx.body = await quotas.addQuery(() => pickApi(tableId).find(ctx), {
    datasourceId: tableId,
  })
}

function isDeleteRows(input: any): input is DeleteRows {
  return input.rows !== undefined && Array.isArray(input.rows)
}

function isDeleteRow(input: any): input is DeleteRow {
  return input._id !== undefined
}

async function processDeleteRowsRequest(ctx: UserCtx<DeleteRowRequest>) {
  let request = ctx.request.body as DeleteRows
  const tableId = utils.getTableId(ctx)

  const processedRows = request.rows.map(row => {
    let processedRow: Row = typeof row == "string" ? { _id: row } : row
    return !processedRow._rev
      ? addRev(fixRow(processedRow, ctx.params), tableId)
      : fixRow(processedRow, ctx.params)
  })

  return await Promise.all(processedRows)
}

async function deleteRows(ctx: UserCtx<DeleteRowRequest>) {
  const tableId = utils.getTableId(ctx)
  const appId = ctx.appId

  let deleteRequest = ctx.request.body as DeleteRows

  const rowDeletes: Row[] = await processDeleteRowsRequest(ctx)
  deleteRequest.rows = rowDeletes

  const { rows } = await quotas.addQuery(
    () => pickApi(tableId).bulkDestroy(ctx),
    {
      datasourceId: tableId,
    }
  )
  await quotas.removeRows(rows.length)

  for (let row of rows) {
    ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:delete`, appId, row)
    gridSocket?.emitRowDeletion(ctx, row)
  }

  return rows
}

async function deleteRow(ctx: UserCtx<DeleteRowRequest>) {
  const appId = ctx.appId
  const tableId = utils.getTableId(ctx)

  const resp = await quotas.addQuery(() => pickApi(tableId).destroy(ctx), {
    datasourceId: tableId,
  })
  await quotas.removeRow()

  ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:delete`, appId, resp.row)
  gridSocket?.emitRowDeletion(ctx, resp.row)

  return resp
}

export async function destroy(ctx: UserCtx<DeleteRowRequest>) {
  let response, row
  ctx.status = 200

  if (isDeleteRows(ctx.request.body)) {
    response = await deleteRows(ctx)
  } else if (isDeleteRow(ctx.request.body)) {
    const deleteResp = await deleteRow(ctx)
    response = deleteResp.response
    row = deleteResp.row
  } else {
    ctx.status = 400
    response = { message: "Invalid delete rows request" }
  }

  // for automations include the row that was deleted
  ctx.row = row || {}
  ctx.body = response
}

export async function search(ctx: Ctx<SearchRowRequest, SearchRowResponse>) {
  const tableId = utils.getTableId(ctx)

  const searchParams: SearchParams = {
    ...ctx.request.body,
    tableId,
  }

  ctx.status = 200
  ctx.body = await quotas.addQuery(() => sdk.rows.search(searchParams), {
    datasourceId: tableId,
  })
}

export async function validate(ctx: Ctx<Row, ValidateResponse>) {
  const tableId = utils.getTableId(ctx)
  // external tables are hard to validate currently
  if (isExternalTable(tableId)) {
    ctx.body = { valid: true, errors: {} }
  } else {
    ctx.body = await sdk.rows.utils.validate({
      row: ctx.request.body,
      tableId,
    })
  }
}

export async function fetchEnrichedRow(ctx: any) {
  const tableId = utils.getTableId(ctx)
  ctx.body = await quotas.addQuery(
    () => pickApi(tableId).fetchEnrichedRow(ctx),
    {
      datasourceId: tableId,
    }
  )
}

export const exportRows = async (
  ctx: Ctx<ExportRowsRequest, ExportRowsResponse>
) => {
  const tableId = utils.getTableId(ctx)

  const format = ctx.query.format

  const { rows, columns, query } = ctx.request.body
  if (typeof format !== "string" || !exporters.isFormat(format)) {
    ctx.throw(
      400,
      `Format ${format} not valid. Valid values: ${Object.values(
        exporters.Format
      )}`
    )
  }

  ctx.body = await quotas.addQuery(
    async () => {
      const { fileName, content } = await sdk.rows.exportRows({
        tableId,
        format,
        rowIds: rows,
        columns,
        query,
      })
      ctx.attachment(fileName)
      return apiFileReturn(content)
    },
    {
      datasourceId: tableId,
    }
  )
}
