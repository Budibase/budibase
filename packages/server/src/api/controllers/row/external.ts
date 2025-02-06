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
  ViewV2,
} from "@budibase/types"
import sdk from "../../../sdk"
import * as utils from "./utils"
import {
  inputProcessing,
  outputProcessing,
} from "../../../utilities/rowProcessor"
import { cloneDeep } from "lodash"
import { generateIdForRow } from "./utils"
import { helpers } from "@budibase/shared-core"
import { HTTPError } from "@budibase/backend-core"

export async function handleRequest<T extends Operation>(
  operation: T,
  source: Table | ViewV2,
  opts?: RunConfig
): Promise<ExternalRequestReturnType<T>> {
  return (
    await ExternalRequest.for<T>(operation, source, {
      datasource: opts?.datasource,
    })
  ).run(opts || {})
}

export async function patch(ctx: UserCtx<PatchRowRequest, PatchRowResponse>) {
  const source = await utils.getSource(ctx)

  const { viewId, tableId } = utils.getSourceId(ctx)
  const sourceId = viewId || tableId

  if (sdk.views.isView(source) && helpers.views.isCalculationView(source)) {
    ctx.throw(400, "Cannot update rows through a calculation view")
  }

  const table = await utils.getTableFromSource(source)
  const { _id, ...rowData } = ctx.request.body

  const beforeRow = await sdk.rows.external.getRow(table._id!, _id, {
    relationships: true,
  })

  let dataToUpdate = cloneDeep(beforeRow)
  const allowedField = utils.getSourceFields(source)
  for (const key of Object.keys(rowData)) {
    if (!allowedField.includes(key)) continue

    dataToUpdate[key] = rowData[key]
  }

  dataToUpdate = await inputProcessing(
    ctx.user?._id,
    cloneDeep(source),
    dataToUpdate
  )

  const validateResult = await sdk.rows.utils.validate({
    row: dataToUpdate,
    source,
  })
  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }

  const response = await handleRequest(Operation.UPDATE, source, {
    id: breakRowIdField(_id),
    row: dataToUpdate,
  })

  // The id might have been changed, so the refetching would fail. Recalculating the id just in case
  const updatedId =
    generateIdForRow({ ...beforeRow, ...dataToUpdate }, table) || _id
  const row = await sdk.rows.external.getRow(sourceId, updatedId, {
    relationships: true,
  })

  const [enrichedRow, oldRow] = await Promise.all([
    outputProcessing(source, row, {
      squash: true,
      preserveLinks: true,
    }),
    outputProcessing(source, beforeRow, {
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

export async function destroy(ctx: UserCtx) {
  const source = await utils.getSource(ctx)

  if (sdk.views.isView(source) && helpers.views.isCalculationView(source)) {
    throw new HTTPError("Cannot delete rows through a calculation view", 400)
  }

  const _id = ctx.request.body._id
  const { row } = await handleRequest(Operation.DELETE, source, {
    id: breakRowIdField(_id),
    includeSqlRelationships: IncludeRelationship.EXCLUDE,
  })
  return { response: { ok: true, id: _id }, row }
}

export async function bulkDestroy(ctx: UserCtx) {
  const { rows } = ctx.request.body
  const source = await utils.getSource(ctx)
  let promises: Promise<{ row: Row; table: Table }>[] = []
  for (let row of rows) {
    promises.push(
      handleRequest(Operation.DELETE, source, {
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
  const source = await utils.getSource(ctx)
  const { tableId } = utils.getSourceId(ctx)
  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const datasource: Datasource = await sdk.datasources.get(datasourceId)
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }
  const tables = datasource.entities
  const response = await handleRequest(Operation.READ, source, {
    id,
    datasource,
    includeSqlRelationships: IncludeRelationship.INCLUDE,
  })
  const table: Table = tables[tableName]
  const row = response.rows[0]
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
    const relatedRows = await handleRequest(Operation.READ, linkedTable, {
      tables,
      filters: {
        oneOf: {
          [primaryLink]: linkedIds,
        },
      },
      includeSqlRelationships: IncludeRelationship.INCLUDE,
    })
    row[fieldName] = await outputProcessing(linkedTable, relatedRows.rows, {
      squash: true,
      preserveLinks: true,
    })
  }
  return row
}
