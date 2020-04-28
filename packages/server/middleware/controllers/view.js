const CouchDB = require("../../db");

const controller = {
  query: async ctx => {

  },
  fetch: async ctx => {
    const db = new CouchDB(ctx.params.instanceId);
    const designDoc = await db.get("_design/database");
    const response = [];

    for (let name in designDoc.views) {
      if (!name.startsWith("all") && name !== "by_type") {
        response.push({
          name,
          ...designDoc.views[name]
        })
      }
    }

    ctx.body = response
  },
  create: async ctx => {
    const db = new CouchDB(ctx.params.instanceId);
    const { name, ...viewDefinition } = ctx.request.body;

    const designDoc = await db.get("_design/database");
    designDoc.views = {
      ...designDoc.views,
      [name]: viewDefinition
    };
    const newView = await db.put(designDoc);

    ctx.body = {
      view: {
        ...ctx.request.body,
        ...newView
      },
      message: `View ${name} created successfully.`,
      status: 200,
    }
  },
  destroy: async ctx => {
    const db = new CouchDB(ctx.params.instanceId);
    ctx.body = await db.destroy(ctx.params.userId)
  }
}

module.exports = controller;