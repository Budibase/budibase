const couchdb = require("../../db");

exports.fetch = async function(ctx) {
  const database = couchdb.db.use(ctx.params.databaseId);
  const data = await database.view("database", "by_type", { 
    include_docs: true,
    key: ["user"] 
  });

  ctx.body = data.rows
};

exports.create = async function(ctx) {
  const database = couchdb.db.use(ctx.params.databaseId);
  ctx.body =  await database.insert(ctx.request.body);
};

exports.destroy = async function(ctx) {
  const database = couchdb.db.use(ctx.params.databaseId);
  ctx.body = await database.destroy(ctx.params.userId)
};