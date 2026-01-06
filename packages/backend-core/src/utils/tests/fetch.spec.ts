import { getProxyDispatcher, resetProxyDispatcherCache } from "../fetch"

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
    resetProxyDispatcherCache()

    jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })
  describe("getProxyDispatcher", () => {
    describe("when no proxy is configured", () => {
      it("should return false when no proxy environment variables are set", () => {
        const result = getProxyDispatcher()
        expect(result).toBe(false)
      })
    })

    describe("when HTTP_PROXY is configured", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
      })

      it("should return a ProxyAgent instance", () => {
        const result = getProxyDispatcher()
        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })

      it("should pass rejectUnauthorized option", () => {
        const result1 = getProxyDispatcher({ rejectUnauthorized: false })
        const result2 = getProxyDispatcher({ rejectUnauthorized: true })

        expect(result1).toBeDefined()
        expect(result2).toBeDefined()
        expect(result1).not.toBe(result2)
      })
    })

    describe("when HTTPS_PROXY is configured", () => {
      beforeEach(() => {
        process.env.HTTPS_PROXY = "https://secure-proxy.example.com:8443"
      })

      it("should return a ProxyAgent instance", () => {
        const result = getProxyDispatcher()
        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("when both HTTP_PROXY and HTTPS_PROXY are configured", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
        process.env.HTTPS_PROXY = "https://secure-proxy.example.com:8443"
      })

      it("should return a ProxyAgent instance (preferring HTTPS)", () => {
        const result = getProxyDispatcher()
        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("when GLOBAL_AGENT_* environment variables are configured", () => {
      beforeEach(() => {
        process.env.GLOBAL_AGENT_HTTP_PROXY =
          "http://global-proxy.example.com:3128"
        process.env.GLOBAL_AGENT_HTTPS_PROXY =
          "https://global-secure-proxy.example.com:3129"
      })

      it("should return a ProxyAgent instance", () => {
        const result = getProxyDispatcher()
        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })

      it("should fall back to GLOBAL_AGENT_HTTP_PROXY if HTTPS is not set", () => {
        delete process.env.GLOBAL_AGENT_HTTPS_PROXY

        const result = getProxyDispatcher()
        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("environment variable precedence", () => {
      beforeEach(() => {
        process.env.GLOBAL_AGENT_HTTP_PROXY =
          "http://global-proxy.example.com:3128"
        process.env.GLOBAL_AGENT_HTTPS_PROXY =
          "https://global-secure-proxy.example.com:3129"
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
        process.env.HTTPS_PROXY = "https://secure-proxy.example.com:8443"
      })

      it("should return a ProxyAgent instance with correct precedence", () => {
        const result = getProxyDispatcher()
        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })

      it("should prefer GLOBAL_AGENT_HTTP_PROXY over standard HTTP_PROXY", () => {
        delete process.env.GLOBAL_AGENT_HTTPS_PROXY
        delete process.env.HTTPS_PROXY

        const result = getProxyDispatcher()
        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("caching behavior", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
      })

      it("should cache dispatcher when no options are provided", () => {
        const result1 = getProxyDispatcher()
        const result2 = getProxyDispatcher()

        expect(result1).toBe(result2)
      })

      it("should not cache dispatcher when options are provided", () => {
        const result1 = getProxyDispatcher({ rejectUnauthorized: false })
        const result2 = getProxyDispatcher({ rejectUnauthorized: false })

        expect(result1).not.toBe(result2)
      })

      it("should create new dispatcher for different options", () => {
        const result1 = getProxyDispatcher({ rejectUnauthorized: true })
        const result2 = getProxyDispatcher({ rejectUnauthorized: false })

        expect(result1).not.toBe(result2)
      })
    })

    describe("logging", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
      })

      it("should log proxy configuration", () => {
        const consoleSpy = jest.spyOn(console, "log")

        getProxyDispatcher({ rejectUnauthorized: false })

        expect(consoleSpy).toHaveBeenCalledWith("[fetch] Creating ProxyAgent", {
          proxyUrl: "http://proxy.example.com:8080",
          rejectUnauthorized: false,
        })
      })
    })

    describe("edge cases", () => {
      it("should handle empty string proxy URLs", () => {
        process.env.HTTP_PROXY = ""

        const result = getProxyDispatcher()

        expect(result).toBe(false)
      })

      it("should handle whitespace-only proxy URLs", () => {
        process.env.HTTP_PROXY = "   "

        const result = getProxyDispatcher()

        expect(result).toBe(false)
      })

      it("should handle HTTPS proxy URLs", () => {
        process.env.HTTPS_PROXY = "https://secure-proxy.example.com:8443"

        const result = getProxyDispatcher()

        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })
    })

    describe("NO_PROXY support", () => {
      beforeEach(() => {
        process.env.HTTP_PROXY = "http://proxy.example.com:8080"
      })

      it("should bypass proxy for exact hostname match", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "api.example.com"

        const result = getProxyDispatcher({
          url: "https://api.example.com/path",
        })

        expect(result).toBe(false)
      })

      it("should bypass proxy for wildcard subdomain match (*.example.com)", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.example.com"

        const result = getProxyDispatcher({
          url: "https://api.example.com/path",
        })

        expect(result).toBe(false)
      })

      it("should bypass proxy for leading dot pattern (.example.com)", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = ".example.com"

        const result = getProxyDispatcher({
          url: "https://api.example.com/path",
        })

        expect(result).toBe(false)
      })

      it("should bypass proxy for wildcard matching root domain", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.example.com"

        const result = getProxyDispatcher({ url: "https://example.com/path" })

        expect(result).toBe(false)
      })

      it("should not bypass proxy for non-matching hostname", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.foo.com"

        const result = getProxyDispatcher({
          url: "https://api.example.com/path",
        })

        expect(result).toBeDefined()
        expect(result?.constructor.name).toBe("ProxyAgent")
      })

      it("should handle comma-separated NO_PROXY list", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.foo.com,baz.com,*.example.com"

        const result1 = getProxyDispatcher({ url: "https://api.foo.com/path" })
        const result2 = getProxyDispatcher({ url: "https://baz.com/path" })
        const result3 = getProxyDispatcher({
          url: "https://sub.example.com/path",
        })
        const result4 = getProxyDispatcher({ url: "https://other.com/path" })

        expect(result1).toBe(false)
        expect(result2).toBe(false)
        expect(result3).toBe(false)
        expect(result4?.constructor.name).toBe("ProxyAgent")
      })

      it("should handle space-separated NO_PROXY list", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*.foo.com baz.com"

        const result1 = getProxyDispatcher({ url: "https://api.foo.com/path" })
        const result2 = getProxyDispatcher({ url: "https://baz.com/path" })

        expect(result1).toBe(false)
        expect(result2).toBe(false)
      })

      it("should handle port-specific NO_PROXY rules", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "example.com:8080"

        const result1 = getProxyDispatcher({
          url: "https://example.com:8080/path",
        })
        const result2 = getProxyDispatcher({
          url: "https://example.com:9090/path",
        })
        const result3 = getProxyDispatcher({ url: "https://example.com/path" })

        expect(result1).toBe(false)
        expect(result2?.constructor.name).toBe("ProxyAgent")
        expect(result3?.constructor.name).toBe("ProxyAgent")
      })

      it("should prefer GLOBAL_AGENT_NO_PROXY over NO_PROXY", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "api.example.com"
        process.env.NO_PROXY = "other.example.com"

        const result1 = getProxyDispatcher({
          url: "https://api.example.com/path",
        })
        const result2 = getProxyDispatcher({
          url: "https://other.example.com/path",
        })

        expect(result1).toBe(false)
        expect(result2?.constructor.name).toBe("ProxyAgent")
      })

      it("should fall back to NO_PROXY if GLOBAL_AGENT_NO_PROXY is not set", () => {
        process.env.NO_PROXY = "api.example.com"

        const result = getProxyDispatcher({
          url: "https://api.example.com/path",
        })

        expect(result).toBe(false)
      })

      it("should use proxy when URL is not provided even if NO_PROXY is set", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*"

        const result = getProxyDispatcher()

        expect(result?.constructor.name).toBe("ProxyAgent")
      })

      it("should bypass proxy for wildcard * matching all hosts", () => {
        process.env.GLOBAL_AGENT_NO_PROXY = "*"

        const result = getProxyDispatcher({
          url: "https://any.example.com/path",
        })

        expect(result).toBe(false)
      })
    })
  })
})
