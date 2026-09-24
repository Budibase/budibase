import { db, HTTPError, ViewName } from "@budibase/backend-core"
import type {
  Database,
  DatabaseKey,
  DatabaseQueryOpts,
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionEvent,
  PlatformActionSessionIndexDoc,
  PlatformActionSourceType,
} from "@budibase/types"
import {
  DocumentType,
  PLATFORM_ACTION_CONTAINER_STATUSES,
  SEPARATOR,
} from "@budibase/types"
import type { KeysetBookmarkDirection, KeysetPosition } from "./bookmarks"

const SESSION_ID_PREFIX = `${DocumentType.PLATFORM_ACTION_SESSION}${SEPARATOR}`

// map functions - sessions, ordered by updatedAt

const buildSessionsByUpdatedAtView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${SESSION_ID_PREFIX}") && doc.updatedAt) {
    emit(doc.updatedAt, null)
  }
}`

const buildSessionsByStatusAndUpdatedAtView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${SESSION_ID_PREFIX}") && doc.status && doc.updatedAt) {
    emit([doc.status, doc.updatedAt], null)
  }
}`

const buildSessionsByEnvironmentAndUpdatedAtView =
  (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${SESSION_ID_PREFIX}") && doc.environment && doc.updatedAt) {
    emit([doc.environment, doc.updatedAt], null)
  }
}`

const buildSessionsByEnvironmentStatusAndUpdatedAtView =
  (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${SESSION_ID_PREFIX}") && doc.environment && doc.status && doc.updatedAt) {
    emit([doc.environment, doc.status, doc.updatedAt], null)
  }
}`

// map+reduce functions - session status counts, bounded indexed counts

