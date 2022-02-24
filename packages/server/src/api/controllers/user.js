const {
  generateUserMetadataID,
  getUserMetadataParams,
  generateUserFlagID,
} = require("../../db/utils")
const { InternalTables } = require("../../db/utils")
const { getGlobalUsers, getRawGlobalUser } = require("../../utilities/global")
const { getFullUser } = require("../../utilities/users")
const { isEqual } = require("lodash")
const { BUILTIN_ROLE_IDS } = require("@budibase/backend-core/roles")
const {
  getDevelopmentAppID,
  getProdAppIDs,
  dbExists,
} = require("@budibase/backend-core/db")
const { UserStatus } = require("@budibase/backend-core/constants")
const { getAppDB, doInAppContext } = require("@budibase/backend-core/context")

async function rawMetadata() {
  const db = getAppDB()
  return (
    await db.allDocs(
      getUserMetadataParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
}

function combineMetadataAndUser(user, metadata) {
  // skip users with no access
  if (user.roleId === BUILTIN_ROLE_IDS.PUBLIC) {
    return null
  }
  delete user._rev
  const metadataId = generateUserMetadataID(user._id)
  const newDoc = {
    ...user,
    _id: metadataId,
    tableId: InternalTables.USER_METADATA,
  }
  const found = Array.isArray(metadata)
    ? metadata.find(doc => doc._id === metadataId)
    : metadata
  // copy rev over for the purposes of equality check
  if (found) {
    newDoc._rev = found._rev
  }
  if (found == null || !isEqual(newDoc, found)) {
    return {
      ...found,
      ...newDoc,
    }
  }
  return null
}

exports.syncGlobalUsers = async () => {
  // sync user metadata
  const db = getAppDB()
  const [users, metadata] = await Promise.all([getGlobalUsers(), rawMetadata()])
  const toWrite = []
  for (let user of users) {
    const combined = await combineMetadataAndUser(user, metadata)
    if (combined) {
      toWrite.push(combined)
    }
  }
  await db.bulkDocs(toWrite)
}

exports.syncUser = async function (ctx) {
  let deleting = false,
    user
  const userId = ctx.params.id
  try {
    user = await getRawGlobalUser(userId)
  } catch (err) {
    if (err && err.status === 404) {
      user = {}
      deleting = true
    } else {
      throw err
    }
  }
  const roles = deleting ? {} : user.roles
  // remove props which aren't useful to metadata
  delete user.password
  delete user.forceResetPassword
  delete user.roles
  // run through all production appIDs in the users roles
  let prodAppIds
  // if they are a builder then get all production app IDs
  if ((user.builder && user.builder.global) || deleting) {
    prodAppIds = await getProdAppIDs()
  } else {
    prodAppIds = Object.entries(roles)
      .filter(entry => entry[1] !== BUILTIN_ROLE_IDS.PUBLIC)
      .map(([appId]) => appId)
  }
  for (let prodAppId of prodAppIds) {
    const roleId = roles[prodAppId]
    const devAppId = getDevelopmentAppID(prodAppId)
    for (let appId of [prodAppId, devAppId]) {
      if (!(await dbExists(appId))) {
        continue
      }
      await doInAppContext(appId, async () => {
        const db = getAppDB()
        const metadataId = generateUserMetadataID(userId)
        let metadata
        try {
          metadata = await db.get(metadataId)
        } catch (err) {
          if (deleting) {
            return
          }
          metadata = {
            tableId: InternalTables.USER_METADATA,
          }
        }
        // assign the roleId for the metadata doc
        if (roleId) {
          metadata.roleId = roleId
        }
        let combined = !deleting
          ? combineMetadataAndUser(user, metadata)
          : {
              ...metadata,
              status: UserStatus.INACTIVE,
              metadata: BUILTIN_ROLE_IDS.PUBLIC,
            }
        // if its null then there was no updates required
        if (combined) {
          await db.put(combined)
        }
      })
    }
  }
  ctx.body = {
    message: "User synced.",
  }
}

exports.fetchMetadata = async function (ctx) {
  const database = getAppDB()
  const global = await getGlobalUsers()
  const metadata = await rawMetadata(database)
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
  // make sure no csrf token
  delete ctx.request.body.csrfToken
  await exports.updateMetadata(ctx)
}

exports.updateMetadata = async function (ctx) {
  const db = getAppDB()
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
  const db = getAppDB()
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

exports.setFlag = async function (ctx) {
  const userId = ctx.user._id
  const { flag, value } = ctx.request.body
  if (!flag) {
    ctx.throw(400, "Must supply a 'flag' field in request body.")
  }
  const flagDocId = generateUserFlagID(userId)
  const db = getAppDB()
  let doc
  try {
    doc = await db.get(flagDocId)
  } catch (err) {
    doc = { _id: flagDocId }
  }
  doc[flag] = value || true
  await db.put(doc)
  ctx.body = { message: "Flag set successfully" }
}

exports.getFlags = async function (ctx) {
  const userId = ctx.user._id
  const docId = generateUserFlagID(userId)
  const db = getAppDB()
  let doc
  try {
    doc = await db.get(docId)
  } catch (err) {
    doc = { _id: docId }
  }
  ctx.body = doc
}
