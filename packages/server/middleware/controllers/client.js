const couchdb = require("../../db");

const controller = {
  save: async ctx => {
  },
  fetch: async ctx => {
    const databaseId = ctx.params.databaseId;
    const database = couchdb.db.use(databaseId)
    ctx.body = await database.list({});
  },
  destroy: async ctx => {
    const databaseId = ctx.params.databaseId;
    const database = couchdb.db.use(databaseId)
    ctx.body = await database.destroy(ctx.params.recordId);
  },
}

module.exports = controller;