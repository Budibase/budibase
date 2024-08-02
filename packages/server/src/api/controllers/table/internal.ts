import { generateTableID } from "../../../db/utils"
import { handleDataImport } from "./utils"
import {
  BulkImportRequest,
  BulkImportResponse,
  FieldType,
  RenameColumn,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableSourceType,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function save(
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

  const isImport = !!rows

  if (!tableToSave.views) {
    tableToSave.views = {}
  }

  try {
    const { table } = await sdk.tables.internal.save(tableToSave, {
      user: ctx.user,
      rowsToImport: rows,
      tableId: ctx.request.body._id,
      renaming,
      isImport,
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
  await handleDataImport(
    {
      ...table,
      schema: {
        _id: {
          name: "_id",
          type: FieldType.STRING,
        },
        ...table.schema,
      },
    },
    {
      importRows: rows,
      identifierFields,
      user: ctx.user,
    }
  )
  return table
}
