const couchdb = require("../../db");

const controller = {
  fetch: async ctx => {
    const database = couchdb.db.use(ctx.params.databaseId);
    ctx.body = await database.list({ type: "user" });
  },
  create: async ctx => {
    const database = couchdb.db.use(ctx.params.databaseId);
    ctx.body =  await database.create(ctx.request.body.user);
  },
  destroy: async ctx => {
    const database = couchdb.db.use(ctx.params.databaseId);
    ctx.body = await database.destroy(ctx.params.userId)
  }
}

module.exports = controller;