import { HTTPError } from "@budibase/backend-core"

export type SessionBookmarkDirection = "next" | "prev"

export interface SessionBookmark {
  direction: SessionBookmarkDirection
  key: string
  id: string
}

export function encodeSessionBookmark(bookmark: SessionBookmark): string {
  return Buffer.from(JSON.stringify(bookmark), "utf-8").toString("base64url")
}

export function decodeSessionBookmark(token: string): SessionBookmark {
  let parsed
  try {
    parsed = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"))
  } catch {
    throw new HTTPError("Invalid bookmark", 400)
  }

  if (
    !parsed ||
    (parsed.direction !== "next" && parsed.direction !== "prev") ||
    typeof parsed.key !== "string" ||
    typeof parsed.id !== "string"
  ) {
    throw new HTTPError("Invalid bookmark", 400)
  }

  return { direction: parsed.direction, key: parsed.key, id: parsed.id }
}

// One environment's keyset resume point within a combined (env-omitted)
// fetch - same shape as SessionBookmark's single position above, plus inclusive
export interface CombinedKeysetPosition {
  key: string
  id: string
  // Whether the row at key/id is itself returned when resuming from here
  // (true), or skipped so only rows after it come back (false/absent).
  inclusive?: boolean
}

// The opaque bookmark for a combined (env-omitted) fetch: one resume
// position per environment (null if that side hasn't contributed to any
// page yet), instead of SessionBookmark's single position for one DB.
export interface CombinedSessionBookmark {
  direction: SessionBookmarkDirection
  prod: CombinedKeysetPosition | null
  dev: CombinedKeysetPosition | null
}

// "Keyset" = resuming a query from an exact row (its sort key + doc id)
// instead of counting/skipping N rows like offset pagination does.
function isKeysetPosition(value: unknown): value is CombinedKeysetPosition {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { key: unknown }).key === "string" &&
    typeof (value as { id: unknown }).id === "string" &&
    ((value as { inclusive: unknown }).inclusive === undefined ||
      typeof (value as { inclusive: unknown }).inclusive === "boolean")
  )
}

export function encodeCombinedSessionBookmark(
  bookmark: CombinedSessionBookmark
): string {
  return Buffer.from(JSON.stringify(bookmark), "utf-8").toString("base64url")
}

export function decodeCombinedSessionBookmark(
  token: string
): CombinedSessionBookmark {
  let parsed
  try {
    parsed = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"))
  } catch {
    throw new HTTPError("Invalid bookmark", 400)
  }

  if (
    !parsed ||
    (parsed.direction !== "next" && parsed.direction !== "prev") ||
    (parsed.prod !== null && !isKeysetPosition(parsed.prod)) ||
    (parsed.dev !== null && !isKeysetPosition(parsed.dev))
  ) {
    throw new HTTPError("Invalid bookmark", 400)
  }

  return { direction: parsed.direction, prod: parsed.prod, dev: parsed.dev }
}
