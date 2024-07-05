import {
  breakExternalTableId,
  breakRowIdField,
} from "../../../integrations/utils"
import {
  ExternalRequest,
  ExternalRequestReturnType,
  RunConfig,
} from "./ExternalRequest"
import {
  FieldType,
  Datasource,
  IncludeRelationship,
  Operation,
  PatchRowRequest,
  PatchRowResponse,
  Row,
  Table,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import * as utils from "./utils"
import {
  inputProcessing,
  outputProcessing,
} from "../../../utilities/rowProcessor"
import { cloneDeep } from "lodash"
import { generateIdForRow } from "./utils"

export async function handleRequest<T extends Operation>(
  operation: T,
  tableId: string,
  opts?: RunConfig
): Promise<ExternalRequestReturnType<T>> {
  return new ExternalRequest<T>(operation, tableId, opts?.datasource).run(
    opts || {}
  )
}

export async function patch(ctx: UserCtx<PatchRowRequest, PatchRowResponse>) {
  const tableId = utils.getTableId(ctx)

  const { _id, ...rowData } = ctx.request.body
  const table = await sdk.tables.getTable(tableId)

  const { row: dataToUpdate } = await inputProcessing(
    ctx.user?._id,
    cloneDeep(table),
    rowData
  )

  const validateResult = await sdk.rows.utils.validate({
    row: dataToUpdate,
    tableId,
  })
  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }

  const beforeRow = await sdk.rows.external.getRow(tableId, _id, {
    relationships: true,
  })

  const response = await handleRequest(Operation.UPDATE, tableId, {
    id: breakRowIdField(_id),
    row: dataToUpdate,
  })

  // The id might have been changed, so the refetching would fail. Recalculating the id just in case
  const updatedId =
    generateIdForRow({ ...beforeRow, ...dataToUpdate }, table) || _id
  const row = await sdk.rows.external.getRow(tableId, updatedId, {
    relationships: true,
  })

  const [enrichedRow, oldRow] = await Promise.all([
    outputProcessing(table, row, {
      squash: true,
      preserveLinks: true,
    }),
    outputProcessing(table, beforeRow, {
      squash: true,
      preserveLinks: true,
    }),
  ])

  return {
    ...response,
    row: enrichedRow,
    table,
    oldRow,
  }
}

export async function find(ctx: UserCtx): Promise<Row> {
  const id = ctx.params.rowId
  const tableId = utils.getTableId(ctx)
  const row = await sdk.rows.external.getRow(tableId, id, {
    relationships: true,
  })

  if (!row) {
    ctx.throw(404)
  }

  const table = await sdk.tables.getTable(tableId)
  // Preserving links, as the outputProcessing does not support external rows yet and we don't need it in this use case
  return await outputProcessing(table, row, {
    squash: true,
    preserveLinks: true,
  })
}

export async function destroy(ctx: UserCtx) {
  const tableId = utils.getTableId(ctx)
  const _id = ctx.request.body._id
  const { row } = await handleRequest(Operation.DELETE, tableId, {
    id: breakRowIdField(_id),
    includeSqlRelationships: IncludeRelationship.EXCLUDE,
  })
  return { response: { ok: true, id: _id }, row }
}

export async function bulkDestroy(ctx: UserCtx) {
  const { rows } = ctx.request.body
  const tableId = utils.getTableId(ctx)
  let promises: Promise<{ row: Row; table: Table }>[] = []
  for (let row of rows) {
    promises.push(
      handleRequest(Operation.DELETE, tableId, {
        id: breakRowIdField(row._id),
        includeSqlRelationships: IncludeRelationship.EXCLUDE,
      })
    )
  }
  const responses = await Promise.all(promises)
  const finalRows = responses
    .map(resp => resp.row)
    .filter(row => row && row._id)
  return { response: { ok: true }, rows: finalRows }
}

export async function fetchEnrichedRow(ctx: UserCtx) {
  const id = ctx.params.rowId
  const tableId = utils.getTableId(ctx)
  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const datasource: Datasource = await sdk.datasources.get(datasourceId)
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }
  const tables = datasource.entities
  const response = await handleRequest(Operation.READ, tableId, {
    id,
    datasource,
    includeSqlRelationships: IncludeRelationship.INCLUDE,
  })
  const table: Table = tables[tableName]
  const row = response[0]
  // this seems like a lot of work, but basically we need to dig deeper for the enrich
  // for a single row, there is probably a better way to do this with some smart multi-layer joins
  for (let [fieldName, field] of Object.entries(table.schema)) {
    if (
      field.type !== FieldType.LINK ||
      !row[fieldName] ||
      row[fieldName].length === 0
    ) {
      continue
    }
    const links = row[fieldName]
    const linkedTableId = field.tableId
    const linkedTableName = breakExternalTableId(linkedTableId).tableName
    const linkedTable = tables[linkedTableName]
    // don't support composite keys right now
    const linkedIds = links.map((link: Row) => breakRowIdField(link._id!)[0])
    const primaryLink = linkedTable.primary?.[0] as string
    const relatedRows = await handleRequest(Operation.READ, linkedTableId!, {
      tables,
      filters: {
        oneOf: {
          [primaryLink]: linkedIds,
        },
      },
      includeSqlRelationships: IncludeRelationship.INCLUDE,
    })
    row[fieldName] = await outputProcessing(linkedTable, relatedRows, {
      squash: true,
      preserveLinks: true,
    })
  }
  return row
}
