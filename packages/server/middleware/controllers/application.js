const couchdb = require("../../db");

const controller = {
  create: async ctx => {
    ctx.body =  await couchdb.db.create(ctx.request.body.appName);
  }
}

module.exports = controller;