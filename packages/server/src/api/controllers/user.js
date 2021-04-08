const CouchDB = require("../../db")
const {
  generateUserID,
  getUserParams,
  getEmailFromUserID,
} = require("@budibase/auth")
const { InternalTables } = require("../../db/utils")
const { getRole } = require("../../utilities/security/roles")
const { checkSlashesInUrl } = require("../../utilities")
const env = require("../../environment")
const fetch = require("node-fetch")

async function deleteGlobalUser(email) {
  const endpoint = `/api/admin/users/${email}`
  const reqCfg = { method: "DELETE" }
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    reqCfg
  )
  return response.json()
}

async function getGlobalUsers(email = null) {
  const endpoint = email ? `/api/admin/users/${email}` : `/api/admin/users`
  const reqCfg = { method: "GET" }
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    reqCfg
  )
  return response.json()
}

async function saveGlobalUser(appId, email, body) {
  const globalUser = await getGlobalUsers(email)
  const roles = globalUser.roles || {}
  if (body.roleId) {
    roles.appId = body.roleId
  }
  const endpoint = `/api/admin/users`
  const reqCfg = {
    method: "POST",
    body: {
      ...globalUser,
      email,
      password: body.password,
      status: body.status,
      roles,
    },
  }

  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    reqCfg
  )
  await response.json()
  delete body.email
  delete body.password
  delete body.roleId
  delete body.status
  return body
}

exports.fetchMetadata = async function(ctx) {
  const database = new CouchDB(ctx.appId)
  const global = await getGlobalUsers()
  const metadata = (
    await database.allDocs(
      getUserParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
  const users = []
  for (let user of global) {
    const info = metadata.find(meta => meta._id.includes(user.email))
    users.push({
      ...user,
      ...info,
    })
  }
  ctx.body = users
}

exports.createMetadata = async function(ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const { email, roleId } = ctx.request.body

  // check role valid
  const role = await getRole(appId, roleId)
  if (!role) ctx.throw(400, "Invalid Role")

  const metadata = await saveGlobalUser(appId, email, ctx.request.body)

  const user = {
    ...metadata,
    _id: generateUserID(email),
    type: "user",
    tableId: InternalTables.USER_METADATA,
  }

  const response = await db.post(user)
  ctx.body = {
    _rev: response.rev,
    email,
  }
}

exports.updateMetadata = async function(ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const user = ctx.request.body
  let email = user.email || getEmailFromUserID(user._id)
  const metadata = await saveGlobalUser(appId, email, ctx.request.body)

  if (!metadata._id) {
    user._id = generateUserID(email)
  }
  ctx.body = await db.put({
    ...metadata,
  })
}

exports.destroyMetadata = async function(ctx) {
  const db = new CouchDB(ctx.appId)
  const email = ctx.params.email
  await deleteGlobalUser(email)
  await db.destroy(generateUserID(email))
  ctx.body = {
    message: `User ${ctx.params.email} deleted.`,
  }
}

exports.findMetadata = async function(ctx) {
  const database = new CouchDB(ctx.appId)
  let lookup = ctx.params.email
    ? generateUserID(ctx.params.email)
    : ctx.params.userId
  const user = await database.get(lookup)
  if (user) {
    delete user.password
  }
  ctx.body = user
}
