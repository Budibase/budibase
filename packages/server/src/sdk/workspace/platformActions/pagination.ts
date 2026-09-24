import type { ActionsPagination, DatabaseKey } from "@budibase/types"
import type { KeysetBookmarkDirection } from "./bookmarks"
import { encodeKeysetBookmark } from "./bookmarks"

export function buildPagination<T>({
  items,
  hasMore,
  direction,
  hadBookmark,
  keyOf,
  idOf,
}: {
  items: T[]
  hasMore: boolean
  direction: KeysetBookmarkDirection
  // Whether the request carried an incoming bookmark, i.e. this isn't the
  // very first page.
  hadBookmark: boolean
  keyOf: (item: T) => DatabaseKey
  idOf: (item: T) => string
}): ActionsPagination {
  if (items.length === 0) {
    return { hasNextPage: false, hasPreviousPage: false }
  }

  const first = items[0]
  const last = items[items.length - 1]

  // Paging backward always has a page ahead (the one navigated from).
  // Paging forward past the first page always has a page behind it. Only the
  // "forward" direction's hasNextPage and the "backward" direction's
  // hasPreviousPage come from the real limit+1 probe.
  const hasNextPage = direction === "next" ? hasMore : true
  const hasPreviousPage = direction === "prev" ? hasMore : hadBookmark

  return {
    hasNextPage,
    hasPreviousPage,
    ...(hasNextPage && last
      ? {
          nextBookmark: encodeKeysetBookmark({
            direction: "next",
            key: keyOf(last),
            id: idOf(last),
          }),
        }
      : {}),
    ...(hasPreviousPage && first
      ? {
          previousBookmark: encodeKeysetBookmark({
            direction: "prev",
            key: keyOf(first),
            id: idOf(first),
          }),
        }
      : {}),
  }
}
