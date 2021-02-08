const CouchDB = require("../../db")
const bcrypt = require("../../utilities/bcrypt")
const { generateUserID, getUserParams, ViewNames } = require("../../db/utils")
const { getRole } = require("../../utilities/security/roles")

exports.fetch = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  const users = (
    await database.allDocs(
      getUserParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  // user hashed password shouldn't ever be returned
  for (let user of users) {
    delete user.password
  }
  ctx.body = users
}

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const { email, password, roleId } = ctx.request.body

  if (!email || !password) {
    ctx.throw(400, "email and Password Required.")
  }

  const role = await getRole(ctx.user.appId, roleId)

  if (!role) ctx.throw(400, "Invalid Role")

  const hashedPassword = await bcrypt.hash(password)
  const user = {
    ...ctx.request.body,
    // these must all be after the object spread, make sure
    // any values are overwritten, generateUserID will always
    // generate the same ID for the user as it is not UUID based
    _id: generateUserID(email),
    type: "user",
    password: hashedPassword,
    tableId: ViewNames.USERS,
  }

  try {
    const response = await db.post(user)
    ctx.status = 200
    ctx.message = "User created successfully."
    ctx.userId = response._id
    ctx.body = {
      _rev: response.rev,
      email,
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
  if (user.password) {
    user.password = await bcrypt.hash(user.password)
  } else {
    delete user.password
  }

  const response = await db.put(user)
  user._rev = response.rev

  ctx.status = 200
  ctx.message = `User ${ctx.request.body.email} updated successfully.`
  ctx.body = response
}

exports.destroy = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  await database.destroy(generateUserID(ctx.params.email))
  ctx.message = `User ${ctx.params.email} deleted.`
  ctx.status = 200
}

exports.find = async function(ctx) {
  const database = new CouchDB(ctx.user.appId)
  let lookup = ctx.params.email
    ? generateUserID(ctx.params.email)
    : ctx.params.userId
  const user = await database.get(lookup)
  if (user) {
    delete user.password
  }
  ctx.body = user
}
