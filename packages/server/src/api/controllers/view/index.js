const viewTemplate = require("./viewBuilder")
const { apiFileReturn } = require("../../../utilities/fileSystem")
const exporters = require("./exporters")
const { saveView, getView, getViews, deleteView } = require("./utils")
const { fetchView } = require("../row")
const { FieldTypes } = require("../../../constants")
const { getAppDB } = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")
const { DocumentType } = require("../../../db/utils")
const { cloneDeep, isEqual } = require("lodash")
const sdk = require("../../../sdk")

exports.fetch = async ctx => {
  ctx.body = await getViews()
}

exports.save = async ctx => {
  const db = getAppDB()
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

const calculationEvents = async (existingView, newView) => {
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

const filterEvents = async (existingView, newView) => {
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

const handleViewEvents = async (existingView, newView) => {
  if (!existingView) {
    await events.view.created(newView)
  } else {
    await events.view.updated(newView)
  }
  await calculationEvents(existingView, newView)
  await filterEvents(existingView, newView)
}

exports.destroy = async ctx => {
  const db = getAppDB()
  const viewName = decodeURI(ctx.params.viewName)
  const view = await deleteView(viewName)
  const table = await db.get(view.meta.tableId)
  delete table.views[viewName]
  await db.put(table)
  await events.view.deleted(view)

  ctx.body = view
}

exports.exportView = async ctx => {
  const viewName = decodeURI(ctx.query.view)
  const view = await getView(viewName)

  const format = ctx.query.format
  if (!format || !Object.values(exporters.ExportFormats).includes(format)) {
    ctx.throw(400, "Format must be specified, either csv or json")
  }

  if (view) {
    ctx.params.viewName = viewName
    // Fetch view rows
    ctx.query = {
      group: view.meta.groupBy,
      calculation: view.meta.calculation,
      stats: !!view.meta.field,
      field: view.meta.field,
    }
  } else {
    // table all_ view
    /* istanbul ignore next */
    ctx.params.viewName = viewName
  }

  await fetchView(ctx)
  let rows = ctx.body

  let schema = view && view.meta && view.meta.schema
  const tableId = ctx.params.tableId || view.meta.tableId
  const table = await sdk.tables.getTable(tableId)
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
  const exporter = exporters[format]
  const filename = `${viewName}.${format}`
  // send down the file
  ctx.attachment(filename)
  ctx.body = apiFileReturn(exporter(headers, rows))

  if (viewName.startsWith(DocumentType.TABLE)) {
    await events.table.exported(table, format)
  } else {
    await events.view.exported(table, format)
  }
}
