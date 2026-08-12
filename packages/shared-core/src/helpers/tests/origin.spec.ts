import { extractOrigin, extractOriginList } from "../origin"

describe("origin helpers", () => {
  describe("extractOrigin", () => {
    it("extracts a full origin", () => {
      expect(extractOrigin("http://example.com:8080/path")).toBe(
        "http://example.com:8080"
      )
    })

    it("returns null for invalid input", () => {
      expect(extractOrigin("not a url")).toBeNull()
    })
  })

  describe("extractOriginList", () => {
    it("extracts unique origins and reports invalid entries", () => {
      expect(
        extractOriginList([
          "http://example.com:8080/path",
          "http://example.com:8080",
          "https://example.com",
          "sdfsdfew",
          42,
          "",
        ])
      ).toEqual({
        origins: ["http://example.com:8080", "https://example.com"],
        invalidOrigins: ["sdfsdfew"],
      })
    })
  })
})
