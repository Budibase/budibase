import viewTemplate from "./viewBuilder"
import { apiFileReturn } from "../../../utilities/fileSystem"
import { csv, json, jsonWithSchema, Format, isFormat } from "./exporters"
import { deleteView, getView, getViews, saveView } from "./utils"
import { fetchLegacyView } from "../row"
import { context, events } from "@budibase/backend-core"
import sdk from "../../../sdk"
import {
  FieldType,
  Ctx,
  Row,
  Table,
  TableExportFormat,
  TableSchema,
  View,
  DocumentType,
} from "@budibase/types"
import { builderSocket } from "../../../websockets"

const cloneDeep = require("lodash/cloneDeep")

export async function fetch(ctx: Ctx) {
  ctx.body = await getViews()
}

export async function save(ctx: Ctx) {
  const db = context.getAppDB()
  const { originalName, ...viewToSave } = ctx.request.body

  const existingTable = await sdk.tables.getTable(ctx.request.body.tableId)
  existingTable.views ??= {}
  const table = cloneDeep(existingTable)

  const groupByField: any = Object.values(table.schema).find(
    (field: any) => field.name == viewToSave.groupBy
  )

  const view = viewTemplate(viewToSave, groupByField?.type === FieldType.ARRAY)
  const viewName = viewToSave.name

  if (!viewName) {
    ctx.throw(400, "Cannot create view without a name")
  }

  await saveView(originalName, viewName, view)

  // add views to table document
  if (!table.views) table.views = {}
  if (!view.meta?.schema) {
    view.meta = {
      ...view.meta!,
      schema: table.schema,
    }
  }
  table.views[viewName] = { ...view.meta, name: viewName }
  if (originalName) {
    delete table.views[originalName]
    existingTable.views[viewName] = existingTable.views[originalName]
  }
  await db.put(table)

  ctx.body = table.views[viewName]
  builderSocket?.emitTableUpdate(ctx, table)
}

export async function destroy(ctx: Ctx) {
  const db = context.getAppDB()
  const viewName = decodeURIComponent(ctx.params.viewName)
  const view = await deleteView(viewName)
  if (!view || !view.meta) {
    ctx.throw(400, "Unable to delete view - no metadata/view not found.")
  }
  const table = await sdk.tables.getTable(view.meta.tableId)
  delete table.views![viewName]
  await db.put(table)
  await events.view.deleted(view as View)

  ctx.body = view
  builderSocket?.emitTableUpdate(ctx, table)
}

export async function exportView(ctx: Ctx) {
  const viewName = decodeURIComponent(ctx.query.view as string)
  const view = await getView(viewName)

  const format = ctx.query.format as unknown

  if (!isFormat(format)) {
    ctx.throw(
      400,
      "Format must be specified, either csv, json or jsonWithSchema"
    )
  }

  if (view && view.meta) {
    ctx.params.viewName = viewName
    // Fetch view rows
    ctx.query = {
      group: view.meta.groupBy,
      calculation: view.meta.calculation,
      // @ts-ignore
      stats: !!view.meta.field,
      field: view.meta.field,
    }
  } else {
    // table all_ view
    /* istanbul ignore next */
    ctx.params.viewName = viewName
  }

  await fetchLegacyView(ctx)
  let rows = ctx.body as Row[]

  let schema: TableSchema = view && view.meta && view.meta.schema
  const tableId =
    ctx.params.tableId ||
    view?.meta?.tableId ||
    (viewName.startsWith(DocumentType.TABLE) && viewName)
  const table: Table = await sdk.tables.getTable(tableId)
  if (!schema) {
    schema = table.schema
  }

  let exportRows = sdk.rows.utils.cleanExportRows(rows, schema, format, [])

  if (format === Format.CSV) {
    ctx.attachment(`${viewName}.csv`)
    ctx.body = apiFileReturn(csv(Object.keys(schema), exportRows))
  } else if (format === Format.JSON) {
    ctx.attachment(`${viewName}.json`)
    ctx.body = apiFileReturn(json(exportRows))
  } else if (format === Format.JSON_WITH_SCHEMA) {
    ctx.attachment(`${viewName}.json`)
    ctx.body = apiFileReturn(jsonWithSchema(schema, exportRows))
  } else {
    throw "Format not recognised"
  }

  if (viewName.startsWith(DocumentType.TABLE)) {
    await events.table.exported(table, format as TableExportFormat)
  } else {
    await events.view.exported(table, format as TableExportFormat)
  }
}
