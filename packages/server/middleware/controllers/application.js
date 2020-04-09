const couchdb = require("../../db");

exports.fetch = async function(ctx) {
  const clientDb = couchdb.db.use(`client-${ctx.params.clientId}`);
  const body = await clientDb.view("client", "by_type", { 
    include_docs: true,
    key: ["app"] 
  });

  ctx.body = body.rows;
};

exports.create = async function(ctx) {
  const clientDb = couchdb.db.use(`client-${ctx.params.clientId}`);
  const { id, rev } = await clientDb.insert(ctx.request.body)
  ctx.body = {
    id,
    rev,
    message: `Application ${ctx.request.body.name} created successfully`
  }
};