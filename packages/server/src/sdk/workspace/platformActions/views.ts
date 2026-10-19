import { db, events, HTTPError, ViewName } from "@budibase/backend-core"
import type {
  Database,
  DatabaseKey,
  DatabaseQueryOpts,
  Document,
  PlatformActionSessionStatus,
  PlatformActionEnvironment,
  PlatformActionEvent,
  PlatformActionSessionIndexDoc,
  PlatformActionSourceType,
} from "@budibase/types"
import {
  DocumentType,
  PLATFORM_ACTION_SESSION_STATUSES,
  SEPARATOR,
} from "@budibase/types"
import type { KeysetBookmarkDirection, KeysetPosition } from "./pagination"
import { EXPIRABLE_STATUSES, isExpiredSession } from "./retention"

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

const createActionsView = async ({
  workspaceDb,
  map,
  viewName,
  reduce,
}: {
  workspaceDb: Database
  map: string
  viewName: ViewName
  reduce?: string
}): Promise<void> => {
  const created = await events.platformActions.doWithExistingActionsWorkspace(
    () => db.createView(workspaceDb, map, viewName, reduce)
  )
  if (!created) {
    throw new HTTPError("Workspace not found", 404)
  }
}

export const createSessionsByUpdatedAtView = async (workspaceDb: Database) => {
  await createActionsView({
    workspaceDb,
    map: buildSessionsByUpdatedAtView(),
    viewName: ViewName.PLATFORM_ACTION_SESSIONS_BY_UPDATED_AT,
  })
}

export const createSessionsByStatusAndUpdatedAtView = async (
  workspaceDb: Database
) => {
  await createActionsView({
    workspaceDb,
    map: buildSessionsByStatusAndUpdatedAtView(),
    viewName: ViewName.PLATFORM_ACTION_SESSIONS_BY_STATUS_AND_UPDATED_AT,
    reduce: "_count",
  })
}

export const createSessionsByEnvironmentAndUpdatedAtView = async (
  workspaceDb: Database
) => {
  await createActionsView({
    workspaceDb,
    map: buildSessionsByEnvironmentAndUpdatedAtView(),
    viewName: ViewName.PLATFORM_ACTION_SESSIONS_BY_ENVIRONMENT_AND_UPDATED_AT,
  })
}

export const createSessionsByEnvironmentStatusAndUpdatedAtView = async (
  workspaceDb: Database
) => {
  await createActionsView({
    workspaceDb,
    map: buildSessionsByEnvironmentStatusAndUpdatedAtView(),
    viewName:
      ViewName.PLATFORM_ACTION_SESSIONS_BY_ENVIRONMENT_STATUS_AND_UPDATED_AT,
    reduce: "_count",
  })
}

export const createEventsBySessionView = async (workspaceDb: Database) => {
  await createActionsView({
    workspaceDb,
    map: buildEventsBySessionView(),
    viewName: ViewName.PLATFORM_ACTION_EVENTS_BY_SESSION,
    reduce: "_count",
  })
}

// keyset pagination - sessions

export interface KeysetPage<T> {
  items: T[]
  hasMore: boolean
}

