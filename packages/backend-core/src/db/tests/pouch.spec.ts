require("../../../tests")

import { getUrlInfo } from "../couch"

describe("pouch", () => {
  describe("Couch DB URL parsing", () => {
    it("should handle a null Couch DB URL", () => {
      const info = getUrlInfo(null)
      expect(info.url).toBeUndefined()
      expect(info.auth.username).toBeUndefined()
    })
    it("should be able to parse a basic Couch DB URL", () => {
      const info = getUrlInfo("http://host.com")
      expect(info.url).toBe("http://host.com")
      expect(info.auth.username).toBeUndefined()
    })
    it("should be able to parse a Couch DB basic URL with HTTPS", () => {
      const info = getUrlInfo("https://host.com")
      expect(info.url).toBe("https://host.com")
      expect(info.auth.username).toBeUndefined()
    })
    it("should be able to parse a basic Couch DB URL with a custom port", () => {
      const info = getUrlInfo("https://host.com:1234")
      expect(info.url).toBe("https://host.com:1234")
      expect(info.auth.username).toBeUndefined()
    })
    it("should be able to parse a Couch DB URL with auth", () => {
      const info = getUrlInfo("https://user:pass@host.com:1234")
      expect(info.url).toBe("https://host.com:1234")
      expect(info.auth.username).toBe("user")
      expect(info.auth.password).toBe("pass")
    })
    it("should be able to parse a Couch DB URL with auth and special chars", () => {
      const info = getUrlInfo("https://user:s:p@s://@://:d@;][~s@host.com:1234")
      expect(info.url).toBe("https://host.com:1234")
      expect(info.auth.username).toBe("user")
      expect(info.auth.password).toBe("s:p@s://@://:d@;][~s")
    })
    it("should be able to parse a Couch DB URL without a protocol", () => {
      const info = getUrlInfo("host.com:1234")
      expect(info.url).toBe("http://host.com:1234")
      expect(info.auth.username).toBeUndefined()
    })
    it("should be able to parse a Couch DB URL with auth and without a protocol", () => {
      const info = getUrlInfo("user:s:p@s://@://:d@;][~s@host.com:1234")
      expect(info.url).toBe("http://host.com:1234")
      expect(info.auth.username).toBe("user")
      expect(info.auth.password).toBe("s:p@s://@://:d@;][~s")
    })
    it("should be able to parse a Couch DB URL with only username auth", () => {
      const info = getUrlInfo("https://user@host.com:1234")
      expect(info.url).toBe("https://host.com:1234")
      expect(info.auth.username).toBe("user")
      expect(info.auth.password).toBeUndefined()
    })
    it("should be able to parse a Couch DB URL with only username auth and without a protocol", () => {
      const info = getUrlInfo("user@host.com:1234")
      expect(info.url).toBe("http://host.com:1234")
      expect(info.auth.username).toBe("user")
      expect(info.auth.password).toBeUndefined()
    })
  })
})
