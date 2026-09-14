import {
  decodeCombinedSessionBookmark,
  decodeSessionBookmark,
  encodeCombinedSessionBookmark,
  encodeSessionBookmark,
  type CombinedSessionBookmark,
  type SessionBookmark,
  type SessionBookmarkDirection,
} from "./bookmarks"

const position = {
  key: "2026-09-14T10:00:00.000Z",
  id: "platformactionsession_agent_session_1",
}

const encodePayload = (payload: unknown) =>
  Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url")

const invalidBookmarkError = expect.objectContaining({
  message: "Invalid bookmark",
  status: 400,
})

describe("session bookmarks", () => {
  it.each<SessionBookmarkDirection>(["next", "prev"])(
    "round-trips a %s bookmark without losing its position",
    direction => {
      const bookmark: SessionBookmark = { direction, ...position }
      expect(decodeSessionBookmark(encodeSessionBookmark(bookmark))).toEqual(
        bookmark
      )
    }
  )

  it.each([
    ["null", null],
    ["an array", []],
    ["a primitive", "next"],
    ["missing direction", position],
    ["invalid direction", { direction: "back", ...position }],
    ["missing key", { direction: "next", id: position.id }],
    ["missing id", { direction: "next", key: position.key }],
    ["non-string key", { direction: "next", ...position, key: 123 }],
    ["non-string id", { direction: "next", ...position, id: null }],
  ])("rejects %s with HTTP 400", (_label, payload) => {
    expect(() => decodeSessionBookmark(encodePayload(payload))).toThrow(
      invalidBookmarkError
    )
  })

  it("rejects a combined bookmark with HTTP 400", () => {
    const token = encodeCombinedSessionBookmark({
      direction: "next",
      prod: position,
      dev: null,
    })
    expect(() => decodeSessionBookmark(token)).toThrow(invalidBookmarkError)
  })
})

describe("combined session bookmarks", () => {
  it.each<CombinedSessionBookmark>([
    { direction: "next", prod: position, dev: position },
    {
      direction: "prev",
      prod: { ...position, inclusive: true },
      dev: { ...position, id: "dev_session", inclusive: false },
    },
    { direction: "next", prod: null, dev: position },
    { direction: "prev", prod: position, dev: null },
    { direction: "next", prod: null, dev: null },
  ])("round-trips $direction with prod=$prod and dev=$dev", bookmark => {
    expect(
      decodeCombinedSessionBookmark(encodeCombinedSessionBookmark(bookmark))
    ).toEqual(bookmark)
  })

  it.each([
    ["null", null],
    ["an array", []],
    ["a boolean primitive", true],
    ["missing direction", { prod: null, dev: null }],
    ["invalid direction", { direction: "back", prod: null, dev: null }],
    ["missing prod", { direction: "next", dev: null }],
    ["missing dev", { direction: "next", prod: null }],
  ])("rejects %s with HTTP 400", (_label, payload) => {
    expect(() => decodeCombinedSessionBookmark(encodePayload(payload))).toThrow(
      invalidBookmarkError
    )
  })

  describe.each(["prod", "dev"])("invalid %s positions", env => {
    it.each([
      ["a primitive", "position"],
      ["an array", []],
      ["missing key", { id: position.id }],
      ["missing id", { key: position.key }],
      ["non-string key", { ...position, key: 123 }],
      ["non-string id", { ...position, id: false }],
      ["non-boolean inclusive", { ...position, inclusive: "true" }],
      ["null inclusive", { ...position, inclusive: null }],
    ])("rejects %s with HTTP 400", (_label, value) => {
      const token = encodePayload({
        direction: "next",
        prod: position,
        dev: position,
        [env]: value,
      })
      expect(() => decodeCombinedSessionBookmark(token)).toThrow(
        invalidBookmarkError
      )
    })
  })

  it("rejects a single-environment bookmark with HTTP 400", () => {
    const token = encodeSessionBookmark({ direction: "next", ...position })
    expect(() => decodeCombinedSessionBookmark(token)).toThrow(
      invalidBookmarkError
    )
  })
})

describe.each([
  ["single-environment", decodeSessionBookmark],
  ["combined", decodeCombinedSessionBookmark],
])("unreadable %s bookmarks", (_label, decode) => {
  it.each(["", "%%%", Buffer.from("{invalid json").toString("base64url")])(
    "rejects token %j with HTTP 400",
    token => {
      expect(() => decode(token)).toThrow(invalidBookmarkError)
    }
  )
})
