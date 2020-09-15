const CouchDB = require("../../db")
const clientDb = require("../../db/clientDb")
const bcrypt = require("../../utilities/bcrypt")
const getUserId = userName => `user_${userName}`
const { POWERUSER_LEVEL_ID, ADMIN_LEVEL_ID } = require("../../utilities/accessLevels")

exports.fetch = async function(ctx) {
  const database = new CouchDB(ctx.user.instanceId)
  const data = await database.query("database/by_type", {
    include_docs: true,
    key: ["user"],
  })

  ctx.body = data.rows.map(row => row.doc)
}

exports.create = async function(ctx) {
  const database = new CouchDB(ctx.user.instanceId)
  const appId = (await database.get("_design/database")).metadata.applicationId
  const { username, password, name, accessLevelId } = ctx.request.body

  if (!username || !password) {
    ctx.throw(400, "Username and Password Required.")
  }

  const accessLevel = await checkAccessLevel(database, accessLevelId)

  if (!accessLevel) ctx.throw(400, "Invalid Access Level")

  const user = {
    _id: getUserId(username),
    username,
    password: await bcrypt.hash(password),
    name: name || username,
    type: "user",
    accessLevelId,
  }

  const response = await database.post(user)

  const masterDb = new CouchDB("client_app_lookup")
  const { clientId } = await masterDb.get(appId)

  // the clientDB needs to store a map of users against the app
  const db = new CouchDB(clientDb.name(clientId))
  const app = await db.get(appId)

  app.userInstanceMap = {
    ...app.userInstanceMap,
    [username]: ctx.user.instanceId,
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

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const user = ctx.request.body
  const dbUser = db.get(ctx.request.body._id)
  const newData = { ...dbUser, ...user }

  const response = await db.put(newData)
  user._rev = response.rev

  ctx.status = 200
  ctx.message = `User ${ctx.request.body.username} updated successfully.`
  ctx.body = response
}

exports.destroy = async function(ctx) {
  const database = new CouchDB(ctx.user.instanceId)
  await database.destroy(getUserId(ctx.params.username))
  ctx.message = `User ${ctx.params.username} deleted.`
  ctx.status = 200
}

exports.find = async function(ctx) {
  const database = new CouchDB(ctx.user.instanceId)
  const user = await database.get(getUserId(ctx.params.username))
  ctx.body = {
    username: user.username,
    name: user.name,
    _rev: user._rev,
  }
}

const checkAccessLevel = async (db, accessLevelId) => {
  if (!accessLevelId) return
  if (accessLevelId === POWERUSER_LEVEL_ID || accessLevelId === ADMIN_LEVEL_ID) {
    return {
      _id: accessLevelId,
      name: accessLevelId,
      permissions: [],
    }
  }
  return await db.get(accessLevelId)
}
