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
  const response =  await database.insert(ctx.request.body);
  ctx.body = {
    ...response,
    message: `User created successfully.`,
    status: 200
  }
};

exports.destroy = async function(ctx) {
  const database = couchdb.db.use(ctx.params.databaseId);
  const response = await database.destroy(ctx.params.userId)
  ctx.body = {
    ...response,
    message: `User deleted.`,
    status: 200
  }
};