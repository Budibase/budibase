const CouchDB = require("../../db")
const {
  generateUserMetadataID,
  getUserMetadataParams,
  getGlobalIDFromUserMetadataID,
} = require("../../db/utils")
const { InternalTables } = require("../../db/utils")
const { getRole } = require("../../utilities/security/roles")
const {
  getGlobalUsers,
  saveGlobalUser,
  deleteGlobalUser,
} = require("../../utilities/workerRequests")
const { getFullUser } = require("../../utilities/users")

exports.fetchMetadata = async function (ctx) {
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
    // find the metadata that matches up to the global ID
    const info = metadata.find(meta => meta._id.includes(user._id))
    // remove these props, not for the correct DB
    users.push({
      ...user,
      ...info,
      // make sure the ID is always a local ID, not a global one
      _id: generateUserMetadataID(user._id),
    })
  }
  ctx.body = users
}

exports.createMetadata = async function (ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const { roleId } = ctx.request.body

  if (ctx.request.body._id) {
    return exports.updateMetadata(ctx)
  }

  // check role valid
  const role = await getRole(appId, roleId)
  if (!role) ctx.throw(400, "Invalid Role")

  const globalUser = await saveGlobalUser(ctx, appId, ctx.request.body)

  const user = {
    ...globalUser,
    _id: generateUserMetadataID(globalUser._id),
    type: "user",
    tableId: InternalTables.USER_METADATA,
  }

  const response = await db.post(user)
  // for automations to make it obvious was successful
  ctx.status = 200
  ctx.body = {
    _id: response.id,
    _rev: response.rev,
    email: ctx.request.body.email,
  }
}

exports.updateSelfMetadata = async function (ctx) {
  // overwrite the ID with current users
  ctx.request.body._id = ctx.user._id
  // make sure no stale rev
  delete ctx.request.body._rev
  await exports.updateMetadata(ctx)
}

exports.updateMetadata = async function (ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const user = ctx.request.body
  const globalUser = await saveGlobalUser(ctx, appId, {
    ...user,
    _id: getGlobalIDFromUserMetadataID(user._id),
  })
  const metadata = {
    ...globalUser,
    _id: user._id || generateUserMetadataID(globalUser._id),
    _rev: user._rev,
  }
  ctx.body = await db.put(metadata)
}

exports.destroyMetadata = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  await deleteGlobalUser(ctx, getGlobalIDFromUserMetadataID(ctx.params.id))
  try {
    const dbUser = await db.get(ctx.params.id)
    await db.remove(dbUser._id, dbUser._rev)
  } catch (err) {
    // error just means the global user has no config in this app
  }
  ctx.body = {
    message: `User ${ctx.params.id} deleted.`,
  }
}

exports.findMetadata = async function (ctx) {
  ctx.body = await getFullUser(ctx, ctx.params.id)
}
