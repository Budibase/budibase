import { isValidSharePointSiteId } from "./sharepoint"

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