const buildSessionsStatusCountsView = (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${SESSION_ID_PREFIX}") && doc.status) {
    emit(doc.status, null)
  }
}`

const buildSessionsByEnvironmentStatusCountsView =
  (): string => `function(doc) {
  if (doc._id && doc._id.startsWith("${SESSION_ID_PREFIX}") && doc.environment && doc.status) {
    emit([doc.environment, doc.status], null)
  }
}`

// map function - events, identified by environment + sourceType + sourceId
// within the session's workspace. Filtered on doc.eventName rather than an
// _id prefix: PLATFORM_ACTION_EVENT's id prefix is a strict prefix of
// PLATFORM_ACTION_SESSION's ("platform_action_" vs "platform_action_session_"),
// so an _id.startsWith check alone would also match session docs.

const buildEventsBySessionView = (): string => `function(doc) {
  if (doc.eventName && doc.environment && doc.sourceType && doc.sourceId && doc.timestamp) {
    emit([doc.environment, doc.sourceType, doc.sourceId, doc.timestamp], null)
  }
}`

const buildEventsCountBySessionView = (): string => `function(doc) {
  if (doc.eventName && doc.environment && doc.sourceType && doc.sourceId) {
    emit([doc.environment, doc.sourceType, doc.sourceId], null)
  }
}`

export const createSessionsByUpdatedAtView = async (workspaceDb: Database) => {
  await db.createView(
    workspaceDb,
    buildSessionsByUpdatedAtView(),
    ViewName.PLATFORM_ACTION_SESSIONS_BY_UPDATED_AT
  )
}

export const createSessionsByStatusAndUpdatedAtView = async (
  workspaceDb: Database
) => {
  await db.createView(
    workspaceDb,
    buildSessionsByStatusAndUpdatedAtView(),
    ViewName.PLATFORM_ACTION_SESSIONS_BY_STATUS_AND_UPDATED_AT
  )
}

export const createSessionsByEnvironmentAndUpdatedAtView = async (
  workspaceDb: Database
) => {
  await db.createView(
    workspaceDb,
    buildSessionsByEnvironmentAndUpdatedAtView(),
    ViewName.PLATFORM_ACTION_SESSIONS_BY_ENVIRONMENT_AND_UPDATED_AT
  )
}

export const createSessionsByEnvironmentStatusAndUpdatedAtView = async (
  workspaceDb: Database
) => {
  await db.createView(
    workspaceDb,
    buildSessionsByEnvironmentStatusAndUpdatedAtView(),
    ViewName.PLATFORM_ACTION_SESSIONS_BY_ENVIRONMENT_STATUS_AND_UPDATED_AT
  )
}

export const createSessionsStatusCountsView = async (workspaceDb: Database) => {
  await db.createView(
    workspaceDb,
    buildSessionsStatusCountsView(),
    ViewName.PLATFORM_ACTION_SESSIONS_STATUS_COUNTS,
    "_count"
  )
}

export const createSessionsByEnvironmentStatusCountsView = async (
  workspaceDb: Database
) => {
  await db.createView(
    workspaceDb,
    buildSessionsByEnvironmentStatusCountsView(),
    ViewName.PLATFORM_ACTION_SESSIONS_ENVIRONMENT_STATUS_COUNTS,
    "_count"
  )
}

export const createEventsBySessionView = async (workspaceDb: Database) => {
  await db.createView(
    workspaceDb,
    buildEventsBySessionView(),
    ViewName.PLATFORM_ACTION_EVENTS_BY_SESSION
  )
}

export const createEventsCountBySessionView = async (workspaceDb: Database) => {
  await db.createView(
    workspaceDb,
    buildEventsCountBySessionView(),
    ViewName.PLATFORM_ACTION_EVENTS_COUNT_BY_SESSION,
    "_count"
  )
}

// keyset pagination - sessions

export interface KeysetPage<T> {
  items: T[]
  hasMore: boolean
}

async function fetchKeysetPage<T>({
  viewName,
  params,
  workspaceDb,
  createFunc,
  limit,
  reverseResult,
}: {
  viewName: ViewName
  params: DatabaseQueryOpts
  workspaceDb: Database
  createFunc: () => Promise<void>
  limit: number
  reverseResult: boolean
}): Promise<KeysetPage<T>> {
  const rows = (await db.queryView(
    viewName,
    { ...params, include_docs: true, limit: limit + 1 },
    workspaceDb,
    createFunc,
    { arrayResponse: true }
  )) as T[]

  const hasMore = rows.length > limit
  const page = rows.slice(0, limit)
  return { items: reverseResult ? page.reverse() : page, hasMore }
}

function isValidBookmarkKey(key: DatabaseKey, prefix: DatabaseKey[]): boolean {
  if (prefix.length === 0) {
    return typeof key === "string" && key.length > 0
  }
  if (!Array.isArray(key) || key.length !== prefix.length + 1) {
    return false
  }
  const trailing = key[prefix.length]
  return (
    prefix.every((value, index) => key[index] === value) &&
    typeof trailing === "string" &&
    trailing.length > 0
  )
}

function buildKeysetParams({
  prefix,
  bookmark,
  descending,
}: {
  prefix: DatabaseKey[]
  bookmark?: KeysetPosition
  descending: boolean
}): DatabaseQueryOpts {
  const params: DatabaseQueryOpts = { descending }
  if (prefix.length > 0) {
    params.endkey = descending ? prefix : [...prefix, {}]
  }
  if (bookmark) {
    if (!isValidBookmarkKey(bookmark.key, prefix) || !bookmark.id) {
      throw new HTTPError("Invalid bookmark for this query", 400)
    }
    params.startkey = bookmark.key
    params.startkey_docid = bookmark.id
    params.skip = 1
  } else if (prefix.length > 0) {
    params.startkey = descending ? [...prefix, {}] : prefix
  }
  return params
}

type SessionsViewScope =
  | { kind: "all" }
  | { kind: "status"; status: PlatformActionContainerStatus }
  | { kind: "environment"; environment: PlatformActionEnvironment }
  | {
      kind: "environmentStatus"
      environment: PlatformActionEnvironment
      status: PlatformActionContainerStatus
    }

function resolveSessionsScope({
  environment,
  status,
}: {
  environment?: PlatformActionEnvironment
  status?: PlatformActionContainerStatus
}): SessionsViewScope {
  if (environment && status) {
    return { kind: "environmentStatus", environment, status }
  }
  if (environment) {
    return { kind: "environment", environment }
  }
  if (status) {
    return { kind: "status", status }
  }
  return { kind: "all" }
}

function scopePrefix(scope: SessionsViewScope): DatabaseKey[] {
  switch (scope.kind) {
    case "all":
      return []
    case "status":
      return [scope.status]
    case "environment":
      return [scope.environment]
    case "environmentStatus":
      return [scope.environment, scope.status]
  }
}

function resolveSessionsView(
  scope: SessionsViewScope,
  workspaceDb: Database
): {
  viewName: ViewName
  prefix: DatabaseKey[]
  createFunc: () => Promise<void>
} {
  const prefix = scopePrefix(scope)
  switch (scope.kind) {
    case "all":
      return {
        viewName: ViewName.PLATFORM_ACTION_SESSIONS_BY_UPDATED_AT,
        prefix,
        createFunc: () => createSessionsByUpdatedAtView(workspaceDb),
      }
    case "status":
      return {
        viewName: ViewName.PLATFORM_ACTION_SESSIONS_BY_STATUS_AND_UPDATED_AT,
        prefix,
        createFunc: () => createSessionsByStatusAndUpdatedAtView(workspaceDb),
      }
    case "environment":
      return {
        viewName:
          ViewName.PLATFORM_ACTION_SESSIONS_BY_ENVIRONMENT_AND_UPDATED_AT,
        prefix,
        createFunc: () =>
          createSessionsByEnvironmentAndUpdatedAtView(workspaceDb),
      }
    case "environmentStatus":
      return {
        viewName:
          ViewName.PLATFORM_ACTION_SESSIONS_BY_ENVIRONMENT_STATUS_AND_UPDATED_AT,
        prefix,
        createFunc: () =>
          createSessionsByEnvironmentStatusAndUpdatedAtView(workspaceDb),
      }
  }
}

// Reconstructs the exact view key for a returned session doc, so callers can
// build a bookmark without the query layer having to thread raw CouchDB row
// keys back out.
export function getSessionKeysetKey({
  environment,
  status,
  doc,
}: {
  environment?: PlatformActionEnvironment
  status?: PlatformActionContainerStatus
  doc: PlatformActionSessionIndexDoc
}): DatabaseKey {
  const prefix = scopePrefix(resolveSessionsScope({ environment, status }))
  return prefix.length > 0 ? [...prefix, doc.updatedAt] : doc.updatedAt
}

export const querySessions = async ({
  workspaceDb,
  environment,
  status,
  limit,
  bookmark,
  direction,
}: {
  workspaceDb: Database
  environment?: PlatformActionEnvironment
  status?: PlatformActionContainerStatus
  limit: number
  bookmark?: KeysetPosition
  direction: KeysetBookmarkDirection
}): Promise<KeysetPage<PlatformActionSessionIndexDoc>> => {
  const scope = resolveSessionsScope({ environment, status })
  const { viewName, prefix, createFunc } = resolveSessionsView(
    scope,
    workspaceDb
  )
  const descending = direction === "next"
  const params = buildKeysetParams({ prefix, bookmark, descending })
  return fetchKeysetPage<PlatformActionSessionIndexDoc>({
    viewName,
    params,
    workspaceDb,
    createFunc,
    limit,
    reverseResult: direction === "prev",
  })
}

// indexed status counts - one bounded exact-key lookup per status, not a
// full-database scan

async function queryCount({
  viewName,
  key,
  workspaceDb,
  createFunc,
}: {
  viewName: ViewName
  key: DatabaseKey
  workspaceDb: Database
  createFunc: () => Promise<void>
}): Promise<number> {
  const value = (await db.queryView(
    viewName,
    { key, include_docs: false },
    workspaceDb,
    createFunc
  )) as number | undefined
  return value ?? 0
}

export type SessionsStatusCounts = Record<PlatformActionContainerStatus, number>

export const querySessionsStatusCounts = async ({
  workspaceDb,
  environment,
}: {
  workspaceDb: Database
  environment?: PlatformActionEnvironment
}): Promise<SessionsStatusCounts> => {
  const counts = {} as SessionsStatusCounts
  await Promise.all(
    PLATFORM_ACTION_CONTAINER_STATUSES.map(async status => {
      counts[status] = environment
        ? await queryCount({
            viewName:
              ViewName.PLATFORM_ACTION_SESSIONS_ENVIRONMENT_STATUS_COUNTS,
            key: [environment, status],
            workspaceDb,
            createFunc: () =>
              createSessionsByEnvironmentStatusCountsView(workspaceDb),
          })
        : await queryCount({
            viewName: ViewName.PLATFORM_ACTION_SESSIONS_STATUS_COUNTS,
            key: status,
            workspaceDb,
            createFunc: () => createSessionsStatusCountsView(workspaceDb),
          })
    })
  )
  return counts
}

// keyset pagination - events within a single session

export function getEventKeysetKey(doc: PlatformActionEvent): DatabaseKey {
  return [doc.environment, doc.sourceType, doc.sourceId, doc.timestamp]
}

export const queryEvents = async ({
  workspaceDb,
  environment,
  sourceType,
  sourceId,
  limit,
  bookmark,
  direction,
}: {
  workspaceDb: Database
  environment: PlatformActionEnvironment
  sourceType: PlatformActionSourceType
  sourceId: string
  limit: number
  bookmark?: KeysetPosition
  direction: KeysetBookmarkDirection
}): Promise<KeysetPage<PlatformActionEvent>> => {
  const prefix: DatabaseKey[] = [environment, sourceType, sourceId]
  // Events display oldest-first, the opposite of the sessions list, so the
  // "next"/descending mapping used for sessions is flipped here.
  const descending = direction === "prev"
  const params = buildKeysetParams({ prefix, bookmark, descending })
  return fetchKeysetPage<PlatformActionEvent>({
    viewName: ViewName.PLATFORM_ACTION_EVENTS_BY_SESSION,
    params,
    workspaceDb,
    createFunc: () => createEventsBySessionView(workspaceDb),
    limit,
    reverseResult: direction === "prev",
  })
}

export const queryEventsTotal = async ({
  workspaceDb,
  environment,
  sourceType,
  sourceId,
}: {
  workspaceDb: Database
  environment: PlatformActionEnvironment
  sourceType: PlatformActionSourceType
  sourceId: string
}): Promise<number> => {
  return queryCount({
    viewName: ViewName.PLATFORM_ACTION_EVENTS_COUNT_BY_SESSION,
    key: [environment, sourceType, sourceId],
    workspaceDb,
    createFunc: () => createEventsCountBySessionView(workspaceDb),
  })
}
