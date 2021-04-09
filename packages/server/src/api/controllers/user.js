const CouchDB = require("../../db")
const {
  generateUserMetadataID,
  getUserMetadataParams,
  getEmailFromUserMetadataID,
} = require("../../db/utils")
const { InternalTables } = require("../../db/utils")
const { getRole } = require("../../utilities/security/roles")
const {
  getGlobalUsers,
  saveGlobalUser,
  deleteGlobalUser,
} = require("../../utilities/workerRequests")

exports.fetchMetadata = async function(ctx) {
  const database = new CouchDB(ctx.appId)
  const global = await getGlobalUsers(ctx, ctx.appId)
  const metadata = (
    await database.allDocs(
      getUserMetadataParams(null, {
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

  const metadata = await saveGlobalUser(ctx, appId, email, ctx.request.body)

  const user = {
    ...metadata,
    _id: generateUserMetadataID(email),
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
  let email = user.email || getEmailFromUserMetadataID(user._id)
  const metadata = await saveGlobalUser(ctx, appId, email, ctx.request.body)

  if (!metadata._id) {
    user._id = generateUserMetadataID(email)
  }
  ctx.body = await db.put({
    ...metadata,
  })
}

exports.destroyMetadata = async function(ctx) {
  const db = new CouchDB(ctx.appId)
  const email = ctx.params.email
  await deleteGlobalUser(ctx, email)
  await db.destroy(generateUserMetadataID(email))
  ctx.body = {
    message: `User ${ctx.params.email} deleted.`,
  }
}

exports.findMetadata = async function(ctx) {
  const database = new CouchDB(ctx.appId)
  const email =
    ctx.params.email || getEmailFromUserMetadataID(ctx.params.userId)
  const global = await getGlobalUsers(ctx, ctx.appId, email)
  const user = await database.get(generateUserMetadataID(email))
  ctx.body = {
    ...global,
    ...user,
  }
}
