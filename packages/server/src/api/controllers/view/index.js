const CouchDB = require("../../../db")
const statsViewTemplate = require("./viewBuilder");

const controller = {
  query: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
    const { meta } = ctx.request.body
    const response = await db.query(`database/${ctx.params.viewName}`, {
      group: !!meta.groupBy
    })

    for (row of response.rows) {
      row.value = {
        ...row.value,
        avg: row.value.sum / row.value.count
      }
    }

    ctx.body = response.rows
  },
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
    const newView = ctx.request.body

    const designDoc = await db.get("_design/database")

    const view = statsViewTemplate(newView) 

    designDoc.views = {
      ...designDoc.views,
      [newView.name]: view,
    }

    await db.put(designDoc)


    // add views to model document
    const model = await db.get(ctx.request.body.modelId)
    model.views = {
      ...(model.views ? model.views : {}),
      [newView.name]: view.meta
    }
    await db.put(model)

    ctx.body = view
    ctx.message = `View ${newView.name} saved successfully.`
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
