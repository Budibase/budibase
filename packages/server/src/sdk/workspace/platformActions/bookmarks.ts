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
