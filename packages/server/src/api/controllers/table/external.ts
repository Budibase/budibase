import { breakExternalTableId } from "../../../integrations/utils"
import { handleRequest } from "../row/external"
import { events } from "@budibase/backend-core"
import { isRows, isSchema, parse } from "../../../utilities/schema"
import {
  BulkImportRequest,
  BulkImportResponse,
  Operation,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { builderSocket } from "../../../websockets"

function getDatasourceId(table: Table) {
  if (!table) {
    throw "No table supplied"
  }
  if (table.sourceId) {
    return table.sourceId
  }
  return breakExternalTableId(table._id).datasourceId
}

export async function save(ctx: UserCtx<SaveTableRequest, SaveTableResponse>) {
  const inputs = ctx.request.body
  const renaming = inputs?._rename
  // can't do this right now
  delete inputs.rows
  const tableId = ctx.request.body._id
  const datasourceId = getDatasourceId(ctx.request.body)
  // table doesn't exist already, note that it is created
  if (!inputs._id) {
    inputs.created = true
  }
  try {
    const { datasource, table } = await sdk.tables.external.save(
      datasourceId!,
      inputs,
      { tableId, renaming }
    )
    builderSocket?.emitDatasourceUpdate(ctx, datasource)
    return table
  } catch (err: any) {
    if (err instanceof Error) {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(err.status || 500, err?.message || err)
    }
  }
}

export async function destroy(ctx: UserCtx) {
  const tableToDelete: TableRequest = await sdk.tables.getTable(
    ctx.params.tableId
  )
  if (!tableToDelete || !tableToDelete.created) {
    ctx.throw(400, "Cannot delete tables which weren't created in Budibase.")
  }
  const datasourceId = getDatasourceId(tableToDelete)
  try {
    const { datasource, table } = await sdk.tables.external.destroy(
      datasourceId!,
      tableToDelete
    )
    builderSocket?.emitDatasourceUpdate(ctx, datasource)
    return table
  } catch (err: any) {
    if (err instanceof Error) {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(err.status || 500, err.message || err)
    }
  }
}

export async function bulkImport(
  ctx: UserCtx<BulkImportRequest, BulkImportResponse>
) {
  const table = await sdk.tables.getTable(ctx.params.tableId)
  const { rows } = ctx.request.body
  const schema = table.schema

  if (!rows || !isRows(rows) || !isSchema(schema)) {
    ctx.throw(400, "Provided data import information is invalid.")
  }

  const parsedRows = parse(rows, schema)
  await handleRequest(Operation.BULK_CREATE, table._id!, {
    rows: parsedRows,
  })
  await events.rows.imported(table, parsedRows.length)
  return table
}
