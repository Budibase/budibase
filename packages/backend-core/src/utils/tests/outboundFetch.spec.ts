import fetch, { Headers } from "node-fetch"
import { isBlacklisted } from "../../blacklist"
import { fetchWithBlacklist } from "../outboundFetch"

// Expose the real Headers class so the redirect header-stripping logic works
jest.mock("node-fetch", () => {
  const actual = jest.requireActual("node-fetch")
  return Object.assign(jest.fn(), { Headers: actual.Headers })
})

jest.mock("../../blacklist", () => ({
  isBlacklisted: jest.fn(),
}))

describe("outboundFetch", () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>
  const isBlacklistedMock = isBlacklisted as jest.MockedFunction<
    typeof isBlacklisted
  >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ─── URL validation ───────────────────────────────────────────────────────

  it("blocks blacklisted urls", async () => {
    isBlacklistedMock.mockResolvedValue(true)

    await expect(
      fetchWithBlacklist("http://169.254.169.254/metadata/v1/")
    ).rejects.toThrow("URL is blocked or could not be resolved safely.")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects unsupported schemes", async () => {
    isBlacklistedMock.mockResolvedValue(false)

    await expect(fetchWithBlacklist("file:///etc/passwd")).rejects.toThrow(
      "Only HTTP(S) URLs are allowed."
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects URL with embedded username", async () => {
    isBlacklistedMock.mockResolvedValue(false)

    await expect(
      fetchWithBlacklist("https://attacker@example.com/")
    ).rejects.toThrow("URL must not include credentials.")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("rejects URL with embedded username and password", async () => {
    isBlacklistedMock.mockResolvedValue(false)

    await expect(
      fetchWithBlacklist("https://user:pass@169.254.169.254/")
    ).rejects.toThrow("URL must not include credentials.")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("returns the response for allowed urls", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const response = {
      status: 200,
      ok: true,
      headers: { get: jest.fn() },
    } as any
    fetchMock.mockResolvedValue(response)

    const result = await fetchWithBlacklist("https://example.com/spec.json")

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/spec.json",
      expect.objectContaining({ redirect: "manual" })
    )
    expect(result).toBe(response)
  })

  // ─── Redirect handling ────────────────────────────────────────────────────

  it("blocks redirects to blacklisted urls", async () => {
    isBlacklistedMock.mockResolvedValueOnce(false).mockResolvedValueOnce(true)
    const resume = jest.fn()

    fetchMock.mockResolvedValue({
      status: 302,
      headers: { get: jest.fn().mockReturnValue("http://169.254.169.254/") },
      body: { resume },
    } as any)

    await expect(
      fetchWithBlacklist("https://example.com/spec.json")
    ).rejects.toThrow("URL is blocked or could not be resolved safely.")
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(resume).toHaveBeenCalledTimes(1)
  })

  it("throws when a redirect is encountered and followRedirects is false", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const resume = jest.fn()

    fetchMock.mockResolvedValue({
      status: 302,
      headers: { get: jest.fn().mockReturnValue("https://other.example.com/") },
      body: { resume },
    } as any)

    await expect(
      fetchWithBlacklist(
        "https://example.com/plugin.tar.gz",
        {},
        { followRedirects: false }
      )
    ).rejects.toThrow("Redirects are not permitted.")
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(resume).toHaveBeenCalledTimes(1)
  })

  it.each([301, 302, 303, 307, 308])(
    "treats %d as a redirect status",
    async status => {
      isBlacklistedMock.mockResolvedValue(false)
      const resume = jest.fn()

      fetchMock
        .mockResolvedValueOnce({
          status,
          headers: {
            get: jest.fn().mockReturnValue("https://example.com/final"),
          },
          body: { resume },
        } as any)
        .mockResolvedValueOnce({
          status: 200,
          ok: true,
          headers: { get: jest.fn() },
        } as any)

      await fetchWithBlacklist("https://example.com/start")

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(resume).toHaveBeenCalledTimes(1)
    }
  )

  it("rejects redirect to URL with embedded credentials", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const resume = jest.fn()

    fetchMock.mockResolvedValue({
      status: 302,
      headers: {
        get: jest.fn().mockReturnValue("https://user:pass@evil.com/"),
      },
      body: { resume },
    } as any)

    await expect(
      fetchWithBlacklist("https://example.com/start")
    ).rejects.toThrow("URL must not include credentials.")
  })

  it("throws after exceeding the maximum redirect count", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const resume = jest.fn()

    fetchMock.mockResolvedValue({
      status: 302,
      headers: {
        get: jest.fn().mockReturnValue("https://example.com/loop"),
      },
      body: { resume },
    } as any)

    await expect(
      fetchWithBlacklist("https://example.com/start")
    ).rejects.toThrow("Maximum redirect reached.")

    // Loop runs for redirects 0..5 inclusive → 6 fetch calls
    expect(fetchMock).toHaveBeenCalledTimes(6)
  })

  it("resolves a relative Location header against the current URL", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const resume = jest.fn()

    fetchMock
      .mockResolvedValueOnce({
        status: 302,
        headers: { get: jest.fn().mockReturnValue("/other/path") },
        body: { resume },
      } as any)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        headers: { get: jest.fn() },
      } as any)

    await fetchWithBlacklist("https://example.com/original")

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.com/other/path",
      expect.objectContaining({ redirect: "manual" })
    )
  })

  // ─── Method mutation on redirect ──────────────────────────────────────────

  it.each([
    [301, "POST"],
    [302, "POST"],
  ])(
    "converts method from POST to GET on %d redirect",
    async (status, initialMethod) => {
      isBlacklistedMock.mockResolvedValue(false)
      const resume = jest.fn()

      fetchMock
        .mockResolvedValueOnce({
          status,
          headers: {
            get: jest.fn().mockReturnValue("https://example.com/final"),
          },
          body: { resume },
        } as any)
        .mockResolvedValueOnce({
          status: 200,
          ok: true,
          headers: { get: jest.fn() },
        } as any)

      await fetchWithBlacklist("https://example.com/resource", {
        method: initialMethod,
      })

      const secondCallRequest = fetchMock.mock.calls[1][1]
      expect(secondCallRequest?.method).toBe("GET")
    }
  )

  it("converts method to GET on 303 redirect regardless of original method", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const resume = jest.fn()

    fetchMock
      .mockResolvedValueOnce({
        status: 303,
        headers: {
          get: jest.fn().mockReturnValue("https://example.com/final"),
        },
        body: { resume },
      } as any)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        headers: { get: jest.fn() },
      } as any)

    await fetchWithBlacklist("https://example.com/resource", { method: "PUT" })

    const secondCallRequest = fetchMock.mock.calls[1][1]
    expect(secondCallRequest?.method).toBe("GET")
  })

  it.each([307, 308])(
    "preserves method on %d redirect",
    async redirectStatus => {
      isBlacklistedMock.mockResolvedValue(false)
      const resume = jest.fn()

      fetchMock
        .mockResolvedValueOnce({
          status: redirectStatus,
          headers: {
            get: jest.fn().mockReturnValue("https://example.com/final"),
          },
          body: { resume },
        } as any)
        .mockResolvedValueOnce({
          status: 200,
          ok: true,
          headers: { get: jest.fn() },
        } as any)

      await fetchWithBlacklist("https://example.com/resource", {
        method: "POST",
      })

      const secondCallRequest = fetchMock.mock.calls[1][1]
      expect(secondCallRequest?.method).toBe("POST")
    }
  )

  it("does not convert method to GET on 301 GET redirect", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const resume = jest.fn()

    fetchMock
      .mockResolvedValueOnce({
        status: 301,
        headers: {
          get: jest.fn().mockReturnValue("https://example.com/final"),
        },
        body: { resume },
      } as any)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        headers: { get: jest.fn() },
      } as any)

    // GET is the default method — it should remain GET, not be changed for any
    // other reason
    await fetchWithBlacklist("https://example.com/resource")

    const secondCallRequest = fetchMock.mock.calls[1][1]
    // method field is undefined (default GET); the key point is it's not "POST"
    expect(secondCallRequest?.method).not.toBe("POST")
  })

  // ─── Header stripping on cross-origin redirect ────────────────────────────

  it.each(["authorization", "cookie", "cookie2", "proxy-authorization"])(
    "strips the %s header when redirected to a different origin",
    async sensitiveHeader => {
      isBlacklistedMock.mockResolvedValue(false)
      const resume = jest.fn()

      fetchMock
        .mockResolvedValueOnce({
          status: 302,
          headers: {
            get: jest.fn().mockReturnValue("https://other.example.com/final"),
          },
          body: { resume },
        } as any)
        .mockResolvedValueOnce({
          status: 200,
          ok: true,
          headers: { get: jest.fn() },
        } as any)

      await fetchWithBlacklist("https://example.com/resource", {
        headers: { [sensitiveHeader]: "secret-value" },
      })

      const secondCallHeaders = new Headers(
        fetchMock.mock.calls[1][1]?.headers as any
      )
      expect(secondCallHeaders.get(sensitiveHeader)).toBeNull()
    }
  )

  it("preserves sensitive headers when redirected to the same origin", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const resume = jest.fn()

    fetchMock
      .mockResolvedValueOnce({
        status: 302,
        headers: {
          get: jest
            .fn()
            .mockReturnValue("https://example.com/same-origin-path"),
        },
        body: { resume },
      } as any)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        headers: { get: jest.fn() },
      } as any)

    await fetchWithBlacklist("https://example.com/resource", {
      headers: { authorization: "Bearer token" },
    })

    const secondCallHeaders = new Headers(
      fetchMock.mock.calls[1][1]?.headers as any
    )
    expect(secondCallHeaders.get("authorization")).toBe("Bearer token")
  })
})
