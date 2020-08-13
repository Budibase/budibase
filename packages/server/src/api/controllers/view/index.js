const CouchDB = require("../../../db")
const customViewTemplate = require("./customViews");

const controller = {
  query: async ctx => {
    // const db = new CouchDB(ctx.user.instanceId)
    const db = new CouchDB("inst_4e6f424_970ca7f2b9e24ec8896eb10862d7f22b")
    const response = await db.query(`database/${ctx.params.viewName}`, {
      group: false
    })

    ctx.body = response.rows
    // ctx.body = {
    //   ...data,
    //   avg: data.sum / data.count
    // }
  },
  fetch: async ctx => {
    // const db = new CouchDB(ctx.user.instanceId)
    const db = new CouchDB("inst_4e6f424_970ca7f2b9e24ec8896eb10862d7f22b")
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
  create: async ctx => {
    // const db = new CouchDB(ctx.user.instanceId)
    const db = new CouchDB("inst_4e6f424_970ca7f2b9e24ec8896eb10862d7f22b")
    const newView = ctx.request.body

    const designDoc = await db.get("_design/database")

    const view = customViewTemplate(ctx.request.body) 

    designDoc.views = {
      ...designDoc.views,
      [newView.name]: view,
    }

    await db.put(designDoc)

    ctx.body = newView
    ctx.message = `View ${newView.name} created successfully.`
  },
  destroy: async ctx => {
    const db = new CouchDB(ctx.user.instanceId)
    ctx.body = await db.destroy(ctx.params.userId)
  },
}

module.exports = controller
