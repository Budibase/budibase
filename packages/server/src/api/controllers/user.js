const CouchDB = require("../../db")
const {
  generateUserMetadataID,
  getUserMetadataParams,
} = require("../../db/utils")
const { InternalTables } = require("../../db/utils")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { getGlobalUsers } = require("../../utilities/workerRequests")
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

exports.updateSelfMetadata = async function (ctx) {
  // overwrite the ID with current users
  ctx.request.body._id = ctx.user._id
  if (ctx.user.builder && ctx.user.builder.global) {
    ctx.request.body.roleId = BUILTIN_ROLE_IDS.ADMIN
  }
  // make sure no stale rev
  delete ctx.request.body._rev
  await exports.updateMetadata(ctx)
}

exports.updateMetadata = async function (ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const user = ctx.request.body
  // make sure to always remove some of the global user props
  delete user.password
  delete user.roles
  delete user.builder
  const metadata = {
    tableId: InternalTables.USER_METADATA,
    _id: user._id,
    _rev: user._rev,
  }
  ctx.body = await db.put(metadata)
}

exports.destroyMetadata = async function (ctx) {
  const db = new CouchDB(ctx.appId)
  try {
    const dbUser = await db.get(ctx.params.id)
    await db.remove(dbUser._id, dbUser._rev)
  } catch (err) {
    // error just means the global user has no config in this app
  }
  ctx.body = {
    message: `User metadata ${ctx.params.id} deleted.`,
  }
}

exports.findMetadata = async function (ctx) {
  ctx.body = await getFullUser(ctx, ctx.params.id)
}
