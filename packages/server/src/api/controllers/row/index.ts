import stream from "stream"
import archiver from "archiver"

import { quotas } from "@budibase/pro"
import { objectStore, context } from "@budibase/backend-core"
import * as internal from "./internal"
import * as external from "./external"
import { isExternalTableID } from "../../../integrations/utils"
import {
  Ctx,
  DeleteRow,
  DeleteRowRequest,
  DeleteRows,
  DownloadAttachmentResponse,
  EventType,
  ExportRowsRequest,
  ExportRowsResponse,
  FetchEnrichedRowResponse,
  FetchRowsResponse,
  FieldType,
  FindRowResponse,
  isRelationshipField,
  PatchRowRequest,
  PatchRowResponse,
  RequiredKeys,
  Row,
  RowAttachment,
  RowSearchParams,
  SaveRowRequest,
  SaveRowResponse,
  SearchFilters,
  SearchRowRequest,
  SearchRowResponse,
  Table,
  UserCtx,
  ValidateRowRequest,
  ValidateRowResponse,
} from "@budibase/types"
import * as utils from "./utils"
import { gridSocket } from "../../../websockets"
import { addRev } from "../public/utils"
import { fixRow } from "../public/rows"
import sdk from "../../../sdk"
import * as exporters from "../view/exporters"
import { Format } from "../view/exporters"
import { apiFileReturn } from "../../../utilities/fileSystem"
import { dataFilters } from "@budibase/shared-core"

export * as views from "./views"

function pickApi(tableId: string) {
  if (isExternalTableID(tableId)) {
    return external
  }
  return internal
}

export async function patch(
  ctx: UserCtx<PatchRowRequest, PatchRowResponse>
): Promise<any> {
  const appId = ctx.appId
  const { tableId } = utils.getSourceId(ctx)
  const body = ctx.request.body

  // if it doesn't have an _id then its save
  if (body && !body._id) {
    return save(ctx)
  }
  try {
    const { row, table, oldRow } = await pickApi(tableId).patch(ctx)
    if (!row) {
      ctx.throw(404, "Row not found")
    }

    ctx.eventEmitter?.emitRow({
      eventName: EventType.ROW_UPDATE,
      appId,
      row,
      table,
      oldRow,
      user: sdk.users.getUserContextBindings(ctx.user),
    })
    ctx.message = `${table.name} updated successfully.`
    ctx.body = row
    gridSocket?.emitRowUpdate(ctx, row)
  } catch (err: any) {
    ctx.throw(400, err)
  }
}

export const save = async (ctx: UserCtx<SaveRowRequest, SaveRowResponse>) => {
  const { tableId, viewId } = utils.getSourceId(ctx)
  const sourceId = viewId || tableId

  const appId = ctx.appId
  const body = ctx.request.body

  // user metadata doesn't exist yet - don't allow creation
  if (utils.isUserMetadataTable(tableId) && !body._rev) {
    ctx.throw(400, "Cannot create new user entry.")
  }

  // if it has an ID already then its a patch
  if (body && body._id) {
    return patch(ctx as UserCtx<PatchRowRequest, PatchRowResponse>)
  }
  const { row, table, squashed } = tableId.includes("datasource_plus")
    ? await sdk.rows.save(sourceId, ctx.request.body, ctx.user?._id)
    : await quotas.addRow(() =>
        sdk.rows.save(sourceId, ctx.request.body, ctx.user?._id)
      )

  ctx.eventEmitter?.emitRow({
    eventName: EventType.ROW_SAVE,
    appId,
    row,
    table,
    user: sdk.users.getUserContextBindings(ctx.user),
  })
  ctx.message = `${table.name} saved successfully`
  // prefer squashed for response
  ctx.body = row || squashed
  gridSocket?.emitRowUpdate(ctx, row || squashed)
}

export async function fetchLegacyView(ctx: any) {
  const viewName = decodeURIComponent(ctx.params.viewName)

  const { calculation, group, field } = ctx.query

  ctx.body = await sdk.rows.fetchLegacyView(viewName, {
    calculation,
    group: calculation ? group : null,
    field,
  })
}

export async function fetch(ctx: UserCtx<void, FetchRowsResponse>) {
  const { tableId } = utils.getSourceId(ctx)
  ctx.body = await sdk.rows.fetch(tableId)
}

export async function find(ctx: UserCtx<void, FindRowResponse>) {
  const { tableId, viewId } = utils.getSourceId(ctx)
  const sourceId = viewId || tableId
  const rowId = ctx.params.rowId

  const response = await sdk.rows.find(sourceId, rowId)
  ctx.body = response
}

