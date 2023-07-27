import { FieldTypes, NoEmptyFilterStrings } from "../../../constants"
import {
  breakExternalTableId,
  breakRowIdField,
} from "../../../integrations/utils"
import { ExternalRequest, RunConfig } from "./ExternalRequest"
import {
  Datasource,
  IncludeRelationship,
  Operation,
  Row,
  Table,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import * as utils from "./utils"

async function getRow(
  tableId: string,
  rowId: string,
  opts?: { relationships?: boolean }
) {
  const response = (await handleRequest(Operation.READ, tableId, {
    id: breakRowIdField(rowId),
    includeSqlRelationships: opts?.relationships
      ? IncludeRelationship.INCLUDE
      : IncludeRelationship.EXCLUDE,
  })) as Row[]
  return response ? response[0] : response
}

export async function handleRequest(
  operation: Operation,
  tableId: string,
  opts?: RunConfig
) {
  // make sure the filters are cleaned up, no empty strings for equals, fuzzy or string
  if (opts && opts.filters) {
    for (let filterField of NoEmptyFilterStrings) {
      if (!opts.filters[filterField]) {
        continue
      }
      // @ts-ignore
      for (let [key, value] of Object.entries(opts.filters[filterField])) {
        if (!value || value === "") {
          // @ts-ignore
          delete opts.filters[filterField][key]
        }
      }
    }
  }

  return new ExternalRequest(operation, tableId, opts?.datasource).run(
    opts || {}
  )
}

export async function patch(ctx: UserCtx) {
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  const id = inputs._id
  // don't save the ID to db
  delete inputs._id
  const validateResult = await utils.validate({
    row: inputs,
    tableId,
  })
  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }
  const response = await handleRequest(Operation.UPDATE, tableId, {
    id: breakRowIdField(id),
    row: inputs,
  })
  const row = await getRow(tableId, id, { relationships: true })
  const table = await sdk.tables.getTable(tableId)
  return {
    ...response,
    row,
    table,
  }
}

export async function save(ctx: UserCtx) {
  const inputs = ctx.request.body
  const tableId = ctx.params.tableId
  const validateResult = await utils.validate({
    row: inputs,
    tableId,
  })
  if (!validateResult.valid) {
    throw { validation: validateResult.errors }
  }
  const response = await handleRequest(Operation.CREATE, tableId, {
    row: inputs,
  })
  const responseRow = response as { row: Row }
  const rowId = responseRow.row._id
  if (rowId) {
    const row = await getRow(tableId, rowId, { relationships: true })
    return {
      ...response,
      row,
    }
  } else {
    return response
  }
}

export async function find(ctx: UserCtx) {
  const id = ctx.params.rowId
  const tableId = ctx.params.tableId
  return getRow(tableId, id)
}

export async function destroy(ctx: UserCtx) {
  const tableId = ctx.params.tableId
  const id = ctx.request.body._id
  const { row } = (await handleRequest(Operation.DELETE, tableId, {
    id: breakRowIdField(id),
    includeSqlRelationships: IncludeRelationship.EXCLUDE,
  })) as { row: Row }
  return { response: { ok: true }, row }
}

export async function bulkDestroy(ctx: UserCtx) {
  const { rows } = ctx.request.body
  const tableId = ctx.params.tableId
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
  const tableId = ctx.params.tableId
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
