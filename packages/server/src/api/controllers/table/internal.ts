import { context } from "@budibase/backend-core"
import { cloneDeep } from "lodash"
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
  const originalSchema = cloneDeep(table.schema)
  const { rows, identifierFields } = ctx.request.body
  await handleDataImport(table, {
    importRows: rows,
    identifierFields,
    userId: ctx.user._id,
  })
  return await sdk.projects.doWithProjectAssignmentsLockIfEnabled(async () => {
    const currentTable = await context.getWorkspaceDB().get<Table>(table._id!)
    let schemaChanged = false
    // Merge only import-added options into the latest table definition.
    for (const [name, importedColumn] of Object.entries(table.schema)) {
      const currentColumn = currentTable.schema[name]
      if (
        (importedColumn.type !== FieldType.OPTIONS &&
          importedColumn.type !== FieldType.ARRAY) ||
        currentColumn?.type !== importedColumn.type
      ) {
        continue
      }
      const originalValues = originalSchema[name].constraints?.inclusion || []
      const existingValues = currentColumn.constraints?.inclusion || []
      const addedValues = (importedColumn.constraints?.inclusion || []).filter(
        value =>
          !originalValues.includes(value) && !existingValues.includes(value)
      )
      if (addedValues.length) {
        currentColumn.constraints = {
          ...currentColumn.constraints,
          inclusion: [...new Set([...existingValues, ...addedValues])].sort(),
        }
        schemaChanged = true
      }
    }
    if (!schemaChanged) {
      return currentTable
    }
    const { table: savedTable } = await sdk.tables.internal.save(currentTable, {
      tableId: currentTable._id,
      userId: ctx.user._id,
    })
    return savedTable
  })
}
