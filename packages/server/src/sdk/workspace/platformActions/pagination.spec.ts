import type { KeysetBookmarkToken } from "./pagination"
import {
  buildPagination,
  decodeKeysetBookmark,
  encodeKeysetBookmark,
} from "./pagination"

describe("platformActions pagination", () => {
  describe("bookmarks", () => {
    it.each([
      "",
      "not-json",
      "null",
      "[]",
      "{}",
      '{"direction":"invalid","key":"timestamp","id":"event-1"}',
      '{"direction":"next","key":"timestamp","id":42}',
      '{"direction":"next","id":"event-1"}',
      '{"direction":"next","key":null,"id":"event-1"}',
      '{"direction":"next","key":42,"id":"event-1"}',
      '{"direction":"next","key":{},"id":"event-1"}',
      '{"direction":"next","key":["prod",42],"id":"event-1"}',
      '{"direction":"next","key":[["prod"]],"id":"event-1"}',
    ])("rejects invalid bookmark content: %s", content => {
      const bookmark = Buffer.from(content).toString("base64url")

      expect(() => decodeKeysetBookmark(bookmark)).toThrow(
        expect.objectContaining({ status: 400, message: "Invalid bookmark" })
      )
    })

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

  it.each([
    { direction: "next" as const, hadBookmark: false },
    { direction: "next" as const, hadBookmark: true },
    { direction: "prev" as const, hadBookmark: true },
  ])(
    "returns no navigation for an empty page ($direction, hadBookmark=$hadBookmark)",
    ({ direction, hadBookmark }) => {
      const pagination = buildPagination<string>({
        items: [],
        hasMore: false,
        direction,
        hadBookmark,
        keyOf: item => item,
        idOf: item => item,
      })

      expect(pagination).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
      })
    }
  )

  it.each(["next", "prev"] as const)(
    "preserves usable bookmarks for a non-empty %s page",
    direction => {
      const pagination = buildPagination({
        items: ["first", "last"],
        hasMore: true,
        direction,
        hadBookmark: true,
        keyOf: item => item,
        idOf: item => item,
      })

      expect(pagination.hasNextPage).toBe(true)
      expect(pagination.hasPreviousPage).toBe(true)
      expect(decodeKeysetBookmark(pagination.nextBookmark!)).toEqual({
        direction: "next",
        key: "last",
        id: "last",
      })
      expect(decodeKeysetBookmark(pagination.previousBookmark!)).toEqual({
        direction: "prev",
        key: "first",
        id: "first",
      })
    }
  )
})
