const couchdb = require("../../db");

const controller = {
  fetch: async ctx => {
    const database = couchdb.db.use(ctx.params.databaseId);
    const data = await database.view("database", "by_type", { 
      include_docs: true,
      key: ["user"] 
    });

    ctx.body = data.rows
  },
  create: async ctx => {
    const database = couchdb.db.use(ctx.params.databaseId);
    ctx.body =  await database.insert(ctx.request.body);
  },
  destroy: async ctx => {
    const database = couchdb.db.use(ctx.params.databaseId);
    ctx.body = await database.destroy(ctx.params.userId)
  }
}

module.exports = controller;