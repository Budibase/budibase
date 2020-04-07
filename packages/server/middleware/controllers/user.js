const couchdb = require("../../db");

const controller = {
  fetch: async ctx => {
    const database = couchdb.db.use(ctx.params.databaseId);
    ctx.body = await database.list({ include_docs: true });
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