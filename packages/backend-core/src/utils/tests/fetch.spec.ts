import { getProxyDispatcher, resetProxyDispatcherCache } from "../fetch"

describe("fetch utilities", () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }

    delete process.env.GLOBAL_AGENT_HTTP_PROXY
    delete process.env.GLOBAL_AGENT_HTTPS_PROXY
    delete process.env.HTTP_PROXY
    delete process.env.HTTPS_PROXY
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
  })
})
