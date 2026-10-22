import { cache, context, events } from "@budibase/backend-core"
import type {
  Database,
  Document,
  PlatformActionSessionChange,
} from "@budibase/types"
import { EXPIRABLE_STATUSES, getRetentionDays } from "./retention"
import type { ExpiredSessionCursor } from "./views"
import {
  hasRecentEvents,
  queryEventsTotal,
  queryExpiredEvents,
  queryExpiredSessions,
} from "./views"

export const CLEANUP_BATCH_SIZE = 100
export const CLEANUP_SCAN_LIMIT = 500
const ONE_DAY_MILLIS = 86400000

interface CleanupCursor extends ExpiredSessionCursor {
  retentionDays: number
}

async function deleteDocs({
  workspaceDb,
  docs,
}: {
  workspaceDb: Database
  docs: Document[]
}): Promise<void> {
  if (docs.length === 0) {
    return
  }
  const results = await workspaceDb.bulkDocs(
    docs.map(doc => ({ _id: doc._id!, _rev: doc._rev!, _deleted: true }))
  )
  const failed = results.filter(result => result.error)
  if (failed.length > 0) {
    console.log("Failed to delete expired platform action documents", {
      failed: failed.map(({ id, error }) => ({ id, error })),
    })
  }
}

// Deletes at most batchSize documents. A session is only deleted once none
// of its events remain, so a partial or failed run leaves an expired session
// that stays hidden and is picked up again by the next run. Deletion runs
// under the Actions workspace write lock, so no event or session index write
// interleaves with it, and does nothing for a deleted workspace.
// Candidate scans are bounded separately; the tenant-scoped cursor
// lets later runs advance past protected sessions without an unbounded lock.
export async function clearOldHistory({
  batchSize = CLEANUP_BATCH_SIZE,
  scanLimit = CLEANUP_SCAN_LIMIT,
}: { batchSize?: number; scanLimit?: number } = {}): Promise<void> {
  try {
    const retentionDays = await getRetentionDays()
    const cacheKey = `platform-actions-cleanup:${events.platformActions.getActionsDbName(context.getWorkspaceId()!)}`
    if (retentionDays === undefined) {
      await events.platformActions.doWithExistingActionsWorkspace(() =>
        cache.destroy(cacheKey)
      )
      return
    }
    const cutoff = new Date(
      Date.now() - retentionDays * ONE_DAY_MILLIS
    ).toISOString()
    const workspaceDb = events.platformActions.getActionsDB()
    // Querying a view would create the database
    if (!(await workspaceDb.exists())) {
      return
    }
    const candidates = await queryExpiredSessions({
      workspaceDb,
      cutoff,
      limit: batchSize,
    })
    if (candidates.length === 0) {
      return
    }
    // Views are created under the same lock, which isn't reentrant, so both
    // must exist before taking it
    const [first] = candidates
    await queryEventsTotal({
      workspaceDb,
      environment: first.environment,
      sourceType: first.sourceType,
      sourceId: first.sourceId,
    })

    await events.platformActions.doWithExistingActionsWorkspace(async () => {
      let budget = batchSize
      const saved: CleanupCursor | null = await cache.get(cacheKey)
      let after: ExpiredSessionCursor | undefined =
        saved?.retentionDays === retentionDays ? saved : undefined
      let scanned = 0
      let finished = false
      while (scanned < scanLimit && budget > 0) {
        const limit = Math.min(CLEANUP_BATCH_SIZE, scanLimit - scanned)
        const sessions = await queryExpiredSessions({
          workspaceDb,
          cutoff,
          limit,
          after,
        })
        if (sessions.length === 0) {
          finished = true
          break
        }
        for (const session of sessions) {
          scanned++
          const { environment, sourceType, sourceId } = session
          // A new event can be persisted before its index job runs. Keep the
          // entire history until that job updates the session and its count.
          if (
            await hasRecentEvents({
              workspaceDb,
              environment,
              sourceType,
              sourceId,
              cutoff,
            })
          ) {
            after = { updatedAt: session.updatedAt, id: session._id! }
            continue
          }
          const expiredEvents = await queryExpiredEvents({
            workspaceDb,
            environment,
            sourceType,
            sourceId,
            cutoff,
            limit: budget,
          })
          await deleteDocs({ workspaceDb, docs: expiredEvents })
          budget -= expiredEvents.length
          if (budget <= 0) {
            // Resume this session next time: its index still needs cleanup.
            break
          }
          // Keep the index if some events failed to delete.
          const remaining = await queryEventsTotal({
            workspaceDb,
            environment,
            sourceType,
            sourceId,
          })
          if (remaining === 0) {
            await deleteDocs({ workspaceDb, docs: [session] })
            budget--
          }
          after = { updatedAt: session.updatedAt, id: session._id! }
          if (budget <= 0) break
        }
        if (budget <= 0) break
        if (sessions.length < limit) {
          finished = true
          break
        }
      }
      if (finished || !after) {
        await cache.destroy(cacheKey)
      } else {
        await cache.store(cacheKey, { ...after, retentionDays })
      }
    })
  } catch (err) {
    console.log("Failed to clean up platform action history", err)
  }
}

// Each terminal signal triggers cleanup, even without a status transition.
// Never rejects, so callers can leave it unawaited.
export async function clearOldHistoryOnSessionEnd({
  workspaceId,
  signal,
}: PlatformActionSessionChange): Promise<void> {
  if (!signal || !EXPIRABLE_STATUSES.includes(signal)) {
    return
  }
  try {
    await context.doInWorkspaceContext(workspaceId, () => clearOldHistory())
  } catch (err) {
    console.log("Failed to clean up platform action history", err)
  }
}
