import { db, ViewName } from "@budibase/backend-core"
import type {
  Database,
  DatabaseQueryOpts,
  PlatformActionContainerStatus,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"
import { DocumentType, SEPARATOR } from "@budibase/types"

const SESSIONS_BY_UPDATED_AT_VIEW =
  ViewName.PLATFORM_ACTION_SESSIONS_BY_UPDATED_AT
const SESSIONS_BY_STATUS_AND_UPDATED_AT_VIEW =
  ViewName.PLATFORM_ACTION_SESSIONS_BY_STATUS_AND_UPDATED_AT

const SESSION_ID_PREFIX = `${DocumentType.PLATFORM_ACTION_SESSION}${SEPARATOR}`

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

export const createSessionsByUpdatedAtView = async (workspaceDb: Database) => {
  await db.createView(
    workspaceDb,
    buildSessionsByUpdatedAtView(),
    SESSIONS_BY_UPDATED_AT_VIEW
  )
}

export const createSessionsByStatusAndUpdatedAtView = async (
  workspaceDb: Database
) => {
  await db.createView(
    workspaceDb,
    buildSessionsByStatusAndUpdatedAtView(),
    SESSIONS_BY_STATUS_AND_UPDATED_AT_VIEW
  )
}

export interface SessionKeysetBookmark {
  key: string
  id: string
  // Only used by the cross-environment merge, to re-open a boundary row
  // that a non-contributing side needs to reconsider when reversing
  // direction. Absent/false keeps the normal exclusive resume behavior every
  // single-environment caller relies on.
  inclusive?: boolean
}

export interface SessionsPage {
  items: PlatformActionSessionIndexDoc[]
  hasMore: boolean
}

async function fetchKeysetPage(
  viewName: ViewName,
  params: DatabaseQueryOpts,
  workspaceDb: Database,
  createFunc: () => Promise<void>,
  limit: number,
  reverseResult: boolean
): Promise<SessionsPage> {
  const rows = (await db.queryView<PlatformActionSessionIndexDoc>(
    viewName,
    { ...params, include_docs: true, limit: limit + 1 },
    workspaceDb,
    createFunc,
    { arrayResponse: true }
  )) as PlatformActionSessionIndexDoc[]

  const hasMore = rows.length > limit
  const page = rows.slice(0, limit)
  return { items: reverseResult ? page.reverse() : page, hasMore }
}

function buildUpdatedAtParams(
  bookmark: SessionKeysetBookmark | undefined,
  descending: boolean
): DatabaseQueryOpts {
  const params: DatabaseQueryOpts = { descending }
  if (bookmark) {
    params.startkey = bookmark.key
    params.startkey_docid = bookmark.id
    if (!bookmark.inclusive) {
      params.skip = 1
    }
  }
  return params
}

function buildStatusParams(
  status: PlatformActionContainerStatus,
  bookmark: SessionKeysetBookmark | undefined,
  descending: boolean
): DatabaseQueryOpts {
  const params: DatabaseQueryOpts = {
    descending,
    endkey: descending ? [status] : [status, {}],
  }
  if (bookmark) {
    params.startkey = [status, bookmark.key]
    params.startkey_docid = bookmark.id
    if (!bookmark.inclusive) {
      params.skip = 1
    }
  } else {
    params.startkey = descending ? [status, {}] : [status]
  }
  return params
}

function resolveViewQuery(
  status: PlatformActionContainerStatus | undefined,
  bookmark: SessionKeysetBookmark | undefined,
  descending: boolean,
  workspaceDb: Database
): {
  viewName: ViewName
  params: DatabaseQueryOpts
  createFunc: () => Promise<void>
} {
  if (status) {
    return {
      viewName: SESSIONS_BY_STATUS_AND_UPDATED_AT_VIEW,
      params: buildStatusParams(status, bookmark, descending),
      createFunc: () => createSessionsByStatusAndUpdatedAtView(workspaceDb),
    }
  }
  return {
    viewName: SESSIONS_BY_UPDATED_AT_VIEW,
    params: buildUpdatedAtParams(bookmark, descending),
    createFunc: () => createSessionsByUpdatedAtView(workspaceDb),
  }
}

export const querySessionsByUpdatedAt = async ({
  workspaceDb,
  limit,
  bookmark,
  direction,
}: {
  workspaceDb: Database
  limit: number
  bookmark?: SessionKeysetBookmark
  direction: "next" | "prev"
}): Promise<SessionsPage> => {
  const { viewName, params, createFunc } = resolveViewQuery(
    undefined,
    bookmark,
    direction === "next",
    workspaceDb
  )
  return fetchKeysetPage(
    viewName,
    params,
    workspaceDb,
    createFunc,
    limit,
    direction === "prev"
  )
}

export const querySessionsByStatusAndUpdatedAt = async ({
  workspaceDb,
  status,
  limit,
  bookmark,
  direction,
}: {
  workspaceDb: Database
  status: PlatformActionContainerStatus
  limit: number
  bookmark?: SessionKeysetBookmark
  direction: "next" | "prev"
}): Promise<SessionsPage> => {
  const { viewName, params, createFunc } = resolveViewQuery(
    status,
    bookmark,
    direction === "next",
    workspaceDb
  )
  return fetchKeysetPage(
    viewName,
    params,
    workspaceDb,
    createFunc,
    limit,
    direction === "prev"
  )
}

// Raw, untrimmed/unreversed candidates for the cross-environment merge.
// Finalizing per source first would scramble cross-source ordering.
export const querySessionsCandidates = async ({
  workspaceDb,
  status,
  candidateLimit,
  bookmark,
  direction,
}: {
  workspaceDb: Database
  status?: PlatformActionContainerStatus
  candidateLimit: number
  bookmark?: SessionKeysetBookmark
  direction: "next" | "prev"
}): Promise<PlatformActionSessionIndexDoc[]> => {
  const { viewName, params, createFunc } = resolveViewQuery(
    status,
    bookmark,
    direction === "next",
    workspaceDb
  )
  return (await db.queryView<PlatformActionSessionIndexDoc>(
    viewName,
    { ...params, include_docs: true, limit: candidateLimit },
    workspaceDb,
    createFunc,
    { arrayResponse: true }
  )) as PlatformActionSessionIndexDoc[]
}
