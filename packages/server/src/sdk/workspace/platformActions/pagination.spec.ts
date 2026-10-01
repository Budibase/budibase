import { decodeKeysetBookmark } from "./bookmarks"
import { buildPagination } from "./pagination"

describe("platformActions pagination", () => {
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
