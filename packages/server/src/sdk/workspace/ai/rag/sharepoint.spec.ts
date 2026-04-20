import {
  isSharePointFileIncludedByFilters,
  isValidSharePointSiteId,
} from "./sharepoint"

describe("sharepoint site id validation", () => {
  it("accepts valid Graph site ids", () => {
    expect(
      isValidSharePointSiteId(
        "budibase.sharepoint.com,1673c662-f019-4b74-8a1e-853d31f08923,0d52f919-8e19-4a22-a59b-495b63b69561"
      )
    ).toBe(true)
  })

  it("rejects site ids with traversal sequences", () => {
    expect(
      isValidSharePointSiteId(
        "budibase.sharepoint.com,1673c662-f019-4b74-8a1e-853d31f08923,../../me/messages"
      )
    ).toBe(false)
  })

  it("rejects non canonical site ids", () => {
    expect(isValidSharePointSiteId("not-a-site-id")).toBe(false)
    expect(isValidSharePointSiteId("")).toBe(false)
  })
})

describe("sharepoint source filters", () => {
  it("includes only matching paths when positive patterns are set", () => {
    expect(
      isSharePointFileIncludedByFilters(
        {
          driveId: "drive-1",
          itemId: "item-1",
          filename: "budget.xlsx",
          path: "Finance/Q1/budget.xlsx",
        },
        { patterns: ["finance/**"] }
      )
    ).toBe(true)

    expect(
      isSharePointFileIncludedByFilters(
        {
          driveId: "drive-1",
          itemId: "item-2",
          filename: "notes.txt",
          path: "Engineering/notes.txt",
        },
        { patterns: ["finance/**"] }
      )
    ).toBe(false)
  })

  it("supports negated patterns", () => {
    expect(
      isSharePointFileIncludedByFilters(
        {
          driveId: "drive-1",
          itemId: "item-3",
          filename: "draft-plan.md",
          path: "Product/draft-plan.md",
        },
        { patterns: ["product/**", "!product/draft*"] }
      )
    ).toBe(false)

    expect(
      isSharePointFileIncludedByFilters(
        {
          driveId: "drive-1",
          itemId: "item-4",
          filename: "plan.md",
          path: "Product/plan.md",
        },
        { patterns: ["product/**", "!product/draft*"] }
      )
    ).toBe(true)
  })
})
