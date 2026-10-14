import { context, events } from "@budibase/backend-core"
import type {
  Database,
  Document,
  PlatformActionSessionChange,
} from "@budibase/types"
import { EXPIRABLE_STATUSES, getRetentionCutoff } from "./retention"
import {
  queryEventsTotal,
  queryExpiredEvents,
  queryExpiredSessions,
} from "./views"

export const CLEANUP_BATCH_SIZE = 100

async function deleteDocs(
  workspaceDb: Database,
  docs: Document[]
): Promise<void> {
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
export async function clearOldHistory({
  batchSize = CLEANUP_BATCH_SIZE,
}: { batchSize?: number } = {}): Promise<void> {
  try {
    const cutoff = await getRetentionCutoff()
    if (cutoff === undefined) {
      return
    }
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
      const sessions = await queryExpiredSessions({
        workspaceDb,
        cutoff,
        limit: budget,
      })
      for (const session of sessions) {
        if (budget <= 0) {
          return
        }
        const { environment, sourceType, sourceId } = session
        const expiredEvents = await queryExpiredEvents({
          workspaceDb,
          environment,
          sourceType,
          sourceId,
          cutoff,
          limit: budget,
        })
        await deleteDocs(workspaceDb, expiredEvents)
        budget -= expiredEvents.length
        if (budget <= 0) {
          return
        }
        // Remaining events either failed to delete or are newer than the
        // cutoff, i.e. the session is being resumed and its index update
        // will make it visible again
        const remaining = await queryEventsTotal({
          workspaceDb,
          environment,
          sourceType,
          sourceId,
        })
        if (remaining === 0) {
          await deleteDocs(workspaceDb, [session])
          budget--
        }
      }
    })
  } catch (err) {
    console.log("Failed to clean up platform action history", err)
  }
}

// Only a session ending triggers cleanup, so it runs once per run rather
// than once per action. Never rejects, so callers can leave it unawaited.
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
