import viewTemplate from "./viewBuilder"
import { apiFileReturn } from "../../../utilities/fileSystem"
import * as exporters from "./exporters"
import { deleteView, getView, getViews, saveView } from "./utils"
import { fetchView } from "../row"
import { FieldTypes } from "../../../constants"
import { context, events } from "@budibase/backend-core"
import { DocumentType } from "../../../db/utils"
import sdk from "../../../sdk"
import {
  BBContext,
  Row,
  Table,
  TableExportFormat,
  TableSchema,
  View,
} from "@budibase/types"

const { cloneDeep, isEqual } = require("lodash")

export async function fetch(ctx: BBContext) {
  ctx.body = await getViews()
}

export async function save(ctx: BBContext) {
  const db = context.getAppDB()
  const { originalName, ...viewToSave } = ctx.request.body
  const view = viewTemplate(viewToSave)
  const viewName = viewToSave.name

  if (!viewName) {
    ctx.throw(400, "Cannot create view without a name")
  }

  await saveView(originalName, viewName, view)

  // add views to table document
  const existingTable = await db.get(ctx.request.body.tableId)
  const table = cloneDeep(existingTable)
  if (!table.views) table.views = {}
  if (!view.meta.schema) {
    view.meta.schema = table.schema
  }
  table.views[viewName] = view.meta
  if (originalName) {
    delete table.views[originalName]
    existingTable.views[viewName] = existingTable.views[originalName]
  }
  await db.put(table)
  await handleViewEvents(existingTable.views[viewName], table.views[viewName])

  ctx.body = {
    ...table.views[viewToSave.name],
    name: viewToSave.name,
  }
}

export async function calculationEvents(existingView: View, newView: View) {
  const existingCalculation = existingView && existingView.calculation
  const newCalculation = newView && newView.calculation

  if (existingCalculation && !newCalculation) {
    await events.view.calculationDeleted(existingView)
  }

  if (!existingCalculation && newCalculation) {
    await events.view.calculationCreated(newView)
  }

  if (
    existingCalculation &&
    newCalculation &&
    existingCalculation !== newCalculation
  ) {
    await events.view.calculationUpdated(newView)
  }
}

export async function filterEvents(existingView: View, newView: View) {
  const hasExistingFilters = !!(
    existingView &&
    existingView.filters &&
    existingView.filters.length
  )
  const hasNewFilters = !!(newView && newView.filters && newView.filters.length)

  if (hasExistingFilters && !hasNewFilters) {
    await events.view.filterDeleted(newView)
  }

  if (!hasExistingFilters && hasNewFilters) {
    await events.view.filterCreated(newView)
  }

  if (
    hasExistingFilters &&
    hasNewFilters &&
    !isEqual(existingView.filters, newView.filters)
  ) {
    await events.view.filterUpdated(newView)
  }
}

async function handleViewEvents(existingView: View, newView: View) {
  if (!existingView) {
    await events.view.created(newView)
  } else {
    await events.view.updated(newView)
  }
  await calculationEvents(existingView, newView)
  await filterEvents(existingView, newView)
}

export async function destroy(ctx: BBContext) {
  const db = context.getAppDB()
  const viewName = decodeURI(ctx.params.viewName)
  const view = await deleteView(viewName)
  const table = await db.get(view.meta.tableId)
  delete table.views[viewName]
  await db.put(table)
  await events.view.deleted(view)

  ctx.body = view
}

export async function exportView(ctx: BBContext) {
  const viewName = decodeURI(ctx.query.view as string)
  const view = await getView(viewName)

  const format = ctx.query.format as string
  if (!format || !Object.values(exporters.ExportFormats).includes(format)) {
    ctx.throw(400, "Format must be specified, either csv or json")
  }

  if (view) {
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

  await fetchView(ctx)
  let rows = ctx.body as Row[]

  let schema: TableSchema = view && view.meta && view.meta.schema
  const tableId = ctx.params.tableId || view.meta.tableId
  const table: Table = await sdk.tables.getTable(tableId)
  if (!schema) {
    schema = table.schema
  }

  // remove any relationships
  const relationships = Object.entries(schema)
    .filter(entry => entry[1].type === FieldTypes.LINK)
    .map(entry => entry[0])
  // iterate relationship columns and remove from and row and schema
  relationships.forEach(column => {
    rows.forEach(row => {
      delete row[column]
    })
    delete schema[column]
  })

  // make sure no "undefined" entries appear in the CSV
  if (format === exporters.ExportFormats.CSV) {
    const schemaKeys = Object.keys(schema)
    for (let key of schemaKeys) {
      for (let row of rows) {
        if (row[key] == null) {
          row[key] = ""
        }
      }
    }
  }

  // Export part
  let headers = Object.keys(schema)
  const exporter = format === "csv" ? exporters.csv : exporters.json
  const filename = `${viewName}.${format}`
  // send down the file
  ctx.attachment(filename)
  ctx.body = apiFileReturn(exporter(headers, rows))

  if (viewName.startsWith(DocumentType.TABLE)) {
    await events.table.exported(table, format as TableExportFormat)
  } else {
    await events.view.exported(table, format as TableExportFormat)
  }
}
