import { LockName, LockType } from "@budibase/types"
import type { PlatformActionSessionIndexDoc } from "@budibase/types"
import { generator, mocks, structures } from "../../../../../tests"
import * as context from "../../../../context"
import * as db from "../../../../db"
import * as locks from "../../../../redis/redlockImpl"
import { upsertPlatformActionSession } from "../sessionIndex"
import { getPlatformActionSessionId } from "../utils"

async function run<T>(task: () => Promise<T>): Promise<T> {
  const workspaceId = db.generateWorkspaceID(structures.tenant.id())
  return await context.doInWorkspaceContext(workspaceId, task)
}

async function getSessionDoc(sourceId: string) {
  return context
    .getWorkspaceDB()
    .get<PlatformActionSessionIndexDoc>(
      getPlatformActionSessionId({ sourceType: "agent_session", sourceId })
    )
}

describe("upsertPlatformActionSession", () => {
  it("creates a new session doc on the first event", async () => {
    await run(async () => {
      const sourceId = generator.guid()

      await upsertPlatformActionSession({
        sourceType: "agent_session",
        sourceId,
        incrementsActionCount: true,
        signal: "completed",
        timestamp: "2026-08-31T00:00:00.000Z",
      })

      const doc = await getSessionDoc(sourceId)

      expect(doc.actionCount).toBe(1)
      expect(doc.status).toBe("completed")
      expect(doc.startedAt).toBe("2026-08-31T00:00:00.000Z")
      expect(doc.updatedAt).toBe(mocks.date.MOCK_DATE.toISOString())
      expect(doc.completedAt).toBe("2026-08-31T00:00:00.000Z")
    })
  })

  it("creates a failed session doc when the first event is a failure", async () => {
    await run(async () => {
      const sourceId = generator.guid()

      await upsertPlatformActionSession({
        sourceType: "agent_session",
        sourceId,
        incrementsActionCount: true,
        signal: "failed",
        timestamp: "2026-08-31T00:00:00.000Z",
      })

      const doc = await getSessionDoc(sourceId)

      expect(doc.status).toBe("failed")
    })
  })

  it("increments actionCount and refreshes updatedAt/completedAt on later events", async () => {
    await run(async () => {
      const sourceId = generator.guid()
      const input = { sourceType: "agent_session" as const, sourceId }

      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: true,
        signal: "completed",
        timestamp: "2026-08-31T00:00:00.000Z",
      })
      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: true,
        signal: "completed",
        timestamp: "2026-08-31T00:05:00.000Z",
      })

      const doc = await getSessionDoc(sourceId)

      expect(doc.actionCount).toBe(2)
      expect(doc.startedAt).toBe("2026-08-31T00:00:00.000Z")
      expect(doc.updatedAt).toBe(mocks.date.MOCK_DATE.toISOString())
      expect(doc.completedAt).toBe("2026-08-31T00:05:00.000Z")
    })
  })

  it("keeps startedAt/completedAt chronologically correct when events are processed out of order", async () => {
    await run(async () => {
      const sourceId = generator.guid()
      const input = { sourceType: "agent_session" as const, sourceId }

      // Simulates a later event's job winning the lock/processing race and
      // being indexed before an earlier event's job (e.g. after a lock
      // contention retry).
      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: true,
        signal: "completed",
        timestamp: "2026-08-31T00:05:00.000Z",
      })
      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: true,
        signal: "completed",
        timestamp: "2026-08-31T00:00:00.000Z",
      })

      const doc = await getSessionDoc(sourceId)

      expect(doc.actionCount).toBe(2)
      expect(doc.startedAt).toBe("2026-08-31T00:00:00.000Z")
      expect(doc.completedAt).toBe("2026-08-31T00:05:00.000Z")
    })
  })

  it("keeps status failed once set, even after a later success event", async () => {
    await run(async () => {
      const sourceId = generator.guid()
      const input = { sourceType: "agent_session" as const, sourceId }

      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: true,
        signal: "failed",
        timestamp: "2026-08-31T00:00:00.000Z",
      })
      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: true,
        signal: "completed",
        timestamp: "2026-08-31T00:05:00.000Z",
      })

      const doc = await getSessionDoc(sourceId)

      expect(doc.status).toBe("failed")
      expect(doc.actionCount).toBe(2)
    })
  })

  it("updates lifecycle state without incrementing actionCount", async () => {
    await run(async () => {
      const sourceId = generator.guid()
      const input = { sourceType: "agent_session" as const, sourceId }

      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: false,
        signal: "active",
        timestamp: "2026-08-31T00:00:00.000Z",
      })
      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: false,
        signal: "waiting",
        timestamp: "2026-08-31T00:01:00.000Z",
      })
      await upsertPlatformActionSession({
        ...input,
        incrementsActionCount: false,
        signal: "completed",
        timestamp: "2026-08-31T00:02:00.000Z",
      })

      const doc = await getSessionDoc(sourceId)

      expect(doc.status).toBe("completed")
      expect(doc.actionCount).toBe(0)
      expect(doc.completedAt).toBe("2026-08-31T00:02:00.000Z")
    })
  })

  it("does not lose increments when events for the same session arrive concurrently", async () => {
    await run(async () => {
      const sourceId = generator.guid()
      const input = { sourceType: "agent_session" as const, sourceId }
      const eventCount = 5

      // The session lock is TRY_ONCE (no internal retry), relying on the
      // surrounding Bull job's own retry/backoff to pick a rejected update
      // back up. Simulate that retry here to prove no increment is lost
      // under real concurrency, rather than two updates silently racing
      // through a read-merge-write on the same doc.
      const sessionId = getPlatformActionSessionId(input)
      const lockContentionMessage = `Could not acquire lock to index platform action session ${sessionId}`
      const retryTimeoutMs = 1000
      const retryIntervalMs = 30

      async function upsertWithRetry(timestamp: string) {
        const deadline = Date.now() + retryTimeoutMs

        while (true) {
          try {
            await upsertPlatformActionSession({
              ...input,
              incrementsActionCount: true,
              signal: "completed",
              timestamp,
            })
            return
          } catch (err) {
            // Only lock contention is expected/retryable here - anything
            // else is a real bug and should fail the test immediately
            // instead of being masked behind blind retries.
            if (
              !(err instanceof Error) ||
              err.message !== lockContentionMessage
            ) {
              throw err
            }
            if (Date.now() >= deadline) {
              throw new Error("Could not upsert session within retry timeout")
            }
            await new Promise(resolve => setTimeout(resolve, retryIntervalMs))
          }
        }
      }

      await Promise.all(
        Array.from({ length: eventCount }, (_, i) =>
          upsertWithRetry(`2026-08-31T00:0${i}:00.000Z`)
        )
      )

      const doc = await getSessionDoc(sourceId)

      expect(doc.actionCount).toBe(eventCount)
    })
  })

  it("throws instead of racing an update when the session lock is already held", async () => {
    await run(async () => {
      const sourceId = generator.guid()
      const input = { sourceType: "agent_session" as const, sourceId }
      const sessionId = getPlatformActionSessionId(input)

      await expect(
        locks.doWithLock(
          {
            type: LockType.AUTO_EXTEND,
            name: LockName.PLATFORM_ACTION_SESSION_INDEX,
            resource: sessionId,
          },
          () =>
            upsertPlatformActionSession({
              ...input,
              incrementsActionCount: true,
              signal: "completed",
              timestamp: "2026-08-31T00:00:00.000Z",
            })
        )
      ).rejects.toThrow(
        `Could not acquire lock to index platform action session ${sessionId}`
      )
    })
  })
})
