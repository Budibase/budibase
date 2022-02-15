const { InternalTables } = require("../db/utils")
const { getGlobalUser } = require("../utilities/global")
const { getAppDB } = require("@budibase/backend-core/context")

exports.getFullUser = async (ctx, userId) => {
  const global = await getGlobalUser(userId)
  let metadata
  try {
    // this will throw an error if the db doesn't exist, or there is no appId
    const db = getAppDB()
    metadata = await db.get(userId)
  } catch (err) {
    // it is fine if there is no user metadata, just remove global db info
    delete global._id
    delete global._rev
  }
  return {
    ...global,
    ...metadata,
    tableId: InternalTables.USER_METADATA,
    // make sure the ID is always a local ID, not a global one
    _id: userId,
  }
}
