const CouchDB = require("../../../db")
const viewTemplate = require("./viewBuilder")
const fs = require("fs")
const path = require("path")
const os = require("os")
const exporters = require("./exporters")

const controller = {
  fetch: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
    const designDoc = await db.get("_design/database")
    const response = []

    for (let name in designDoc.views) {
      if (
        !name.startsWith("all") &&
        name !== "by_type" &&
        name !== "by_username" &&
        name !== "by_automation_trigger"
      ) {
        response.push({
          name,
          ...designDoc.views[name],
        })
      }
    }

    ctx.body = response
  },
  save: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
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

    // add views to model document
    const model = await db.get(ctx.request.body.modelId)
    if (!model.views) model.views = {}
    if (!view.meta.schema) {
      view.meta.schema = model.schema
    }
    model.views[viewToSave.name] = view.meta

    if (originalName) {
      delete model.views[originalName]
    }

    await db.put(model)

    ctx.body = model.views[viewToSave.name]
    ctx.message = `View ${viewToSave.name} saved successfully.`
  },
  destroy: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
    const designDoc = await db.get("_design/database")

    const viewName = decodeURI(ctx.params.viewName)

    const view = designDoc.views[viewName]

    delete designDoc.views[viewName]

    await db.put(designDoc)

    const model = await db.get(view.meta.modelId)
    delete model.views[viewName]
    await db.put(model)

    ctx.body = view
    ctx.message = `View ${ctx.params.viewName} saved successfully.`
  },
  exportView: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
    const view = ctx.request.body
    const format = ctx.query.format

    // fetch records for the view
    const response = await db.query(`database/${view.name}`, {
      include_docs: !view.calculation,
      group: view.groupBy,
    })

    if (view.calculation === "stats") {
      response.rows = response.rows.map(row => ({
        group: row.key,
        field: view.field,
        ...row.value,
        avg: row.value.sum / row.value.count,
      }))
    } else {
      response.rows = response.rows.map(row => row.doc)
    }

    let headers = Object.keys(view.schema)

    const exporter = exporters[format]
    const exportedFile = exporter(headers, response.rows)

    const filename = `${view.name}.${format}`

    fs.writeFileSync(path.join(os.tmpdir(), filename), exportedFile)

    ctx.body = {
      url: `/api/views/export/download/${filename}`,
      name: view.name,
    }
  },
  downloadExport: async ctx => {
    const filename = ctx.params.fileName

    ctx.attachment(filename)
    ctx.body = fs.createReadStream(path.join(os.tmpdir(), filename))
  },
}

module.exports = controller
