const couchdb = require("../../db");

exports.create = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)
  ctx.body = await db.insert(ctx.request.body);
  // Create the "all" view for that model
  
}

exports.update = async function(ctx) {
}

exports.destroy = async function(ctx) {
  const db = couchdb.db.use(ctx.params.instanceId)
  ctx.body = await db.destroy(ctx.params.modelId, ctx.params.rev);
}
