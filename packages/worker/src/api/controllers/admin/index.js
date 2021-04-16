const CouchDB = require("../../../db")
const {
  hash,
  generateUserID,
  getUserParams,
  StaticDatabases,
} = require("@budibase/auth")
const { UserStatus } = require("../../../constants")

const GLOBAL_DB = StaticDatabases.GLOBAL.name

exports.userSave = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  const { email, password, _id } = ctx.request.body
  const hashedPassword = password ? await hash(password) : null
  let user = {
    ...ctx.request.body,
    _id: generateUserID(email),
    password: hashedPassword,
  }
  let dbUser
  // in-case user existed already
  if (_id) {
    dbUser = await db.get(_id)
  }
  // add the active status to a user if its not provided
  if (user.status == null) {
    user.status = UserStatus.ACTIVE
  }
  try {
    const response = await db.post({
      password: hashedPassword || dbUser.password,
      ...user,
    })
    ctx.body = {
      _id: response.id,
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

exports.userDelete = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  const dbUser = await db.get(generateUserID(ctx.params.email))
  await db.remove(dbUser._id, dbUser._rev)
  ctx.body = {
    message: `User ${ctx.params.email} deleted.`,
  }
}

// called internally by app server user fetch
exports.userFetch = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  const response = await db.allDocs(
    getUserParams(null, {
      include_docs: true,
    })
  )
  const users = response.rows.map(row => row.doc)
  // user hashed password shouldn't ever be returned
  for (let user of users) {
    if (user) {
      delete user.password
    }
  }
  ctx.body = users
}

// called internally by app server user find
exports.userFind = async ctx => {
  const db = new CouchDB(GLOBAL_DB)
  let user
  try {
    user = await db.get(generateUserID(ctx.params.email))
  } catch (err) {
    // no user found, just return nothing
    user = {}
  }
  if (user) {
    delete user.password
  }
  ctx.body = user
}
