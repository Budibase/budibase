const couchdb = require("../../db");

const controller = {
  create: async ctx => {
    ctx.body =  await couchdb.db.create(ctx.request.body.databaseName);
  },
  destroy: async ctx => {
    ctx.body = await couchdb.db.destroy(ctx.request.body.databaseName)
  }
}

module.exports = controller;