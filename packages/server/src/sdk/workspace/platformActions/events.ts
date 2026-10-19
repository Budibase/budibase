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
import {
  buildPagination,
  decodeKeysetBookmark,
  resolveLimit,
} from "./pagination"
import { getRetentionCutoff, isExpiredSession } from "./retention"
import { getEventKeysetKey, queryEvents, queryEventsTotal } from "./views"

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
  const [total, session, cutoff] = await Promise.all([
    queryEventsTotal({ workspaceDb, environment, sourceType, sourceId }),
    workspaceDb.tryGet<PlatformActionSessionIndexDoc>(
      events.platformActions.getPlatformActionSessionId({
        environment,
        sourceType,
        sourceId,
      })
    ),
    getRetentionCutoff(),
  ])
  // Events can be persisted before their session is indexed
  if (session ? isExpiredSession({ session, cutoff }) : total === 0) {
    throw new HTTPError("Session not found", 404)
  }
  return { total }
}
