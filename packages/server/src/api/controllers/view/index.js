const CouchDB = require("../../../db")
const viewTemplate = require("./viewBuilder")
const { apiFileReturn } = require("../../../utilities/fileSystem")
const exporters = require("./exporters")
const { fetchView } = require("../row")
const {
  ViewNames,
  generateMemoryViewID,
  getMemoryViewParams,
} = require("../../../db/utils")
const env = require("../../../environment")

async function getView(db, viewName) {
  if (env.SELF_HOSTED) {
    const designDoc = await db.get("_design/database")
    return designDoc.views[viewName]
  } else {
    const viewDoc = await db.get(generateMemoryViewID(viewName))
    return viewDoc.view
  }
}

async function getViews(db) {
  const response = []
  if (env.SELF_HOSTED) {
    const designDoc = await db.get("_design/database")
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
  } else {
    const views = (
      await db.allDocs(
        getMemoryViewParams({
          include_docs: true,
        })
      )
    ).rows.map(row => row.doc)
    for (let viewDoc of views) {
      response.push({
        name: viewDoc.name,
        ...viewDoc.view,
      })
    }
  }
  return response
}

async function saveView(db, originalName, viewToSave, viewTemplate) {
  if (env.SELF_HOSTED) {
    const designDoc = await db.get("_design/database")
    designDoc.views = {
      ...designDoc.views,
      [viewToSave.name]: viewTemplate,
    }
    // view has been renamed
    if (originalName) {
      delete designDoc.views[originalName]
    }
    await db.put(designDoc)
  } else {
    const id = generateMemoryViewID(viewToSave.name)
    const originalId = originalName ? generateMemoryViewID(originalName) : null
    const viewDoc = {
      _id: id,
      view: viewTemplate,
      name: viewToSave.name,
      tableId: viewTemplate.meta.tableId,
    }
    try {
      const old = await db.get(id)
      if (originalId) {
        const originalDoc = await db.get(originalId)
        await db.remove(originalDoc._id, originalDoc._rev)
      }
      if (old && old._rev) {
        viewDoc._rev = old._rev
      }
    } catch (err) {
      // didn't exist, just skip
    }
    await db.put(viewDoc)
  }
}

async function deleteView(db, viewName) {
  if (env.SELF_HOSTED) {
    const designDoc = await db.get("_design/database")
    const view = designDoc.views[viewName]
    delete designDoc.views[viewName]
    await db.put(designDoc)
    return view
  } else {
    const id = generateMemoryViewID(viewName)
    const viewDoc = await db.get(id)
    await db.remove(viewDoc._id, viewDoc._rev)
    return viewDoc.view
  }
}

const controller = {
  fetch: async ctx => {
    const db = new CouchDB(ctx.appId)
    ctx.body = await getViews(db)
  },
  save: async ctx => {
    const db = new CouchDB(ctx.appId)
    const { originalName, ...viewToSave } = ctx.request.body
    const view = viewTemplate(viewToSave)

    if (!viewToSave.name) {
      ctx.throw(400, "Cannot create view without a name")
    }

    await saveView(db, originalName, viewToSave, view)

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

    ctx.body = {
      ...table.views[viewToSave.name],
      name: viewToSave.name,
    }
  },
  destroy: async ctx => {
    const db = new CouchDB(ctx.appId)
    const viewName = decodeURI(ctx.params.viewName)
    const view = await deleteView(db, viewName)
    const table = await db.get(view.meta.tableId)
    delete table.views[viewName]
    await db.put(table)

    ctx.body = view
  },
  exportView: async ctx => {
    const db = new CouchDB(ctx.appId)
    const viewName = decodeURI(ctx.query.view)
    const view = await getView(db, viewName)

    const format = ctx.query.format
    if (!format) {
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

    let schema = view && view.meta && view.meta.schema
    if (!schema) {
      const tableId = ctx.params.tableId || view.meta.tableId
      const table = await db.get(tableId)
      schema = table.schema
    }

    // Export part
    let headers = Object.keys(schema)
    const exporter = exporters[format]
    const filename = `${viewName}.${format}`
    // send down the file
    ctx.attachment(filename)
    ctx.body = apiFileReturn(exporter(headers, ctx.body))
  },
}

module.exports = controller
