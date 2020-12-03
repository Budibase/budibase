const CouchDB = require("../../db")
const bcrypt = require("../../utilities/bcrypt")
const { generateUserID, getUserParams, ViewNames } = require("../../db/utils")
const { getRole } = require("../../utilities/security/roles")

exports.fetch = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  const data = await database.allDocs(
    getUserParams("", {
      include_docs: true,
    })
  )
  ctx.body = data.rows.map(row => row.doc)
}

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const { username, password, name, roleId } = ctx.request.body

  if (!username || !password) {
    ctx.throw(400, "Username and Password Required.")
  }

  const role = await getRole(ctx.user.appId, roleId)

  if (!role) ctx.throw(400, "Invalid Role")

  const user = {
    _id: generateUserID(username),
    username,
    password: await bcrypt.hash(password),
    name: name || username,
    type: "user",
    roleId,
    tableId: ViewNames.USERS,
  }

  try {
    const response = await db.post(user)
    ctx.status = 200
    ctx.message = "User created successfully."
    ctx.userId = response._id
    ctx.body = {
      _rev: response.rev,
      username,
      name,
    }
  } catch (err) {
    if (err.status === 409) {
      ctx.throw(400, "User exists already")
    } else {
      ctx.throw(err.status, err)
    }
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
