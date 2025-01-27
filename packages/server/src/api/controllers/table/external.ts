import { breakExternalTableId } from "../../../integrations/utils"
import { handleRequest } from "../row/external"
import { events } from "@budibase/backend-core"
import { isRows, isSchema, parse } from "../../../utilities/schema"
import {
  BulkImportRequest,
  BulkImportResponse,
  Operation,
  RenameColumn,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  TableRequest,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { builderSocket } from "../../../websockets"
import { inputProcessing } from "../../../utilities/rowProcessor"
import { isEqual } from "lodash"

function getDatasourceId(table: Table) {
  if (!table) {
    throw new Error("No table supplied")
  }
  if (table.sourceId) {
    return table.sourceId
  }
  if (!table._id) {
    throw new Error("No table ID supplied")
  }
  return breakExternalTableId(table._id).datasourceId
}

export async function updateTable(
  ctx: UserCtx<SaveTableRequest, SaveTableResponse>,
  renaming?: RenameColumn
) {
  const inputs = ctx.request.body
  // can't do this right now
  delete inputs.rows
  const tableId = ctx.request.body._id
  const datasourceId = getDatasourceId(ctx.request.body)
  // table doesn't exist already, note that it is created
  if (!inputs._id) {
    inputs.created = true
  }
  try {
    const { datasource, oldTable, table } = await sdk.tables.external.save(
      datasourceId!,
      inputs,
      { tableId, renaming }
    )
    builderSocket?.emitDatasourceUpdate(ctx, datasource)
    return { table, oldTable }
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
  let table = await sdk.tables.getTable(ctx.params.tableId)
  const { rows, identifierFields } = ctx.request.body
  const schema = table.schema

  if (
    identifierFields &&
    identifierFields.length > 0 &&
    !isEqual(identifierFields, table.primary)
  ) {
    // This is becuse we make use of the ON CONFLICT functionality in SQL
    // databases, which only triggers when there's a conflict against a unique
    // index. The only unique index we can count on atm in Budibase is the
    // primary key, so this functionality always uses the primary key.
    ctx.throw(
      400,
      "Identifier fields are not supported for bulk import into an external datasource."
    )
  }

  if (!rows || !isRows(rows) || !isSchema(schema)) {
    ctx.throw(400, "Provided data import information is invalid.")
  }

  const parsedRows = []
  for (const row of parse(rows, table)) {
    const processed = await inputProcessing(ctx.user?._id, table, row, {
      noAutoRelationships: true,
    })
    parsedRows.push(processed)
  }

  await handleRequest(Operation.BULK_UPSERT, table, {
    rows: parsedRows,
  })
  await events.rows.imported(table, parsedRows.length)
  return table
}
