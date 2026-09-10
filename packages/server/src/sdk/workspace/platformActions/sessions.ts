import type {
  ActionsPagination,
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"
import {
  decodeSessionBookmark,
  encodeSessionBookmark,
  type SessionBookmarkDirection,
} from "./bookmarks"
import { getWorkspaceDbForEnvironment } from "./environment"
import {
  querySessionsByStatusAndUpdatedAt,
  querySessionsByUpdatedAt,
  type SessionsPage,
} from "./views"

export interface SessionsPageResult {
  sessions: PlatformActionSessionIndexDoc[]
  pagination: ActionsPagination
}

function buildPagination(
  page: SessionsPage,
  direction: SessionBookmarkDirection,
  hadBookmark: boolean
): ActionsPagination {
  const first = page.items[0]
  const last = page.items[page.items.length - 1]

  const hasNextPage = direction === "prev" ? true : page.hasMore
  const hasPreviousPage = direction === "next" ? hadBookmark : page.hasMore

  return {
    hasNextPage,
    hasPreviousPage,
    nextBookmark:
      hasNextPage && last
        ? encodeSessionBookmark({
            direction: "next",
            key: last.updatedAt,
            id: last._id!,
          })
        : undefined,
    previousBookmark:
      hasPreviousPage && first
        ? encodeSessionBookmark({
            direction: "prev",
            key: first.updatedAt,
            id: first._id!,
          })
        : undefined,
  }
}

export async function fetchSessions({
  environment,
  status,
  bookmark,
  limit,
}: {
  environment: PlatformActionEnvironment
  status?: PlatformActionContainerStatus
  bookmark?: string
  limit: number
}): Promise<SessionsPageResult> {
  const workspaceDb = getWorkspaceDbForEnvironment(environment)
  const decoded = bookmark ? decodeSessionBookmark(bookmark) : undefined
  const direction = decoded?.direction ?? "next"

  const page = status
    ? await querySessionsByStatusAndUpdatedAt({
        workspaceDb,
        status,
        limit,
        bookmark: decoded,
        direction,
      })
    : await querySessionsByUpdatedAt({
        workspaceDb,
        limit,
        bookmark: decoded,
        direction,
      })

  return {
    sessions: page.items,
    pagination: buildPagination(page, direction, !!decoded),
  }
}