function isDeleteRows(input: any): input is DeleteRows {
  return input.rows !== undefined && Array.isArray(input.rows)
}

function isDeleteRow(input: any): input is DeleteRow {
  return input._id !== undefined
}

async function processDeleteRowsRequest(ctx: UserCtx<DeleteRowRequest>) {
  let request = ctx.request.body as DeleteRows
  const { tableId } = utils.getSourceId(ctx)

  const processedRows = request.rows.map(row => {
    let processedRow: Row = typeof row == "string" ? { _id: row, tableId } : row
    return !processedRow._rev
      ? addRev(fixRow(processedRow, ctx.params), tableId)
      : fixRow(processedRow, ctx.params)
  })

  const responses = await Promise.allSettled(processedRows)
  return responses
    .filter(resp => resp.status === "fulfilled")
    .map(resp => (resp as PromiseFulfilledResult<Row>).value)
}

async function deleteRows(ctx: UserCtx<DeleteRowRequest>) {
  const { tableId } = utils.getSourceId(ctx)
  const appId = ctx.appId

  let deleteRequest = ctx.request.body as DeleteRows

  deleteRequest.rows = await processDeleteRowsRequest(ctx)

  const { rows } = await pickApi(tableId).bulkDestroy(ctx)
  if (!tableId.includes("datasource_plus")) {
    await quotas.removeRows(rows.length)
  }

  for (let row of rows) {
    ctx.eventEmitter?.emitRow({
      eventName: EventType.ROW_DELETE,
      appId,
      row,
      user: sdk.users.getUserContextBindings(ctx.user),
    })
    gridSocket?.emitRowDeletion(ctx, row)
  }
  return rows
}

async function deleteRow(ctx: UserCtx<DeleteRowRequest>) {
  const appId = ctx.appId
  const { tableId } = utils.getSourceId(ctx)

  const resp = await pickApi(tableId).destroy(ctx)
  if (!tableId.includes("datasource_plus")) {
    await quotas.removeRow()
  }

  ctx.eventEmitter?.emitRow({
    eventName: EventType.ROW_DELETE,
    appId,
    row: resp.row,
    user: sdk.users.getUserContextBindings(ctx.user),
  })
  gridSocket?.emitRowDeletion(ctx, resp.row)

  return resp
}

export async function destroy(ctx: UserCtx<DeleteRowRequest>) {
  let response, row

  if (isDeleteRows(ctx.request.body)) {
    response = await deleteRows(ctx)
  } else if (isDeleteRow(ctx.request.body)) {
    const deleteResp = await deleteRow(ctx)
    response = deleteResp.response
    row = deleteResp.row
  } else {
    ctx.status = 400
    response = { message: "Invalid delete rows request" }
  }

  // for automations include the row that was deleted
  ctx.row = row || {}
  ctx.body = response
}

export async function search(ctx: Ctx<SearchRowRequest, SearchRowResponse>) {
  const { tableId, viewId } = utils.getSourceId(ctx)

  await context.ensureSnippetContext(true)

  const searchRequest = ctx.request.body
  let { query } = searchRequest
  if (query) {
    const allTables = await sdk.tables.getAllTables()
    query = replaceTableNamesInFilters(tableId, query, allTables)
  }

  let enrichedQuery: SearchFilters = await utils.enrichSearchContext(query, {
    user: sdk.users.getUserContextBindings(ctx.user),
  })

  const searchParams: RequiredKeys<RowSearchParams> = {
    query: enrichedQuery,
    tableId,
    viewId,
    bookmark: searchRequest.bookmark ?? undefined,
    paginate: searchRequest.paginate,
    limit: searchRequest.limit,
    sort: searchRequest.sort ?? undefined,
    sortOrder: searchRequest.sortOrder,
    sortType: searchRequest.sortType ?? undefined,
    countRows: searchRequest.countRows,
    version: searchRequest.version,
    disableEscaping: searchRequest.disableEscaping,
    fields: undefined,
    indexer: undefined,
    rows: undefined,
  }

  ctx.body = await sdk.rows.search(searchParams)
}

