const redis = require("../redis/authRedis")

const EXPIRY_SECONDS = 86400

async function getSessionsForUser(userId) {
  const client = await redis.getSessionClient()
  return client.scan(userId)
}

function makeSessionID(userId, sessionId) {
  return `${userId}/${sessionId}`
}

exports.createASession = async (userId, sessionId, token) => {
  const client = await redis.getSessionClient()
  await client.store(makeSessionID(userId, sessionId), token, EXPIRY_SECONDS)
}

exports.invalidateSessions = async (userId, sessionId = null) => {
  let sessions = []
  if (sessionId) {
    sessions.push({ key: makeSessionID(userId, sessionId) })
  } else {
    sessions = await getSessionsForUser(userId)
  }
  const client = await redis.getSessionClient()
  const promises = []
  for (let session of sessions) {
    promises.push(client.delete(session.key))
  }
  await Promise.all(promises)
}

exports.updateSessionTTL = async (userId, sessionId) => {
  const client = await redis.getSessionClient()
  await client.setExpiry(makeSessionID(userId, sessionId), EXPIRY_SECONDS)
}

exports.endSession = async (userId, sessionId) => {
  const client = await redis.getSessionClient()
  await client.delete(makeSessionID(userId, sessionId))
}

exports.getSession = async (userId, sessionId) => {
  try {
    const client = await redis.getSessionClient()
    return client.get(makeSessionID(userId, sessionId))
  } catch (err) {
    // if can't get session don't error, just don't return anything
    return null
  }
}

exports.getAllSessions = async () => {
  const client = await redis.getSessionClient()
  return client.scan()
}
