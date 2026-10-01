import type { KeysetBookmarkToken } from "./bookmarks"
import { decodeKeysetBookmark, encodeKeysetBookmark } from "./bookmarks"

describe("platformActions bookmarks", () => {
  const tokens: KeysetBookmarkToken[] = [
    {
      direction: "next",
      key: "2026-09-25T00:00:00.000Z",
      id: "session/+%=\u083e\u083f",
    },
    {
      direction: "prev",
      key: [
        "prod",
        "agent_session",
        "run/a b%25\u00f1",
        "2026-09-25T00:00:00.000Z",
      ],
      id: "event/+%=\u083f\u083e",
    },
  ]

  it.each(tokens)(
    "round-trips a $direction bookmark with special characters",
    token => {
      expect(decodeKeysetBookmark(encodeKeysetBookmark(token))).toEqual(token)
    }
  )

  it.each(tokens)(
    "uses only the base64url alphabet for $direction bookmarks",
    token => {
      expect(encodeKeysetBookmark(token)).toMatch(/^[A-Za-z0-9_-]+$/)
    }
  )

  it.each(tokens)(
    "preserves a $direction bookmark in a query string",
    token => {
      const bookmark = encodeKeysetBookmark(token)
      const url = new URL(`https://example.com/actions?bookmark=${bookmark}`)

      expect(url.searchParams.get("bookmark")).toBe(bookmark)
      expect(decodeKeysetBookmark(url.searchParams.get("bookmark")!)).toEqual(
        token
      )
    }
  )
})
