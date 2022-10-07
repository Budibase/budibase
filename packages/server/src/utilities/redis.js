const { Client, utils } = require("@budibase/backend-core/redis")
const { getGlobalIDFromUserMetadataID } = require("../db/utils")

const APP_DEV_LOCK_SECONDS = 600
const AUTOMATION_TEST_FLAG_SECONDS = 60
let devAppClient, debounceClient, flagClient

// we init this as we want to keep the connection open all the time
// reduces the performance hit
exports.init = async () => {
  devAppClient = new Client(utils.Databases.DEV_LOCKS)
  debounceClient = new Client(utils.Databases.DEBOUNCE)
  flagClient = new Client(utils.Databases.FLAGS)
  await devAppClient.init()
  await debounceClient.init()
  await flagClient.init()
}

exports.shutdown = async () => {
  if (devAppClient) await devAppClient.finish()
  if (debounceClient) await debounceClient.finish()
  if (flagClient) await flagClient.finish()
  console.log("Redis shutdown")
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

exports.getLocksById = async appIds => {
  return await devAppClient.bulkGet(appIds)
}

exports.updateLock = async (devAppId, user) => {
  // make sure always global user ID
  const globalId = getGlobalIDFromUserMetadataID(user._id)
  const inputUser = {
    ...user,
    userId: globalId,
    _id: globalId,
    lockedAt: new Date().getTime(),
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

exports.checkDebounce = async id => {
  return debounceClient.get(id)
}

exports.setDebounce = async (id, seconds) => {
  await debounceClient.store(id, "debouncing", seconds)
}

exports.setTestFlag = async id => {
  await flagClient.store(id, { testing: true }, AUTOMATION_TEST_FLAG_SECONDS)
}

exports.checkTestFlag = async id => {
  const flag = await flagClient.get(id)
  return !!(flag && flag.testing)
}

exports.clearTestFlag = async id => {
  await devAppClient.delete(id)
}
