const CouchDB = require("../../../db")
const viewTemplate = require("./viewBuilder")

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
        name !== "by_workflow_trigger"
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
}

module.exports = controller
