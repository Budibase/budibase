import {
  LockName,
  LockType,
  type ActionSourceContext,
  type PlatformActionContainerStatus,
  type PlatformActionOutcome,
  type PlatformActionSessionIndexDoc,
} from "@budibase/types"
import * as context from "../../../context"
import * as locks from "../../../redis/redlockImpl"
import { buildPlatformActionSession, getPlatformActionSessionId } from "./utils"

const LOCK_TTL_MS = 10000

export interface UpsertPlatformActionSessionInput extends ActionSourceContext {
  outcome: PlatformActionOutcome
  timestamp: string
}

function nextStatus(
  existingStatus: PlatformActionContainerStatus | undefined,
  outcome: PlatformActionOutcome
): PlatformActionContainerStatus {
  if (existingStatus === "failed" || outcome === "failure") {
    return "failed"
  }
  return "completed"
}

export async function upsertPlatformActionSession(
  input: UpsertPlatformActionSessionInput
): Promise<void> {
  const sessionId = getPlatformActionSessionId(input)

  const lockResponse = await locks.doWithLock(
    {
      type: LockType.TRY_ONCE,
      name: LockName.PLATFORM_ACTION_SESSION_INDEX,
      resource: sessionId,
      ttl: LOCK_TTL_MS,
    },
    async () => {
      const db = context.getWorkspaceDB()

      for (let attempt = 0; attempt < 3; attempt++) {
        const existing =
          await db.tryGet<PlatformActionSessionIndexDoc>(sessionId)
        const status = nextStatus(existing?.status, input.outcome)

        const doc: PlatformActionSessionIndexDoc = existing
          ? { ...existing, status, actionCount: existing.actionCount + 1 }
          : buildPlatformActionSession({
              sourceType: input.sourceType,
              sourceId: input.sourceId,
              status,
              startedAt: input.timestamp,
            })
        doc.updatedAt = input.timestamp
        doc.completedAt = input.timestamp

        try {
          await db.put(doc)
          return
        } catch (err: any) {
          if (err?.status === 409 && attempt < 2) {
            continue
          }
          throw err
        }
      }
    }
  )

  if (!lockResponse.executed) {
    // Another job already holds the lock for this session - let Bull's
    // retry/backoff pick this update back up instead of dropping it, since
    // every event must be reflected in actionCount.
    throw new Error(
      `Could not acquire lock to index platform action session ${sessionId}`
    )
  }
}
