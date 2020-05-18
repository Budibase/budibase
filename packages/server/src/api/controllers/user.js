const CouchDB = require("../../db")
const clientDb = require("../../db/clientDb")
const bcrypt = require("../../utilities/bcrypt")
const env = require("../../environment")

const getUserId = userName => `user_${userName}`

exports.fetch = async function(ctx) {
  const database = new CouchDB(ctx.params.instanceId)
  const data = await database.query("database/by_type", {
    include_docs: true,
    key: ["user"],
  })

  ctx.body = data.rows.map(row => row.doc)
}

exports.create = async function(ctx) {
  const database = new CouchDB(ctx.params.instanceId)
  const appId = (await database.get("_design/database")).metadata.applicationId
  const { username, password, name } = ctx.request.body

  if (!username || !password) ctx.throw(400, "Username and Password Required.")

  const response = await database.post({
    _id: getUserId(username),
    username,
    password: await bcrypt.hash(password),
    name: name || username,
    type: "user",
  })

  // the clientDB needs to store a map of users against the app
  const db = new CouchDB(clientDb.name(env.CLIENT_ID))
  const app = await db.get(appId)

  app.userInstanceMap = {
    ...app.userInstanceMap,
    [username]: ctx.params.instanceId,
  }
  await db.put(app)

  ctx.status = 200
  ctx.message = "User created successfully."
  ctx.body = {
    _rev: response.rev,
    username,
    name,
  }
}

exports.destroy = async function(ctx) {
  const database = new CouchDB(ctx.params.instanceId)
  await database.destroy(getUserId(ctx.params.username))
  ctx.message = `User ${ctx.params.username} deleted.`
  ctx.status = 200
}

exports.find = async function(ctx) {
  const database = new CouchDB(ctx.params.instanceId)
  const user = await database.get(getUserId(ctx.params.username))
  ctx.body = {
    username: user.username,
    name: user.name,
    _rev: user._rev,
  }
}
