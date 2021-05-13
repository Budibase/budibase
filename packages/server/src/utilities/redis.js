const { Client, utils } = require("@budibase/auth").redis
const { getGlobalIDFromUserMetadataID } = require("../db/utils")

const APP_DEV_LOCK_SECONDS = 600
const DB_NAME = utils.Databases.DEV_LOCKS
let devAppClient

// we init this as we want to keep the connection open all the time
// reduces the performance hit
exports.init = async () => {
  devAppClient = await new Client(DB_NAME).init()
}

exports.doesUserHaveLock = async (devAppId, user) => {
  const value = await devAppClient.get(devAppId)
  if (!value) {
    return true
  }
  // make sure both IDs are global
  const expected = getGlobalIDFromUserMetadataID(value._id)
  const userId = getGlobalIDFromUserMetadataID(user._id)
  return expected === userId
}

exports.getAllLocks = async () => {
  const locks = await devAppClient.scan()
  return locks.map(lock => ({
    appId: lock.key,
    user: lock.value,
  }))
}

exports.updateLock = async (devAppId, user) => {
  // make sure always global user ID
  const globalId = getGlobalIDFromUserMetadataID(user._id)
  const inputUser = {
    ...user,
    userId: globalId,
    _id: globalId,
  }
  await devAppClient.store(devAppId, inputUser, APP_DEV_LOCK_SECONDS)
}

exports.clearLock = async (devAppId, user) => {
  const value = await devAppClient.get(devAppId)
  if (!value) {
    return
  }
  const userId = getGlobalIDFromUserMetadataID(user._id)
  if (value._id !== userId) {
    throw "User does not hold lock, cannot clear it."
  }
  await devAppClient.delete(devAppId)
}
