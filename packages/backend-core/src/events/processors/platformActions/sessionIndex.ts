import {
  LockName,
  LockType,
  type ActionSourceContext,
  type PlatformActionContainerStatus,
  type PlatformActionSessionIndexDoc,
} from "@budibase/types"
import * as context from "../../../context"
import * as locks from "../../../redis/redlockImpl"
import { buildPlatformActionSession, getPlatformActionSessionId } from "./utils"

const LOCK_TTL_MS = 10000
const MAX_PUT_CONFLICT_ATTEMPTS = 3

const TERMINAL_STATUSES: ReadonlySet<PlatformActionContainerStatus> = new Set([
  "completed",
  "failed",
])

function isTerminalSignal(signal: PlatformActionContainerStatus): boolean {
  return TERMINAL_STATUSES.has(signal)
}

export interface UpsertPlatformActionSessionInput extends ActionSourceContext {
  incrementsActionCount: boolean
  signal: PlatformActionContainerStatus
  timestamp: string
}

function nextStatus(
  existingStatus: PlatformActionContainerStatus | undefined,
  signal: PlatformActionContainerStatus
): PlatformActionContainerStatus {
  if (existingStatus === "failed" || signal === "failed") {
    return "failed"
  }
  if (existingStatus && TERMINAL_STATUSES.has(existingStatus)) {
    return existingStatus
  }
  return signal
}

function earliest(a: string, b: string): string {
  return new Date(a) < new Date(b) ? a : b
}

function latest(a: string, b: string): string {
  return new Date(a) > new Date(b) ? a : b
}

export async function upsertPlatformActionSession(
  input: UpsertPlatformActionSessionInput
): Promise<void> {
  const sessionId = getPlatformActionSessionId(input)
  const isTerminal = isTerminalSignal(input.signal)

  const lockResponse = await locks.doWithLock(
    {
      type: LockType.TRY_ONCE,
      name: LockName.PLATFORM_ACTION_SESSION_INDEX,
      resource: sessionId,
      ttl: LOCK_TTL_MS,
    },
    async () => {
      const db = context.getWorkspaceDB()

      for (let attempt = 0; attempt < MAX_PUT_CONFLICT_ATTEMPTS; attempt++) {
        const existing =
          await db.tryGet<PlatformActionSessionIndexDoc>(sessionId)
        if (!existing && !input.incrementsActionCount) {
          return
        }
        const status = nextStatus(existing?.status, input.signal)
        const startedAt = existing
          ? earliest(existing.startedAt, input.timestamp)
          : input.timestamp

        const doc: Omit<PlatformActionSessionIndexDoc, "updatedAt"> = existing
          ? {
              ...existing,
              status,
              startedAt,
              ...(input.incrementsActionCount
                ? { actionCount: existing.actionCount + 1 }
                : {}),
            }
          : buildPlatformActionSession({
              sourceType: input.sourceType,
              sourceId: input.sourceId,
              status,
              startedAt,
              actionCount: input.incrementsActionCount ? 1 : 0,
            })

        if (isTerminal) {
          doc.completedAt = existing
            ? latest(
                existing.completedAt ?? existing.startedAt,
                input.timestamp
              )
            : input.timestamp
        }

        try {
          await db.put(doc)
          return
        } catch (err: any) {
          const isLastAttempt = attempt === MAX_PUT_CONFLICT_ATTEMPTS - 1
          if (err?.status === 409 && !isLastAttempt) {
            continue
          }
          throw err
        }
      }
    }
  )

  if (!lockResponse.executed) {
    throw new Error(
      `Could not acquire lock to index platform action session ${sessionId}`
    )
  }
}
