import { events } from "@budibase/backend-core"
import type {
  ActionSession,
  ActionSessionsSummary,
  FetchActionSessionsResponse,
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"
import {
  buildPagination,
  decodeKeysetBookmark,
  resolveLimit,
} from "./pagination"
import {
  getSessionKeysetKey,
  querySessions,
  querySessionsStatusCounts,
} from "./views"

function toActionSession(doc: PlatformActionSessionIndexDoc): ActionSession {
  const {
    _id,
    _rev,
    _deleted,
    createdAt: _createdAt,
    statusUpdatedAt: _statusUpdatedAt,
    ...session
  } = doc
  return session
}

export async function fetchSessions({
  environment,
  status,
  bookmark,
  limit,
}: {
  environment?: PlatformActionEnvironment
  status?: PlatformActionContainerStatus
  bookmark?: string
  limit?: number
}): Promise<FetchActionSessionsResponse> {
  const workspaceDb = events.platformActions.getActionsDB()
  const token =
    bookmark === undefined ? undefined : decodeKeysetBookmark(bookmark)
  const direction = token?.direction ?? "next"

  const [page, summary] = await Promise.all([
    querySessions({
      workspaceDb,
      environment,
      status,
      limit: resolveLimit(limit),
      bookmark: token,
      direction,
    }),
    fetchSessionsSummary({ environment }),
  ])

  return {
    sessions: page.items.map(toActionSession),
    summary,
    pagination: buildPagination({
      items: page.items,
      hasMore: page.hasMore,
      direction,
      hadBookmark: token !== undefined,
      keyOf: doc => getSessionKeysetKey({ environment, status, doc }),
      idOf: doc => doc._id!,
    }),
  }
}

export async function fetchSessionsSummary({
  environment,
}: {
  environment?: PlatformActionEnvironment
}): Promise<ActionSessionsSummary> {
  const workspaceDb = events.platformActions.getActionsDB()
  const counts = await querySessionsStatusCounts({ workspaceDb, environment })
  return {
    total: counts.active + counts.waiting + counts.completed + counts.failed,
    active: counts.active,
    waiting: counts.waiting,
    completed: counts.completed,
    failed: counts.failed,
  }
}
