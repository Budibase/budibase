import { generateTableID } from "../../../db/utils"
import { handleDataImport } from "./utils"
import {
  BulkImportRequest,
  BulkImportResponse,
  RenameColumn,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableSourceType,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function updateTable(
  ctx: UserCtx<SaveTableRequest, SaveTableResponse>,
  renaming?: RenameColumn
) {
  const { _rename, rows, ...rest } = ctx.request.body
  let tableToSave: Table = {
    _id: generateTableID(),
    ...rest,
    // Ensure these fields are populated, even if not sent in the request
    type: rest.type || "table",
    sourceType: rest.sourceType || TableSourceType.INTERNAL,
  }

  if (!tableToSave.views) {
    tableToSave.views = {}
  }

  try {
    const { table, oldTable } = await sdk.tables.internal.save(tableToSave, {
      userId: ctx.user._id,
      rowsToImport: rows,
      tableId: ctx.request.body._id,
      renaming,
    })

    return { table, oldTable }
  } catch (err: any) {
    if (err instanceof Error) {
      ctx.throw(400, err.message)
    } else {
      ctx.throw(err.status || 500, err.message || err)
    }
  }
}

export async function destroy(ctx: UserCtx) {
  const tableToDelete = await sdk.tables.getTable(ctx.params.tableId)
  try {
    const { table } = await sdk.tables.internal.destroy(tableToDelete)
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
  const { rows, identifierFields } = ctx.request.body
  await handleDataImport(table, {
    importRows: rows,
    identifierFields,
    userId: ctx.user._id,
  })
  return table
}
