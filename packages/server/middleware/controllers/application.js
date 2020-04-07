const couchdb = require("../../db");

const controller = {
  create: async ctx => {
    const clientDatabase = couchdb.db.use(ctx.params.clientId);
    ctx.body =  await clientDatabase.create(ctx.request.body.appname);
  }
}

module.exports = controller;