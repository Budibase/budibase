import { getDispatcher } from "../fetch"

describe("fetch utilities", () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }

    delete process.env.GLOBAL_AGENT_HTTP_PROXY
    delete process.env.GLOBAL_AGENT_HTTPS_PROXY
    delete process.env.GLOBAL_AGENT_NO_PROXY
    delete process.env.HTTP_PROXY
    delete process.env.HTTPS_PROXY
    delete process.env.NO_PROXY

    jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  describe("getDispatcher", () => {
    const testUrl = "https://api.example.com/path"

    describe("when no proxy is configured", () => {
      it("should return a direct Agent", () => {
        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("Agent")
      })
    })

    describe("when HTTP_PROXY is configured", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
      })

      it("should return a ProxyAgent", () => {
        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("ProxyAgent")
      })

      it("should create new dispatcher for each call", () => {
        const result1 = getDispatcher({
          url: testUrl,
          rejectUnauthorized: false,
        })
        const result2 = getDispatcher({
          url: testUrl,
          rejectUnauthorized: false,
        })
        expect(result1).not.toBe(result2)
      })
    })

    describe("when HTTPS_PROXY is configured", () => {
      beforeEach(() => {
        process.env.HTTPS_PROXY = "https://secure-proxy.example.com:8443"
      })

      it("should return a ProxyAgent", () => {
        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("when both HTTP_PROXY and HTTPS_PROXY are configured", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
        process.env.HTTPS_PROXY = "https://secure-proxy.example.com:8443"
      })

      it("should return a ProxyAgent (preferring HTTPS)", () => {
        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("when GLOBAL_AGENT_* environment variables are configured", () => {
      beforeEach(() => {
        process.env.GLOBAL_AGENT_HTTP_PROXY =
          "http://global-proxy.example.com:3128"
        process.env.GLOBAL_AGENT_HTTPS_PROXY =
          "https://global-secure-proxy.example.com:3129"
      })

      it("should return a ProxyAgent", () => {
        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("ProxyAgent")
      })

      it("should fall back to GLOBAL_AGENT_HTTP_PROXY if HTTPS is not set", () => {
        delete process.env.GLOBAL_AGENT_HTTPS_PROXY

        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("logging", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
      })

      it("should log proxy configuration when using proxy", () => {
        const consoleSpy = jest.spyOn(console, "log")

        getDispatcher({ url: testUrl, rejectUnauthorized: false })

        expect(consoleSpy).toHaveBeenCalledWith("[fetch] Creating ProxyAgent", {
          proxyUrl: "http://proxy.example.com:8080",
          rejectUnauthorized: false,
        })
      })
    })

    describe("edge cases", () => {
      it("should return direct Agent for empty string proxy URLs", () => {
        process.env.HTTP_PROXY = ""

        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("Agent")
      })

      it("should return direct Agent for whitespace-only proxy URLs", () => {
        process.env.HTTP_PROXY = "   "

        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("Agent")
      })

      it("should return ProxyAgent for HTTPS proxy URLs", () => {
        process.env.HTTPS_PROXY = "https://secure-proxy.example.com:8443"

        const result = getDispatcher({ url: testUrl })
        expect(result.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("NO_PROXY support", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
      })

      it("should bypass proxy for exact hostname match", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "api.example.com"

        const result = getDispatcher({ url: "https://api.example.com/path" })
        expect(result.constructor.name).toBe("Agent")
      })

      it("should bypass proxy for wildcard subdomain match (*.example.com)", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.example.com"

        const result = getDispatcher({ url: "https://api.example.com/path" })
        expect(result.constructor.name).toBe("Agent")
      })

      it("should bypass proxy for leading dot pattern (.example.com)", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = ".example.com"

        const result = getDispatcher({ url: "https://api.example.com/path" })
        expect(result.constructor.name).toBe("Agent")
      })

      it("should bypass proxy for wildcard matching root domain", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.example.com"

        const result = getDispatcher({ url: "https://example.com/path" })
        expect(result.constructor.name).toBe("Agent")
      })

      it("should use proxy for non-matching hostname", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.foo.com"

        const result = getDispatcher({ url: "https://api.example.com/path" })
        expect(result.constructor.name).toBe("ProxyAgent")
      })

      it("should handle comma-separated NO_PROXY list", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.foo.com,baz.com,*.example.com"

        const result1 = getDispatcher({ url: "https://api.foo.com/path" })
        const result2 = getDispatcher({ url: "https://baz.com/path" })
        const result3 = getDispatcher({ url: "https://sub.example.com/path" })
        const result4 = getDispatcher({ url: "https://other.com/path" })

        expect(result1.constructor.name).toBe("Agent")
        expect(result2.constructor.name).toBe("Agent")
        expect(result3.constructor.name).toBe("Agent")
        expect(result4.constructor.name).toBe("ProxyAgent")
      })

      it("should handle space-separated NO_PROXY list", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.foo.com baz.com"

        const result1 = getDispatcher({ url: "https://api.foo.com/path" })
        const result2 = getDispatcher({ url: "https://baz.com/path" })

        expect(result1.constructor.name).toBe("Agent")
        expect(result2.constructor.name).toBe("Agent")
      })

      it("should handle port-specific NO_PROXY rules", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "example.com:8080"

        const result1 = getDispatcher({ url: "https://example.com:8080/path" })
        const result2 = getDispatcher({ url: "https://example.com:9090/path" })
        const result3 = getDispatcher({ url: "https://example.com/path" })

        expect(result1.constructor.name).toBe("Agent")
        expect(result2.constructor.name).toBe("ProxyAgent")
        expect(result3.constructor.name).toBe("ProxyAgent")
      })

      it("should prefer GLOBAL_AGENT_NO_PROXY over NO_PROXY", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "api.example.com"
        process.env.NO_PROXY = "other.example.com"

        const result1 = getDispatcher({ url: "https://api.example.com/path" })
        const result2 = getDispatcher({ url: "https://other.example.com/path" })

        expect(result1.constructor.name).toBe("Agent")
        expect(result2.constructor.name).toBe("ProxyAgent")
      })

      it("should fall back to NO_PROXY if GLOBAL_AGENT_NO_PROXY is not set", () => {
        process.env.NO_PROXY = "api.example.com"

        const result = getDispatcher({ url: "https://api.example.com/path" })
        expect(result.constructor.name).toBe("Agent")
      })

      it("should bypass proxy for wildcard * matching all hosts", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*"

        const result = getDispatcher({ url: "https://any.example.com/path" })
        expect(result.constructor.name).toBe("Agent")
      })
    })
  })
})