async function fetchKeysetPage<T extends Document>({
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
  const hasBookmark = params.startkey_docid !== undefined
  const response = await db.queryViewRaw<T>(
    viewName,
    {
      ...params,
      reduce: false,
      include_docs: true,
      limit: limit + 1 + Number(hasBookmark),
    },
    workspaceDb,
    createFunc
  )
  // An updated anchor may appear anywhere in the returned range.
  const rows = hasBookmark
    ? response.rows.filter(row => row.id !== params.startkey_docid)
    : response.rows

  const hasMore = rows.length > limit
  const page = rows.slice(0, limit).map(row => row.doc!)
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

// Returns undefined when the bookmark is already past the lower bound, so
// there is nothing left to read in that direction
function buildKeysetParams({
  prefix,
  bookmark,
  descending,
  lowerBound,
}: {
  prefix: DatabaseKey[]
  bookmark?: KeysetPosition
  descending: boolean
  // Inclusive lower bound for the trailing key, requires a prefix
  lowerBound?: string
}): DatabaseQueryOpts | undefined {
  const params: DatabaseQueryOpts = { descending }
  const lowest = lowerBound === undefined ? prefix : [...prefix, lowerBound]
  if (prefix.length > 0) {
    params.endkey = descending ? lowest : [...prefix, {}]
  }
  if (bookmark) {
    if (!isValidBookmarkKey(bookmark.key, prefix) || !bookmark.id) {
      throw new HTTPError("Invalid bookmark for this query", 400)
    }
    const trailing = Array.isArray(bookmark.key)
      ? bookmark.key[prefix.length]
      : bookmark.key
    if (
      lowerBound !== undefined &&
      typeof trailing === "string" &&
      trailing < lowerBound
    ) {
      if (descending) {
        return undefined
      }
      params.startkey = lowest
      return params
    }
    params.startkey = bookmark.key
    params.startkey_docid = bookmark.id
  } else if (prefix.length > 0) {
    params.startkey = descending ? [...prefix, {}] : lowest
  }
  return params
}

type SessionsViewScope =
  | { kind: "all" }
  | { kind: "status"; status: PlatformActionSessionStatus }
  | { kind: "environment"; environment: PlatformActionEnvironment }
  | {
      kind: "environmentStatus"
      environment: PlatformActionEnvironment
      status: PlatformActionSessionStatus
    }

function resolveSessionsScope({
  environment,
  status,
}: {
  environment?: PlatformActionEnvironment
  status?: PlatformActionSessionStatus
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
  status?: PlatformActionSessionStatus
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
  cutoff,
}: {
  workspaceDb: Database
  environment?: PlatformActionEnvironment
  status?: PlatformActionSessionStatus
  limit: number
  bookmark?: KeysetPosition
  direction: KeysetBookmarkDirection
  cutoff?: string
}): Promise<KeysetPage<PlatformActionSessionIndexDoc>> => {
  const scope = resolveSessionsScope({ environment, status })
  if (!status && cutoff !== undefined) {
    const prefix = scopePrefix(scope)
    if (
      bookmark &&
      (!isValidBookmarkKey(bookmark.key, prefix) || !bookmark.id)
    ) {
      throw new HTTPError("Invalid bookmark for this query", 400)
    }
    const timestamp = Array.isArray(bookmark?.key)
      ? bookmark.key[prefix.length]
      : bookmark?.key
    // Read bounded streams of eligible sessions, not pages of expired rows.
    // Each stream uses the same timestamp/id anchor and global ordering.
    const pages = await Promise.all(
      PLATFORM_ACTION_SESSION_STATUSES.map(status => {
        const statusPrefix = scopePrefix(
          resolveSessionsScope({ environment, status })
        )
        return querySessions({
          workspaceDb,
          environment,
          status,
          cutoff,
          limit,
          direction,
          bookmark: bookmark
            ? { id: bookmark.id, key: [...statusPrefix, timestamp!] }
            : undefined,
        })
      })
    )
    const descending = direction === "next"
    const sessionsById = new Map<string, PlatformActionSessionIndexDoc>()
    // Independent status reads can observe different revisions of one session.
    for (const session of pages.flatMap(page => page.items)) {
      const existing = sessionsById.get(session._id!)
      if (
        !existing ||
        session.updatedAt > existing.updatedAt ||
        (session.updatedAt === existing.updatedAt &&
          Number.parseInt(session._rev ?? "0", 10) >
            Number.parseInt(existing._rev ?? "0", 10))
      ) {
        sessionsById.set(session._id!, session)
      }
    }
    const items = [...sessionsById.values()].sort((a, b) => {
      const aKey = a.updatedAt === b.updatedAt ? a._id! : a.updatedAt
      const bKey = a.updatedAt === b.updatedAt ? b._id! : b.updatedAt
      if (aKey === bKey) {
        return 0
      }
      const comparison = aKey < bKey ? -1 : 1
      return descending ? -comparison : comparison
    })
    const page = items.slice(0, limit)
    return {
      items: descending ? page : page.reverse(),
      hasMore: items.length > limit || pages.some(page => page.hasMore),
    }
  }
  const { viewName, prefix, createFunc } = resolveSessionsView(
    scope,
    workspaceDb
  )
  const descending = direction === "next"
  const params = buildKeysetParams({
    prefix,
    bookmark,
    descending,
    lowerBound:
      status && EXPIRABLE_STATUSES.includes(status) ? cutoff : undefined,
  })
  if (!params) {
    return { items: [], hasMore: false }
  }
  return fetchKeysetPage<PlatformActionSessionIndexDoc>({
    viewName,
    params,
    workspaceDb,
    createFunc,
    limit,
    reverseResult: direction === "prev",
  })
}

// Indexed counts over bounded key ranges.

async function queryCount({
  viewName,
  prefix,
  lowerBound,
  workspaceDb,
  createFunc,
}: {
  viewName: ViewName
  prefix: DatabaseKey[]
  lowerBound?: string
  workspaceDb: Database
  createFunc: () => Promise<void>
}): Promise<number> {
  const value = (await db.queryView(
    viewName,
    {
      startkey: lowerBound === undefined ? prefix : [...prefix, lowerBound],
      endkey: [...prefix, {}],
      reduce: true,
      include_docs: false,
    },
    workspaceDb,
    createFunc
  )) as number | undefined
  return value ?? 0
}

export type SessionsStatusCounts = Record<PlatformActionSessionStatus, number>

export const querySessionsStatusCounts = async ({
  workspaceDb,
  environment,
  cutoff,
}: {
  workspaceDb: Database
  environment?: PlatformActionEnvironment
  cutoff?: string
}): Promise<SessionsStatusCounts> => {
  const counts: SessionsStatusCounts = {
    active: 0,
    waiting: 0,
    completed: 0,
    failed: 0,
  }
  const viewName = environment
    ? ViewName.PLATFORM_ACTION_SESSIONS_BY_ENVIRONMENT_STATUS_AND_UPDATED_AT
    : ViewName.PLATFORM_ACTION_SESSIONS_BY_STATUS_AND_UPDATED_AT
  const createFunc = () =>
    environment
      ? createSessionsByEnvironmentStatusAndUpdatedAtView(workspaceDb)
      : createSessionsByStatusAndUpdatedAtView(workspaceDb)
  const response = await db.queryViewRaw(
    viewName,
    {
      reduce: true,
      include_docs: false,
      group_level: environment ? 2 : 1,
      ...(environment
        ? { startkey: [environment], endkey: [environment, {}] }
        : {}),
    },
    workspaceDb,
    createFunc
  )
  for (const { key, value } of response.rows) {
    if (Array.isArray(key) && typeof value === "number") {
      const status = PLATFORM_ACTION_SESSION_STATUSES.find(
        status => status === key[environment ? 1 : 0]
      )
      if (status) {
        counts[status] = value
      }
    }
  }
  if (cutoff !== undefined) {
    const prefix: DatabaseKey[] = environment ? [environment] : []
    await Promise.all(
      EXPIRABLE_STATUSES.map(async status => {
        counts[status] = await queryCount({
          viewName,
          prefix: [...prefix, status],
          lowerBound: cutoff,
          workspaceDb,
          createFunc,
        })
      })
    )
  }
  return counts
}

// retention - expired terminal sessions, oldest first, across environments

export interface ExpiredSessionCursor {
  updatedAt: string
  id: string
}

export const queryExpiredSessions = async ({
  workspaceDb,
  cutoff,
  limit,
  after,
}: {
  workspaceDb: Database
  cutoff: string
  limit: number
  after?: ExpiredSessionCursor
}): Promise<PlatformActionSessionIndexDoc[]> => {
  const pages = await Promise.all(
    EXPIRABLE_STATUSES.map(status =>
      db.queryViewRaw<PlatformActionSessionIndexDoc>(
        ViewName.PLATFORM_ACTION_SESSIONS_BY_STATUS_AND_UPDATED_AT,
        {
          startkey: after ? [status, after.updatedAt] : [status],
          ...(after ? { startkey_docid: after.id } : {}),
          endkey: [status, cutoff],
          reduce: false,
          include_docs: true,
          limit: limit + 1,
        },
        workspaceDb,
        () => createSessionsByStatusAndUpdatedAtView(workspaceDb)
      )
    )
  )
  return pages
    .flatMap(page => page.rows.map(row => row.doc!))
    .filter(session => isExpiredSession({ session, cutoff }))
    .filter(
      session =>
        !after ||
        session.updatedAt > after.updatedAt ||
        (session.updatedAt === after.updatedAt && session._id! > after.id)
    )
    .sort((a, b) => {
      const byDate = a.updatedAt.localeCompare(b.updatedAt)
      if (byDate || a._id === b._id) return byDate
      return a._id! < b._id! ? -1 : 1
    })
    .slice(0, limit)
}

export const hasRecentEvents = async ({
  workspaceDb,
  environment,
  sourceType,
  sourceId,
  cutoff,
}: {
  workspaceDb: Database
  environment: PlatformActionEnvironment
  sourceType: PlatformActionSourceType
  sourceId: string
  cutoff: string
}): Promise<boolean> => {
  const prefix: DatabaseKey[] = [environment, sourceType, sourceId]
  const response = await db.queryViewRaw(
    ViewName.PLATFORM_ACTION_EVENTS_BY_SESSION,
    {
      startkey: [...prefix, cutoff],
      endkey: [...prefix, {}],
      reduce: false,
      include_docs: false,
      limit: 1,
    },
    workspaceDb,
    () => createEventsBySessionView(workspaceDb)
  )
  return response.rows.length > 0
}

export const queryExpiredEvents = async ({
  workspaceDb,
  environment,
  sourceType,
  sourceId,
  cutoff,
  limit,
}: {
  workspaceDb: Database
  environment: PlatformActionEnvironment
  sourceType: PlatformActionSourceType
  sourceId: string
  cutoff: string
  limit: number
}): Promise<PlatformActionEvent[]> => {
  const prefix: DatabaseKey[] = [environment, sourceType, sourceId]
  const response = await db.queryViewRaw<PlatformActionEvent>(
    ViewName.PLATFORM_ACTION_EVENTS_BY_SESSION,
    {
      startkey: prefix,
      endkey: [...prefix, cutoff],
      reduce: false,
      include_docs: true,
      limit,
    },
    workspaceDb,
    () => createEventsBySessionView(workspaceDb)
  )
  return response.rows
    .map(row => row.doc!)
    .filter(event => event.timestamp < cutoff)
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
  if (!params) {
    return { items: [], hasMore: false }
  }
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
    viewName: ViewName.PLATFORM_ACTION_EVENTS_BY_SESSION,
    prefix: [environment, sourceType, sourceId],
    workspaceDb,
    createFunc: () => createEventsBySessionView(workspaceDb),
  })
}
