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

    it("returns null for urls whose origin is null", () => {
      expect(extractOrigin("example.com:8080")).toBeNull()
      expect(extractOrigin("mailto:a@b.com")).toBeNull()
      expect(extractOrigin("file:///etc/passwd")).toBeNull()
      expect(extractOrigin("ftp://example.com")).toBeNull()
    })
  })

  describe("extractOriginList", () => {
    it("extracts unique origins and reports invalid entries", () => {
      expect(
        extractOriginList([
          "http://example.com:8080/path",
          "http://example.com:8080",
          "https://example.com",
          "example.com:8080",
          "mailto:a@b.com",
          "file:///etc/passwd",
          "ftp://example.com",
          "sdfsdfew",
          42,
          "",
        ])
      ).toEqual({
        origins: ["http://example.com:8080", "https://example.com"],
        invalidOrigins: [
          "example.com:8080",
          "mailto:a@b.com",
          "file:///etc/passwd",
          "ftp://example.com",
          "sdfsdfew",
        ],
      })
    })
  })
})
