const CouchDB = require("../db")
const {
  generateUserMetadataID,
  getEmailFromUserMetadataID,
} = require("../db/utils")
const { getGlobalUsers } = require("../utilities/workerRequests")

exports.getFullUser = async ({ ctx, email, userId }) => {
  if (!email) {
    email = getEmailFromUserMetadataID(userId)
  }
  const global = await getGlobalUsers(ctx, ctx.appId, email)
  let metadata
  try {
    // this will throw an error if the db doesn't exist, or there is no appId
    const db = new CouchDB(ctx.appId)
    metadata = await db.get(generateUserMetadataID(email))
  } catch (err) {
    // it is fine if there is no user metadata, just remove global db info
    delete global._id
    delete global._rev
  }
  return {
    ...global,
    ...metadata,
    // make sure the ID is always a local ID, not a global one
    _id: generateUserMetadataID(email),
  }
}
