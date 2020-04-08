const couchdb = require("../../db");

const controller = {
  fetch: async ctx => {
    const clientDb = couchdb.db.use(`client-${ctx.params.clientId}`);
    const body = await clientDb.view("client", "by_type", { 
      include_docs: true,
      key: ["app"] 
    });

    ctx.body = body.rows;
  },
  create: async ctx => {
    const clientDb = couchdb.db.use(`client-${ctx.params.clientId}`);
    ctx.body = await clientDb.insert(ctx.request.body)
  }
}

module.exports = controller;