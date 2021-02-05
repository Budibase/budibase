const CouchDB = require("../../../db")
const viewTemplate = require("./viewBuilder")
const fs = require("fs")
const { join } = require("../../../utilities/centralPath")
const os = require("os")
const exporters = require("./exporters")
const { fetchView } = require("../row")
const { ViewNames } = require("../../../db/utils")

const controller = {
  fetch: async ctx => {
    const db = new CouchDB(ctx.user.appId)
    const designDoc = await db.get("_design/database")
    const response = []

    for (let name of Object.keys(designDoc.views)) {
      // Only return custom views, not built ins
      if (Object.values(ViewNames).indexOf(name) !== -1) {
        continue
      }
      response.push({
        name,
        ...designDoc.views[name],
      })
    }

    ctx.body = response
  },
  save: async ctx => {
    const db = new CouchDB(ctx.user.appId)
    const { originalName, ...viewToSave } = ctx.request.body

    const designDoc = await db.get("_design/database")

    const view = viewTemplate(viewToSave)

    designDoc.views = {
      ...designDoc.views,
      [viewToSave.name]: view,
    }

    // view has been renamed
    if (originalName) {
      delete designDoc.views[originalName]
    }

    await db.put(designDoc)

    // add views to table document
    const table = await db.get(ctx.request.body.tableId)
    if (!table.views) table.views = {}
    if (!view.meta.schema) {
      view.meta.schema = table.schema
    }
    table.views[viewToSave.name] = view.meta

    if (originalName) {
      delete table.views[originalName]
    }

    await db.put(table)

    ctx.body = table.views[viewToSave.name]
    ctx.message = `View ${viewToSave.name} saved successfully.`
  },
  destroy: async ctx => {
    const db = new CouchDB(ctx.user.appId)
    const designDoc = await db.get("_design/database")

    const viewName = decodeURI(ctx.params.viewName)

    const view = designDoc.views[viewName]

    delete designDoc.views[viewName]

    await db.put(designDoc)

    const table = await db.get(view.meta.tableId)
    delete table.views[viewName]
    await db.put(table)

    ctx.body = view
    ctx.message = `View ${ctx.params.viewName} saved successfully.`
  },
  exportView: async ctx => {
    const db = new CouchDB(ctx.user.appId)
    const designDoc = await db.get("_design/database")

    const viewName = decodeURI(ctx.query.view)

    const view = designDoc.views[viewName]
    const format = ctx.query.format

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
      ctx.params.viewName = viewName
    }

    await fetchView(ctx)

    let schema = view && view.meta && view.meta.schema
    if (!schema) {
      const tableId = ctx.params.tableId || view.meta.tableId
      const table = await db.get(tableId)
      schema = table.schema
    }

    // Export part
    let headers = Object.keys(schema)
    const exporter = exporters[format]
    const exportedFile = exporter(headers, ctx.body)
    const filename = `${viewName}.${format}`
    fs.writeFileSync(join(os.tmpdir(), filename), exportedFile)

    ctx.attachment(filename)
    ctx.body = fs.createReadStream(join(os.tmpdir(), filename))
  },
}

module.exports = controller
