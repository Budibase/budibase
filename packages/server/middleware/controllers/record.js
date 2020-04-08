const couchdb = require("../../db");

const controller = {
  save: async ctx => {
  },
  fetch: async ctx => {
    const db = couchdb.db.use(ctx.params.databaseId)

    ctx.body = await db.view("database", "all_somemodel", { 
      include_docs: true,
      key: ["app"] 
    })
  },
  destroy: async ctx => {
    const databaseId = ctx.params.databaseId;
    const database = couchdb.db.use(databaseId)
    ctx.body = await database.destroy(ctx.params.recordId);
  },
}

module.exports = controller;