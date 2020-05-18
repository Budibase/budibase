const CouchDB = require("../../db")

const controller = {
  query: async () => {},
  fetch: async ctx => {
    const db = new CouchDB(ctx.params.instanceId)
    const designDoc = await db.get("_design/database")
    const response = []

    for (let name in designDoc.views) {
      if (
        !name.startsWith("all") &&
        name !== "by_type" &&
        name !== "by_username"
      ) {
        response.push({
          name,
          ...designDoc.views[name],
        })
      }
    }

    ctx.body = response
  },
  create: async ctx => {
    const db = new CouchDB(ctx.params.instanceId)
    const newView = ctx.request.body

    const designDoc = await db.get("_design/database")
    designDoc.views = {
      ...designDoc.views,
      [newView.name]: newView,
    }
    await db.put(designDoc)

    ctx.body = newView
    ctx.message = `View ${newView.name} created successfully.`
  },
  destroy: async ctx => {
    const db = new CouchDB(ctx.params.instanceId)
    ctx.body = await db.destroy(ctx.params.userId)
  },
}

module.exports = controller
