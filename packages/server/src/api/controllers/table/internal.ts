import { generateTableID } from "../../../db/utils"
import { handleDataImport } from "./utils"
import {
  BulkImportRequest,
  BulkImportResponse,
  RenameColumn,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function save(ctx: UserCtx<SaveTableRequest, SaveTableResponse>) {
  const { rows, ...rest } = ctx.request.body
  let tableToSave: Table & {
    _rename?: RenameColumn
  } = {
    type: "table",
    _id: generateTableID(),
    views: {},
    ...rest,
  }
  const renaming = tableToSave._rename
  delete tableToSave._rename

  try {
    const { table } = await sdk.tables.internal.save(tableToSave, {
      user: ctx.user,
      rowsToImport: rows,
      tableId: ctx.request.body._id,
      renaming: renaming,
    })

    return table
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
    user: ctx.user,
  })
  return table
}
