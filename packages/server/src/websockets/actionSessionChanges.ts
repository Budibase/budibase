import { db as dbCore } from "@budibase/backend-core"
import {
  ActionSessionChangeEvent,
  ActionSourceContext,
  PlatformActionEnvironment,
  PlatformActionSessionChange,
} from "@budibase/types"
import { builderSocket } from "./index"

export const ACTION_SESSION_CHANGE_FLUSH_MS = 1000
export const MAX_ACTION_SESSION_CHANGES_PER_EVENT = 50

interface PendingActionSessionChanges {
  room: string
  environment: PlatformActionEnvironment
  sessions: Map<string, ActionSourceContext>
  truncated: boolean
}

const pending = new Map<string, PendingActionSessionChanges>()

const flush = (key: string) => {
  const changes = pending.get(key)
  pending.delete(key)
  if (!changes) {
    return
  }

  const event: ActionSessionChangeEvent = {
    environment: changes.environment,
    sessions: [...changes.sessions.values()],
    ...(changes.truncated ? { truncated: true } : {}),
  }
  try {
    builderSocket?.emitActionSessionChange(changes.room, event)
  } catch (err) {
    console.error("Failed to emit action session changes", {
      room: changes.room,
      environment: changes.environment,
      err,
    })
  }
}

// Coalesces index writes so a burst of actions results in at most one
// notification per room and environment for each flush window
export const queueActionSessionChange = ({
  workspaceId,
  environment,
  sourceType,
  sourceId,
}: PlatformActionSessionChange) => {
  const room = dbCore.getDevWorkspaceID(workspaceId)
  const key = `${room}/${environment}`

  let changes = pending.get(key)
  if (!changes) {
    changes = { room, environment, sessions: new Map(), truncated: false }
    pending.set(key, changes)
    setTimeout(() => flush(key), ACTION_SESSION_CHANGE_FLUSH_MS).unref()
  }

  const sessionKey = `${sourceType}/${sourceId}`
  if (changes.sessions.has(sessionKey)) {
    return
  }
  if (changes.sessions.size >= MAX_ACTION_SESSION_CHANGES_PER_EVENT) {
    changes.truncated = true
    return
  }
  changes.sessions.set(sessionKey, { sourceType, sourceId })
}
