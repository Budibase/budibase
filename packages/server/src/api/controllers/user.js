const CouchDB = require("../../db")
const {
  generateUserMetadataID,
  getUserMetadataParams,
} = require("../../db/utils")
const { InternalTables } = require("../../db/utils")
const { getGlobalUsers } = require("../../utilities/global")
const { getFullUser } = require("../../utilities/users")
const { isEqual } = require("lodash")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")

exports.rawMetadata = async db => {
  return (
    await db.allDocs(
      getUserMetadataParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
}

exports.syncGlobalUsers = async appId => {
  // sync user metadata
  const db = new CouchDB(appId)
  const [users, metadata] = await Promise.all([
    getGlobalUsers(appId),
    exports.rawMetadata(db),
  ])
  const toWrite = []
  for (let user of users) {
    // skip users with no access
    if (user.roleId === BUILTIN_ROLE_IDS.PUBLIC) {
      continue
    }
    delete user._rev
    const metadataId = generateUserMetadataID(user._id)
    const newDoc = {
      ...user,
      _id: metadataId,
      tableId: InternalTables.USER_METADATA,
    }
    const found = metadata.find(doc => doc._id === metadataId)
    // copy rev over for the purposes of equality check
    if (found) {
      newDoc._rev = found._rev
    }
    if (found == null || !isEqual(newDoc, found)) {
      toWrite.push({
        ...found,
        ...newDoc,
      })
    }
  }
  await db.bulkDocs(toWrite)
}

exports.fetchMetadata = async function (ctx) {
  const database = new CouchDB(ctx.appId)
  const global = await getGlobalUsers(ctx.appId)
  const metadata = await exports.rawMetadata(database)
  const users = []
  for (let user of global) {
    // find the metadata that matches up to the global ID
    const info = metadata.find(meta => meta._id.includes(user._id))
    // remove these props, not for the correct DB
    users.push({
      ...user,
      ...info,
      tableId: InternalTables.USER_METADATA,
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
  const user = ctx.request.body
  // this isn't applicable to the user
  delete user.roles
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