function replaceTableNamesInFilters(
  tableId: string,
  filters: SearchFilters,
  allTables: Table[]
): SearchFilters {
  for (const filter of Object.values(filters)) {
    for (const key of Object.keys(filter)) {
      const matches = key.match(`^(?<relation>.+)\\.(?<field>.+)`)

      // this is the possible table name which we need to check if it needs to be converted
      const relatedTableName = matches?.groups?.["relation"]
      const field = matches?.groups?.["field"]

      if (!relatedTableName || !field) {
        continue
      }

      const table = allTables.find(r => r._id === tableId)
      const isColumnName = !!table?.schema[relatedTableName]
      if (!table || isColumnName) {
        continue
      }

      const matchedTable = allTables.find(t => t.name === relatedTableName)
      const relationship = Object.values(table.schema).find(
        f => isRelationshipField(f) && f.tableId === matchedTable?._id
      )
      if (!relationship) {
        continue
      }

      const updatedField = `${relationship.name}.${field}`
      if (updatedField && updatedField !== key) {
        filter[updatedField] = filter[key]
        delete filter[key]
      }
    }
  }
  return dataFilters.recurseLogicalOperators(filters, (f: SearchFilters) => {
    return replaceTableNamesInFilters(tableId, f, allTables)
  })
}

export async function validate(
  ctx: Ctx<ValidateRowRequest, ValidateRowResponse>
) {
  const source = await utils.getSource(ctx)
  const table = await utils.getTableFromSource(source)
  // external tables are hard to validate currently
  if (isExternalTableID(table._id!)) {
    ctx.body = { valid: true, errors: {} }
  } else {
    ctx.body = await sdk.rows.utils.validate({
      row: ctx.request.body,
      source,
    })
  }
}

export async function fetchEnrichedRow(
  ctx: UserCtx<void, FetchEnrichedRowResponse>
) {
  const { tableId } = utils.getSourceId(ctx)
  ctx.body = await pickApi(tableId).fetchEnrichedRow(ctx)
}

export const exportRows = async (
  ctx: Ctx<ExportRowsRequest, ExportRowsResponse>
) => {
  const { tableId } = utils.getSourceId(ctx)

  const format = ctx.query.format

  const { rows, columns, query, sort, sortOrder, delimiter, customHeaders } =
    ctx.request.body
  if (typeof format !== "string" || !exporters.isFormat(format)) {
    ctx.throw(
      400,
      `Format ${format} not valid. Valid values: ${Object.values(
        exporters.Format
      )}`
    )
  }

  const { fileName, content } = await sdk.rows.exportRows({
    tableId,
    format: format as Format,
    rowIds: rows,
    columns,
    query,
    sort,
    sortOrder,
    delimiter,
    customHeaders,
  })
  ctx.attachment(fileName)
  ctx.body = apiFileReturn(content)
}

export async function downloadAttachment(
  ctx: UserCtx<void, DownloadAttachmentResponse>
) {
  const { columnName } = ctx.params

  const { tableId } = utils.getSourceId(ctx)
  const rowId = ctx.params.rowId
  const row = await sdk.rows.find(tableId, rowId)

  const table = await sdk.tables.getTable(tableId)
  const columnSchema = table.schema[columnName]
  if (!columnSchema) {
    ctx.throw(400, `'${columnName}' is not valid`)
  }

  const columnType = columnSchema.type

  if (
    columnType !== FieldType.ATTACHMENTS &&
    columnType !== FieldType.ATTACHMENT_SINGLE
  ) {
    ctx.throw(404, `'${columnName}' is not valid attachment column`)
  }

  const attachments: RowAttachment[] =
    columnType === FieldType.ATTACHMENTS ? row[columnName] : [row[columnName]]

  if (!attachments?.length) {
    ctx.throw(404)
  }

  if (attachments.length === 1) {
    const attachment = attachments[0]
    ctx.attachment(attachment.name)
    if (attachment.key) {
      ctx.body = await objectStore.getReadStream(
        objectStore.ObjectStoreBuckets.APPS,
        attachment.key
      )
    }
  } else {
    const passThrough = new stream.PassThrough()
    const archive = archiver.create("zip")
    archive.pipe(passThrough)

    for (const attachment of attachments) {
      if (!attachment.key) {
        continue
      }
      const attachmentStream = await objectStore.getReadStream(
        objectStore.ObjectStoreBuckets.APPS,
        attachment.key
      )
      archive.append(attachmentStream, { name: attachment.name })
    }

    const displayName = row[table.primaryDisplay || "_id"]
    ctx.attachment(`${displayName}_${columnName}.zip`)
    archive.finalize()
    ctx.body = passThrough
    ctx.type = "zip"
  }
}
