const redis = require("../redis/init")
const { v4: uuidv4 } = require("uuid")
const { logWarn } = require("../logging")
const env = require("../environment")

// a week in seconds
const EXPIRY_SECONDS = 86400 * 7

async function getSessionsForUser(userId) {
  const client = await redis.getSessionClient()
  const sessions = await client.scan(userId)
  return sessions.map(session => session.value)
}

function makeSessionID(userId, sessionId) {
  return `${userId}/${sessionId}`
}

async function invalidateSessions(userId, sessionIds = null) {
  try {
    let sessions = []

    // If no sessionIds, get all the sessions for the user
    if (!sessionIds) {
      sessions = await getSessionsForUser(userId)
      sessions.forEach(
        session =>
          (session.key = makeSessionID(session.userId, session.sessionId))
      )
    } else {
      // use the passed array of sessionIds
      sessions = Array.isArray(sessionIds) ? sessionIds : [sessionIds]
      sessions = sessions.map(sessionId => ({
        key: makeSessionID(userId, sessionId),
      }))
    }

    if (sessions && sessions.length > 0) {
      const client = await redis.getSessionClient()
      const promises = []
      for (let session of sessions) {
        promises.push(client.delete(session.key))
      }
      if (!env.isTest()) {
        logWarn(
          `Invalidating sessions for ${userId} - ${sessions
            .map(session => session.key)
            .join(", ")}`
        )
      }
      await Promise.all(promises)
    }
  } catch (err) {
    console.error(`Error invalidating sessions: ${err}`)
  }
}

exports.createASession = async (userId, session) => {
  // invalidate all other sessions
  await invalidateSessions(userId)

  const client = await redis.getSessionClient()
  const sessionId = session.sessionId
  if (!session.csrfToken) {
    session.csrfToken = uuidv4()
  }
  session = {
    createdAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    ...session,
    userId,
  }
  await client.store(makeSessionID(userId, sessionId), session, EXPIRY_SECONDS)
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

exports.getSession = async (userId, sessionId) => {
  try {
    const client = await redis.getSessionClient()
    return client.get(makeSessionID(userId, sessionId))
  } catch (err) {
    // if can't get session don't error, just don't return anything
    console.error(err)
    return null
  }
}

exports.getAllSessions = async () => {
  const client = await redis.getSessionClient()
  const sessions = await client.scan()
  return sessions.map(session => session.value)
}

exports.getUserSessions = getSessionsForUser
exports.invalidateSessions = invalidateSessions
