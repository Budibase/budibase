const CouchDB = require("../../db")
const {
  generateUserMetadataID,
  getUserMetadataParams,
} = require("../../db/utils")
const { InternalTables } = require("../../db/utils")
const { addAppRoleToUser } = require("../../utilities/workerRequests")
const { getGlobalUsers, getGlobalUser } = require("../../utilities/global")
const { getFullUser } = require("../../utilities/users")

function removeGlobalProps(user) {
  // make sure to always remove some of the global user props
  delete user.password
  delete user.roles
  delete user.builder
  return user
}

exports.fetchMetadata = async function (ctx) {
  const database = new CouchDB(ctx.appId)
  const global = await getGlobalUsers(ctx.appId)
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
  // make sure no stale rev
  delete ctx.request.body._rev
  await exports.updateMetadata(ctx)
}

exports.updateMetadata = async function (ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const user = removeGlobalProps(ctx.request.body)
  if (user.roleId) {
    await addAppRoleToUser(ctx, appId, user.roleId, user._id)
  }
  const metadata = {
    tableId: InternalTables.USER_METADATA,
    ...user,
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
