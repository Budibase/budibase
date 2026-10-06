import { HTTPError } from "@budibase/backend-core"
import type { ActionsPagination, DatabaseKey } from "@budibase/types"

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

function isDirection(value: unknown): value is KeysetBookmarkDirection {
  return value === "next" || value === "prev"
}

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
  let parsed: { direction?: unknown; key?: DatabaseKey; id?: unknown }
  try {
    parsed = JSON.parse(Buffer.from(bookmark, "base64").toString("utf-8"))
  } catch {
    throw new HTTPError("Invalid bookmark", 400)
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !isDirection(parsed.direction) ||
    typeof parsed.id !== "string" ||
    parsed.key === undefined
  ) {
    throw new HTTPError("Invalid bookmark", 400)
  }

  return { direction: parsed.direction, key: parsed.key, id: parsed.id }
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
