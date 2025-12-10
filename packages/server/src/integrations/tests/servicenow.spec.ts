import { buildServiceNowBaseUrl } from "../servicenow"

describe("ServiceNow integration config helpers", () => {
  describe("buildServiceNowBaseUrl", () => {
    it("builds a base URL from a plain domain", () => {
      expect(buildServiceNowBaseUrl("example")).toEqual(
        "https://example.service-now.com/api"
      )
    })

    it("strips protocols, suffixes, and paths", () => {
      expect(
        buildServiceNowBaseUrl("https://Example.service-now.com/custom/path")
      ).toEqual("https://example.service-now.com/api")
    })

    it("throws for invalid domains", () => {
      expect(() => buildServiceNowBaseUrl("bad domain")).toThrow(
        "ServiceNow domain may only contain letters, numbers, or hyphens"
      )
    })
  })
})
