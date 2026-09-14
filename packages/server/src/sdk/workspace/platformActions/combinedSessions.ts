import type {
  ActionsPagination,
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"
import {
  decodeCombinedSessionBookmark,
  encodeCombinedSessionBookmark,
  type SessionBookmarkDirection,
} from "./bookmarks"
import { getWorkspaceDbForEnvironment } from "./environment"
import { querySessionsCandidates, type SessionKeysetBookmark } from "./views"

interface EnvTaggedSession {
  session: PlatformActionSessionIndexDoc
  env: PlatformActionEnvironment
}

// Descending display order (newest first). Returns -1 or 1, never 0. Ties
// put prod first, then use descending `_id` to match the view order.
function compareDisplayOrder(a: EnvTaggedSession, b: EnvTaggedSession): number {
  if (a.session.updatedAt !== b.session.updatedAt) {
    return a.session.updatedAt < b.session.updatedAt ? 1 : -1
  }
  if (a.env !== b.env) {
    return a.env === "prod" ? -1 : 1
  }
  return a.session._id! < b.session._id! ? 1 : -1
}

// A side with zero fetched candidates hasn't advanced past `incoming`
// reopen it (`inclusive`) on `prev` so that row isn't lost going backward.
// A side that fetched candidates but lost them all to the trim has already
// moved past `incoming`, so carry it forward unchanged instead.
function resumePosition(
  page: EnvTaggedSession[],
  environment: PlatformActionEnvironment,
  incoming: SessionKeysetBookmark | null,
  edge: "next" | "prev",
  hadCandidates: boolean
): SessionKeysetBookmark | null {
  const items = page.filter(p => p.env === environment)
  if (items.length === 0) {
    return edge === "prev" && incoming && !hadCandidates
      ? { ...incoming, inclusive: true }
      : incoming
  }
  const chosen = edge === "prev" ? items[0] : items[items.length - 1]
  return { key: chosen.session.updatedAt, id: chosen.session._id! }
}

function buildCombinedPagination({
  page,
  hasMore,
  direction,
  hadBookmark,
  incomingProd,
  incomingDev,
  hadProdCandidates,
  hadDevCandidates,
}: {
  page: EnvTaggedSession[]
  hasMore: boolean
  direction: SessionBookmarkDirection
  hadBookmark: boolean
  incomingProd: SessionKeysetBookmark | null
  incomingDev: SessionKeysetBookmark | null
  hadProdCandidates: boolean
  hadDevCandidates: boolean
}): ActionsPagination {
  // Same inference as the single-environment case: a "prev" navigation
  // always has a next page (we came from further-ahead content); a "next"
  // navigation past the very first page always has a previous page.
  const hasNextPage = direction === "prev" ? true : hasMore
  const hasPreviousPage = direction === "next" ? hadBookmark : hasMore

  return {
    hasNextPage,
    hasPreviousPage,
    nextBookmark: hasNextPage
      ? encodeCombinedSessionBookmark({
          direction: "next",
          prod: resumePosition(
            page,
            "prod",
            incomingProd,
            "next",
            hadProdCandidates
          ),
          dev: resumePosition(
            page,
            "dev",
            incomingDev,
            "next",
            hadDevCandidates
          ),
        })
      : undefined,
    previousBookmark: hasPreviousPage
      ? encodeCombinedSessionBookmark({
          direction: "prev",
          prod: resumePosition(
            page,
            "prod",
            incomingProd,
            "prev",
            hadProdCandidates
          ),
          dev: resumePosition(
            page,
            "dev",
            incomingDev,
            "prev",
            hadDevCandidates
          ),
        })
      : undefined,
  }
}

export async function fetchCombinedSessions({
  status,
  bookmark,
  limit,
}: {
  status?: PlatformActionContainerStatus
  bookmark?: string
  limit: number
}): Promise<{
  sessions: (PlatformActionSessionIndexDoc & {
    environment: PlatformActionEnvironment
  })[]
  pagination: ActionsPagination
}> {
  const decoded = bookmark ? decodeCombinedSessionBookmark(bookmark) : undefined
  const direction: SessionBookmarkDirection = decoded?.direction ?? "next"
  const incomingProd = decoded?.prod ?? null
  const incomingDev = decoded?.dev ?? null

  const candidateLimit = limit + 1
  const [prodCandidates, devCandidates] = await Promise.all([
    querySessionsCandidates({
      workspaceDb: getWorkspaceDbForEnvironment("prod"),
      status,
      candidateLimit,
      bookmark: incomingProd ?? undefined,
      direction,
    }),
    querySessionsCandidates({
      workspaceDb: getWorkspaceDbForEnvironment("dev"),
      status,
      candidateLimit,
      bookmark: incomingDev ?? undefined,
      direction,
    }),
  ])

  const tagged: EnvTaggedSession[] = [
    ...prodCandidates.map(session => ({
      session,
      env: "prod" as const,
    })),
    ...devCandidates.map(session => ({
      session,
      env: "dev" as const,
    })),
  ]

  // Raw candidates come back in natural fetch order per side (descending
  // for "next", ascending for "prev"). Merge in that same natural order so
  // slicing the first `limit` picks the true closest-to-bookmark items
  // across both sides, then flip to descending display order for "prev".
  tagged.sort((a, b) =>
    direction === "prev"
      ? -compareDisplayOrder(a, b)
      : compareDisplayOrder(a, b)
  )

  const hasMore = tagged.length > limit
  const trimmed = tagged.slice(0, limit)
  const page = direction === "prev" ? trimmed.reverse() : trimmed

  return {
    sessions: page.map(({ session, env }) => ({
      ...session,
      environment: env,
    })),
    pagination: buildCombinedPagination({
      page,
      hasMore,
      direction,
      hadBookmark: !!decoded,
      incomingProd,
      incomingDev,
      hadProdCandidates: prodCandidates.length > 0,
      hadDevCandidates: devCandidates.length > 0,
    }),
  }
}
