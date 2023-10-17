import { FieldTypes } from "../../../constants"
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
  Datasource,
  IncludeRelationship,
  Operation,
  PatchRowRequest,
  PatchRowResponse,
  Row,
  Table,
  UserCtx,
  EmptyFilterOption,
} from "@budibase/types"
import sdk from "../../../sdk"
import * as utils from "./utils"
import { dataFilters } from "@budibase/shared-core"
import {
  inputProcessing,
  outputProcessing,
} from "../../../utilities/rowProcessor"
import { cloneDeep, isEqual } from "lodash"

export async function handleRequest<T extends Operation>(
  operation: T,
  tableId: string,
  opts?: RunConfig
): Promise<ExternalRequestReturnType<T>> {
  // make sure the filters are cleaned up, no empty strings for equals, fuzzy or string
  if (opts && opts.filters) {
    opts.filters = sdk.rows.removeEmptyFilters(opts.filters)
  }
  if (
    !dataFilters.hasFilters(opts?.filters) &&
    opts?.filters?.onEmptyFilter === EmptyFilterOption.RETURN_NONE
  ) {
    return [] as any
  }

  return new ExternalRequest(operation, tableId, opts?.datasource).run(
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

  const response = await handleRequest(Operation.UPDATE, tableId, {
    id: breakRowIdField(_id),
    row: dataToUpdate,
  })
  const row = await sdk.rows.external.getRow(tableId, _id, {
    relationships: true,
  })
  const enrichedRow = await outputProcessing(table, row, {
    preserveLinks: true,
  })
  return {
    ...response,
    row: enrichedRow,
    table,
  }
}

export async function save(ctx: UserCtx) {
  const inputs = ctx.request.body
  const tableId = utils.getTableId(ctx)

  const table = await sdk.tables.getTable(tableId)
  const { table: updatedTable, row } = await inputProcessing(
    ctx.user?._id,
    cloneDeep(table),
    inputs
  )

  const validateResult = await sdk.rows.utils.validate({
    row,
    tableId,
  })
  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }

  const response = await handleRequest(Operation.CREATE, tableId, {
    row,
  })

  if (!isEqual(table, updatedTable)) {
    await sdk.tables.saveTable(updatedTable)
  }

  const rowId = response.row._id
  if (rowId) {
    const row = await sdk.rows.external.getRow(tableId, rowId, {
      relationships: true,
    })
    return {
      ...response,
      row: await outputProcessing(table, row, { preserveLinks: true }),
    }
  } else {
    return response
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
    squash: false,
    preserveLinks: true,
  })
}

export async function destroy(ctx: UserCtx) {
  const tableId = utils.getTableId(ctx)
  const _id = ctx.request.body._id
  const { row } = (await handleRequest(Operation.DELETE, tableId, {
    id: breakRowIdField(_id),
    includeSqlRelationships: IncludeRelationship.EXCLUDE,
  })) as { row: Row }
  return { response: { ok: true, id: _id }, row }
}

export async function bulkDestroy(ctx: UserCtx) {
  const { rows } = ctx.request.body
  const tableId = utils.getTableId(ctx)
  let promises: Promise<Row[] | { row: Row; table: Table }>[] = []
  for (let row of rows) {
    promises.push(
      handleRequest(Operation.DELETE, tableId, {
        id: breakRowIdField(row._id),
        includeSqlRelationships: IncludeRelationship.EXCLUDE,
      })
    )
  }
  const responses = (await Promise.all(promises)) as { row: Row }[]
  return { response: { ok: true }, rows: responses.map(resp => resp.row) }
}

export async function fetchEnrichedRow(ctx: UserCtx) {
  const id = ctx.params.rowId
  const tableId = utils.getTableId(ctx)
  const { datasourceId, tableName } = breakExternalTableId(tableId)
  const datasource: Datasource = await sdk.datasources.get(datasourceId!)
  if (!tableName) {
    ctx.throw(400, "Unable to find table.")
  }
  if (!datasource || !datasource.entities) {
    ctx.throw(400, "Datasource has not been configured for plus API.")
  }
  const tables = datasource.entities
  const response = (await handleRequest(Operation.READ, tableId, {
    id,
    datasource,
    includeSqlRelationships: IncludeRelationship.INCLUDE,
  })) as Row[]
  const table: Table = tables[tableName]
  const row = response[0]
  // this seems like a lot of work, but basically we need to dig deeper for the enrich
  // for a single row, there is probably a better way to do this with some smart multi-layer joins
  for (let [fieldName, field] of Object.entries(table.schema)) {
    if (
      field.type !== FieldTypes.LINK ||
      !row[fieldName] ||
      row[fieldName].length === 0
    ) {
      continue
    }
    const links = row[fieldName]
    const linkedTableId = field.tableId
    const linkedTableName = breakExternalTableId(linkedTableId).tableName!
    const linkedTable = tables[linkedTableName]
    // don't support composite keys right now
    const linkedIds = links.map((link: Row) => breakRowIdField(link._id!)[0])
    const primaryLink = linkedTable.primary?.[0] as string
    row[fieldName] = await handleRequest(Operation.READ, linkedTableId!, {
      tables,
      filters: {
        oneOf: {
          [primaryLink]: linkedIds,
        },
      },
      includeSqlRelationships: IncludeRelationship.INCLUDE,
    })
  }
  return row
}
