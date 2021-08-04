const redis = require("../redis/authRedis")

const EXPIRY_SECONDS = 86400

async function getSessionsForUser(userId) {
  const client = await redis.getSessionClient()
  const sessions = await client.scan(userId)
  return sessions.map(session => session.value)
}

function makeSessionID(userId, sessionId) {
  return `${userId}/${sessionId}`
}

exports.createASession = async (userId, sessionId) => {
  const client = await redis.getSessionClient()
  const session = {
    createdAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    sessionId,
    userId,
  }
  await client.store(makeSessionID(userId, sessionId), session, EXPIRY_SECONDS)
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

exports.updateSessionTTL = async session => {
  const client = await redis.getSessionClient()
  const key = makeSessionID(session.userId, session.sessionId)
  session.lastAccessedAt = new Date().toISOString()
  await client.store(key, session, EXPIRY_SECONDS)
}

exports.endSession = async (userId, sessionId) => {
  const client = await redis.getSessionClient()
  await client.delete(makeSessionID(userId, sessionId))
}

exports.getUserSessions = getSessionsForUser

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
  const sessions = await client.scan()
  return sessions.map(session => session.value)
}
