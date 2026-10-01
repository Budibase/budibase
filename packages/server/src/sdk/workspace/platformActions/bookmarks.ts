import { HTTPError } from "@budibase/backend-core"
import type { DatabaseKey } from "@budibase/types"

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
