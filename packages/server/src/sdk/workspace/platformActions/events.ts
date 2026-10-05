import { events, HTTPError } from "@budibase/backend-core"
import type {
  ActionEvent,
  ActionEventsSummary,
  FetchActionSessionEventsResponse,
  PlatformActionEnvironment,
  PlatformActionEvent,
  PlatformActionSessionIndexDoc,
  PlatformActionSourceType,
} from "@budibase/types"
import { decodeKeysetBookmark } from "./bookmarks"
import { buildPagination } from "./pagination"
import { getEventKeysetKey, queryEvents, queryEventsTotal } from "./views"

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

function resolveLimit(limit?: number): number {
  if (!limit || limit < 1) {
    return DEFAULT_LIMIT
  }
  return Math.min(Math.floor(limit), MAX_LIMIT)
}

function toActionEvent(doc: PlatformActionEvent): ActionEvent {
  return {
    id: doc._id!,
    eventName: doc.eventName,
    timestamp: doc.timestamp,
    ...(doc.assetType === undefined ? {} : { assetType: doc.assetType }),
    ...(doc.assetId === undefined ? {} : { assetId: doc.assetId }),
    payload: doc.payload,
  }
}

export async function fetchSessionEvents({
  environment,
  sourceType,
  sourceId,
  bookmark,
  limit,
}: {
  environment: PlatformActionEnvironment
  sourceType: PlatformActionSourceType
  sourceId: string
  bookmark?: string
  limit?: number
}): Promise<FetchActionSessionEventsResponse> {
  const workspaceDb = events.platformActions.getActionsDB()
  const token =
    bookmark === undefined ? undefined : decodeKeysetBookmark(bookmark)
  const direction = token?.direction ?? "next"

  const [page, summary] = await Promise.all([
    queryEvents({
      workspaceDb,
      environment,
      sourceType,
      sourceId,
      limit: resolveLimit(limit),
      bookmark: token,
      direction,
    }),
    fetchSessionEventsSummary({ environment, sourceType, sourceId }),
  ])

  if (summary.total === 0) {
    const session = await workspaceDb.tryGet<PlatformActionSessionIndexDoc>(
      events.platformActions.getPlatformActionSessionId({
        environment,
        sourceType,
        sourceId,
      })
    )
    if (!session) {
      throw new HTTPError("Session not found", 404)
    }
  }

  return {
    events: page.items.map(toActionEvent),
    summary,
    pagination: buildPagination({
      items: page.items,
      hasMore: page.hasMore,
      direction,
      hadBookmark: token !== undefined,
      keyOf: getEventKeysetKey,
      idOf: doc => doc._id!,
    }),
  }
}

export async function fetchSessionEventsSummary({
  environment,
  sourceType,
  sourceId,
}: {
  environment: PlatformActionEnvironment
  sourceType: PlatformActionSourceType
  sourceId: string
}): Promise<ActionEventsSummary> {
  const workspaceDb = events.platformActions.getActionsDB()
  const total = await queryEventsTotal({
    workspaceDb,
    environment,
    sourceType,
    sourceId,
  })
  return { total }
}
