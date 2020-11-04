const CouchDB = require("../../db")
const bcrypt = require("../../utilities/bcrypt")
const { generateUserID, getUserParams } = require("../../db/utils")
const {
  POWERUSER_LEVEL_ID,
  ADMIN_LEVEL_ID,
} = require("../../utilities/accessLevels")

exports.fetch = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  const data = await database.allDocs(
    getUserParams(null, {
      include_docs: true,
    })
  )
  ctx.body = data.rows.map(row => row.doc)
}

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const { username, password, name, accessLevelId } = ctx.request.body

  if (!username || !password) {
    ctx.throw(400, "Username and Password Required.")
  }

  const accessLevel = await checkAccessLevel(db, accessLevelId)

  if (!accessLevel) ctx.throw(400, "Invalid Access Level")

  const user = {
    _id: generateUserID(username),
    username,
    password: await bcrypt.hash(password),
    name: name || username,
    type: "user",
    accessLevelId,
  }

  const response = await db.post(user)

  ctx.status = 200
  ctx.message = "User created successfully."
  ctx.userId = response._id
  ctx.body = {
    _rev: response.rev,
    username,
    name,
  }
}

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
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
  const database = new CouchDB(ctx.user.appId)
  await database.destroy(generateUserID(ctx.params.username))
  ctx.message = `User ${ctx.params.username} deleted.`
  ctx.status = 200
}

exports.find = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  const user = await database.get(generateUserID(ctx.params.username))
  ctx.body = {
    username: user.username,
    name: user.name,
    _rev: user._rev,
  }
}

const checkAccessLevel = async (db, accessLevelId) => {
  if (!accessLevelId) return
  if (
    accessLevelId === POWERUSER_LEVEL_ID ||
    accessLevelId === ADMIN_LEVEL_ID
  ) {
    return {
      _id: accessLevelId,
      name: accessLevelId,
      permissions: [],
    }
  }
  return await db.get(accessLevelId)
}
