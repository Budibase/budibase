const redis = require("../redis/init")
const { v4: uuidv4 } = require("uuid")
const { logWarn } = require("../logging")
const env = require("../environment")

interface Session {
  key: string
  userId: string
  sessionId: string
  lastAccessedAt: string
  createdAt: string
  csrfToken?: string
  value: string
}

type SessionKey = { key: string }[]

// a week in seconds
const EXPIRY_SECONDS = 86400 * 7

function makeSessionID(userId: string, sessionId: string) {
  return `${userId}/${sessionId}`
}

export async function getSessionsForUser(userId: string) {
  const client = await redis.getSessionClient()
  const sessions = await client.scan(userId)
  return sessions.map((session: Session) => session.value)
}

export async function invalidateSessions(
  userId: string,
  opts: { sessionIds?: string[]; reason?: string } = {}
) {
  try {
    const reason = opts?.reason || "unknown"
    let sessionIds: string[] = opts.sessionIds || []
    let sessions: SessionKey

    // If no sessionIds, get all the sessions for the user
    if (sessionIds.length === 0) {
      sessions = await getSessionsForUser(userId)
      sessions.forEach(
        (session: any) =>
          (session.key = makeSessionID(session.userId, session.sessionId))
      )
    } else {
      // use the passed array of sessionIds
      sessionIds = Array.isArray(sessionIds) ? sessionIds : [sessionIds]
      sessions = sessionIds.map((sessionId: string) => ({
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
          `Invalidating sessions for ${userId} (reason: ${reason}) - ${sessions
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

export async function createASession(userId: string, session: Session) {
  // invalidate all other sessions
  await invalidateSessions(userId, { reason: "creation" })

  const client = await redis.getSessionClient()
  const sessionId = session.sessionId
  if (!session.csrfToken) {
    session.csrfToken = uuidv4()
  }
  session = {
    ...session,
    createdAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    userId,
  }
  await client.store(makeSessionID(userId, sessionId), session, EXPIRY_SECONDS)
}

export async function updateSessionTTL(session: Session) {
  const client = await redis.getSessionClient()
  const key = makeSessionID(session.userId, session.sessionId)
  session.lastAccessedAt = new Date().toISOString()
  await client.store(key, session, EXPIRY_SECONDS)
}

export async function endSession(userId: string, sessionId: string) {
  const client = await redis.getSessionClient()
  await client.delete(makeSessionID(userId, sessionId))
}

export async function getSession(userId: string, sessionId: string) {
  if (!userId || !sessionId) {
    throw new Error(`Invalid session details - ${userId} - ${sessionId}`)
  }
  const client = await redis.getSessionClient()
  const session = await client.get(makeSessionID(userId, sessionId))
  if (!session) {
    throw new Error(`Session not found - ${userId} - ${sessionId}`)
  }
  return session
}
