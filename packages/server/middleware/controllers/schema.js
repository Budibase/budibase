const couchdb = require("../../db");

const controller = {
  create: async ctx => {
    const appDatabase = couchdb.db.use(ctx.params.appId)
    ctx.body = await appDatabase.insert(ctx.request.body);
  },
  apply: async ctx => {} 
}

module.exports = controller;