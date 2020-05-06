const CouchDB = require("../../db");
const bcrypt = require("../../utilities/bcrypt");

exports.fetch = async function(ctx) {
  const database = new CouchDB(ctx.params.instanceId);
  const data = await database.query("database/by_type", { 
    include_docs: true,
    key: ["user"] 
  });

  ctx.body = data.rows.map(row => row.doc);
};

exports.create = async function(ctx) {
  const database = new CouchDB(ctx.params.instanceId);
  const { username, password, name } = ctx.request.body;

  if (!username || !password) ctx.throw(400, "Username and Password Required.");

  const response =  await database.post({ 
    username,
    password: await bcrypt.hash(password),
    name, 
    type: "user"
  });

  // the clientDB needs to store a map of users against the app
  const clientDb = new CouchDB(`client-${process.env.CLIENT_ID}`);
  const app = await clientDb.get(ctx.params.appId);

  app.userInstanceMap = {
    ...app.userInstanceMap,
    [username]: ctx.params.instanceId
  }
  await clientDb.put(app);

  ctx.body = {
    user: {
      id: response.id,
      rev: response.rev,
      username,
      name
    },
    message: `User created successfully.`,
    status: 200
  }
};

exports.destroy = async function(ctx) {
  const database = new CouchDB(ctx.params.instanceId);
  const response = await database.destroy(ctx.params.userId)
  ctx.body = {
    ...response,
    message: `User deleted.`,
    status: 200
  }
};