const CouchDB = require("../../db");

const controller = {
  fetch: async ctx => {
    const db = new CouchDB(ctx.config)(ctx.params.instanceId);
    const designDoc = await db.get("_design/database");
    ctx.body = designDoc.views;
  },
  create: async ctx => {
    const db = new CouchDB(ctx.config)(ctx.params.instanceId);
    const { name, ...viewDefinition } = ctx.request.body;

    const designDoc = await db.get("_design/database");
    designDoc.views = {
      ...designDoc.views,
      [name]: viewDefinition
    };
    const newView = await db.put(designDoc);

    ctx.body = {
      ...newView,
      message: `View ${name} created successfully.`,
      status: 200,
    }
  },
  destroy: async ctx => {
    const db = new CouchDB(ctx.config)(ctx.params.instanceId);
    ctx.body = await db.destroy(ctx.params.userId)
  }
}

module.exports = controller;