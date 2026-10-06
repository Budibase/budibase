import { z } from "zod"
import { HTTPError } from "@budibase/backend-core"
import type { ActionsPagination, DatabaseKey } from "@budibase/types"

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export function resolveLimit(limit?: number): number {
  if (!limit || limit < 1) {
    return DEFAULT_LIMIT
  }
  return Math.min(Math.floor(limit), MAX_LIMIT)
}

export type KeysetBookmarkDirection = "next" | "prev"

export interface KeysetPosition {
  key: DatabaseKey
  id: string
}

// The public contract exposes a single opaque `bookmark` request field that
// serves both `nextBookmark` and `previousBookmark`. The direction to query
// is only known from the token itself, so it's encoded alongside the keyset
// position rather than passed as a separate request parameter.
export interface KeysetBookmarkToken extends KeysetPosition {
  direction: KeysetBookmarkDirection
}

const bookmarkSchema = z.object({
  direction: z.enum(["next", "prev"]),
  key: z.union([z.string(), z.array(z.string())]),
  id: z.string(),
})

export function encodeKeysetBookmark({
  direction,
  key,
  id,
}: KeysetBookmarkToken): string {
  return Buffer.from(JSON.stringify({ direction, key, id })).toString(
    "base64url"
  )
}

export function decodeKeysetBookmark(bookmark: string): KeysetBookmarkToken {
  try {
    return bookmarkSchema.parse(
      JSON.parse(Buffer.from(bookmark, "base64").toString("utf-8"))
    )
  } catch {
    throw new HTTPError("Invalid bookmark", 400)
  }
}

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
