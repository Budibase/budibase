const couchdb = require("../../db");

const controller = {
  fetch: async ctx => {
    const db = couchdb.db.use(ctx.params.instanceId);
    const designDoc = await db.get("_design/database");
    ctx.body = designDoc.views;
  },
  create: async ctx => {
    const db = couchdb.db.use(ctx.params.instanceId);
    const { name, ...viewDefinition } = ctx.request.body;

    const designDoc = await db.get("_design/database");
    designDoc.views = {
      ...designDoc.views,
      [name]: viewDefinition
    };
    const newView = await db.insert(designDoc, designDoc._id);

    ctx.body = {
      ...newView,
      message: `View ${name} created successfully.`,
      status: 200,
    }
  },
  destroy: async ctx => {
    const database = couchdb.db.use(ctx.params.databaseId);
    ctx.body = await database.destroy(ctx.params.userId)
  }
}

module.exports = controller;