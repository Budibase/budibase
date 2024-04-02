import * as redis from "../redis/init"
import { v4 as uuidv4 } from "uuid"
import { logWarn } from "../logging"
import env from "../environment"
import { Duration } from "../utils"
import {
  Session,
  ScannedSession,
  SessionKey,
  CreateSession,
} from "@budibase/types"

// a week expiry is the default
const EXPIRY_SECONDS = env.SESSION_EXPIRY_SECONDS
  ? parseInt(env.SESSION_EXPIRY_SECONDS)
  : Duration.fromDays(7).toSeconds()

function makeSessionID(userId: string, sessionId: string) {
  return `${userId}/${sessionId}`
}

export async function getSessionsForUser(userId: string): Promise<Session[]> {
  if (!userId) {
    console.trace("Cannot get sessions for undefined userId")
    return []
  }
  const client = await redis.getSessionClient()
  const sessions: ScannedSession[] = await client.scan(userId)
  return sessions.map(session => session.value)
}

export async function invalidateSessions(
  userId: string,
  opts: { sessionIds?: string[]; reason?: string } = {}
) {
  try {
    const reason = opts?.reason || "unknown"
    let sessionIds: string[] = opts.sessionIds || []
    let sessionKeys: SessionKey[]

    // If no sessionIds, get all the sessions for the user
    if (sessionIds.length === 0) {
      const sessions = await getSessionsForUser(userId)
      sessionKeys = sessions.map(session => ({
        key: makeSessionID(session.userId, session.sessionId),
      }))
    } else {
      // use the passed array of sessionIds
      sessionIds = Array.isArray(sessionIds) ? sessionIds : [sessionIds]
      sessionKeys = sessionIds.map(sessionId => ({
        key: makeSessionID(userId, sessionId),
      }))
    }

    if (sessionKeys && sessionKeys.length > 0) {
      const client = await redis.getSessionClient()
      const promises = []
      for (let sessionKey of sessionKeys) {
        promises.push(client.delete(sessionKey.key))
      }
      if (!env.isTest()) {
        logWarn(
          `Invalidating sessions for ${userId} (reason: ${reason}) - ${sessionKeys
            .map(sessionKey => sessionKey.key)
            .join(", ")}`
        )
      }
      await Promise.all(promises)
    }
  } catch (err) {
    console.error(`Error invalidating sessions: ${err}`)
  }
}

export async function createASession(
  userId: string,
  createSession: CreateSession
) {
  // invalidate all other sessions
  await invalidateSessions(userId, { reason: "creation" })

  const client = await redis.getSessionClient()
  const sessionId = createSession.sessionId
  const csrfToken = createSession.csrfToken ? createSession.csrfToken : uuidv4()
  const key = makeSessionID(userId, sessionId)

  const session: Session = {
    ...createSession,
    csrfToken,
    createdAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    userId,
  }
  await client.store(key, session, EXPIRY_SECONDS)
  return session
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

export async function getSession(
  userId: string,
  sessionId: string
): Promise<Session> {
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
