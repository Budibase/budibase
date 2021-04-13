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
  const db = new CouchDB(ctx.appId)
  const global = await getGlobalUsers(ctx, ctx.appId, email)
  const user = await db.get(generateUserMetadataID(email))
  return {
    ...global,
    ...user,
    // make sure the ID is always a local ID, not a global one
    _id: generateUserMetadataID(email),
  }
}
