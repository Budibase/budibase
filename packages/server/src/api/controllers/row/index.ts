import { quotas } from "@budibase/pro"
import * as internal from "./internal"
import * as external from "./external"
import { isExternalTable } from "../../../integrations/utils"
import { Ctx, SearchResponse } from "@budibase/types"
import * as utils from "./utils"
import { gridSocket } from "../../../websockets"
import sdk from "../../../sdk"
import * as exporters from "../view/exporters"
import { apiFileReturn } from "../../../utilities/fileSystem"
import _ from "lodash"

function pickApi(tableId: any) {
  if (isExternalTable(tableId)) {
    return external
  }
  return internal
}

export async function patch(ctx: any): Promise<any> {
  const appId = ctx.appId
  const tableId = utils.getTableId(ctx)
  const body = ctx.request.body
  // if it doesn't have an _id then its save
  if (body && !body._id) {
    return save(ctx)
  }
  try {
    const { row, table } = await quotas.addQuery<any>(
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
  } catch (err) {
    ctx.throw(400, err)
  }
}

export const save = async (ctx: any) => {
  const appId = ctx.appId
  const tableId = utils.getTableId(ctx)
  const body = ctx.request.body
  // if it has an ID already then its a patch
  if (body && body._id) {
    return patch(ctx)
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
        group,
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

export async function find(ctx: any) {
  const tableId = utils.getTableId(ctx)
  ctx.body = await quotas.addQuery(() => pickApi(tableId).find(ctx), {
    datasourceId: tableId,
  })
}

export async function destroy(ctx: any) {
  const appId = ctx.appId
  const inputs = ctx.request.body
  const tableId = utils.getTableId(ctx)
  let response, row
  if (inputs.rows) {
    let { rows } = await quotas.addQuery<any>(
      () => pickApi(tableId).bulkDestroy(ctx),
      {
        datasourceId: tableId,
      }
    )
    await quotas.removeRows(rows.length)
    response = rows
    for (let row of rows) {
      ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:delete`, appId, row)
      gridSocket?.emitRowDeletion(ctx, row._id!)
    }
  } else {
    let resp = await quotas.addQuery<any>(() => pickApi(tableId).destroy(ctx), {
      datasourceId: tableId,
    })
    await quotas.removeRow()
    response = resp.response
    row = resp.row
    ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:delete`, appId, row)
    gridSocket?.emitRowDeletion(ctx, row._id!)
  }
  ctx.status = 200
  // for automations include the row that was deleted
  ctx.row = row || {}
  ctx.body = response
}

export async function search(ctx: any) {
  const tableId = utils.getTableId(ctx)

  const searchParams = {
    ...ctx.request.body,
    tableId,
  }

  ctx.status = 200
  ctx.body = await quotas.addQuery(() => sdk.rows.search(searchParams), {
    datasourceId: tableId,
  })
}

export async function searchView(ctx: Ctx<void, SearchResponse>) {
  const { viewId } = ctx.params

  const view = await sdk.views.get(viewId)
  if (!view) {
    ctx.throw(404, `View ${viewId} not found`)
  }

  ctx.status = 200
  let { rows } = await quotas.addQuery(
    () =>
      sdk.rows.search({
        tableId: view.tableId,
        query: view.query || {},
        sort: view.sort?.field,
        sortOrder: view.sort?.order,
        sortType: view.sort?.type,
      }),
    {
      datasourceId: view.tableId,
    }
  )

  const { columns } = view
  if (columns) {
    rows = rows.map(r => _.pick(r, columns))
  }

  ctx.body = { rows }
}

export async function validate(ctx: Ctx) {
  const tableId = utils.getTableId(ctx)
  // external tables are hard to validate currently
  if (isExternalTable(tableId)) {
    ctx.body = { valid: true }
  } else {
    ctx.body = await utils.validate({
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

export const exportRows = async (ctx: any) => {
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
