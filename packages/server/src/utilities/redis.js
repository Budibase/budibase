const { Client, utils } = require("@budibase/auth").redis

const APP_DEV_LOCK_SECONDS = 600
const DB_NAME = utils.Databases.DEV_LOCKS
let devAppClient

// we init this as we want to keep the connection open all the time
// reduces the performance hit
exports.init = async () => {
  devAppClient = await (new Client(DB_NAME)).init()
}

exports.doesUserHaveLock = async (devAppId, userId) => {
  const value = await devAppClient.get(devAppId)
  return value == null || value === userId
}

exports.updateLock = async (devAppId, userId) => {
  await devAppClient.store(devAppId, userId, APP_DEV_LOCK_SECONDS)
}

exports.clearLock = async (devAppId, userId) => {
  const value = await devAppClient.get(devAppId)
  if (!value) {
    return
  }
  if (value !== userId) {
    throw "User does not hold lock, cannot clear it."
  }
  await devAppClient.delete(devAppClient)
}
