jest.mock("node-fetch", () => jest.fn())

describe("GitHub controller", () => {
  let cacheGet: jest.Mock
  let cacheStore: jest.Mock
  let cacheState: Map<string, any>
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    jest.useFakeTimers()
    jest.setSystemTime(new Date("2020-01-01T00:00:00.000Z"))

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    cacheState = new Map()
    jest.doMock("@budibase/backend-core", () => {
      cacheGet = jest.fn(async (key: string, opts?: any) => {
        if (opts?.useTenancy !== false) {
          throw new Error("Expected global cache usage")
        }
        return cacheState.get(key) ?? null
      })

      cacheStore = jest.fn(
        async (key: string, value: any, _ttl?: any, opts?: any) => {
          if (opts?.useTenancy !== false) {
            throw new Error("Expected global cache usage")
          }
          cacheState.set(key, value)
        }
      )

      return {
        cache: {
          get: cacheGet,
          store: cacheStore,
        },
      }
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    jest.useRealTimers()
  })

  const getFetchMock = () => {
    return jest.requireMock("node-fetch") as unknown as jest.Mock
  }

  const makeCtx = () => {
    return { body: undefined } as any
  }

  it("adds a request timeout", async () => {
    const fetchMock = getFetchMock()
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ stargazers_count: 123 }),
    })

    const { getStars } = require("../github")
    const ctx = makeCtx()
    await getStars(ctx)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ timeout: 5000 })
    )
    expect(ctx.body.stars).toEqual(123)

    expect(cacheGet).toHaveBeenCalledWith("global:github:stars", {
      useTenancy: false,
    })
    expect(cacheStore).toHaveBeenCalledWith(
      "global:github:stars",
      expect.any(Object),
      expect.any(Number),
      { useTenancy: false }
    )
  })

  it("caches successful responses", async () => {
    const fetchMock = getFetchMock()
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ stargazers_count: 999 }),
    })

    const { getStars } = require("../github")
    const ctx1 = makeCtx()
    await getStars(ctx1)
    const ctx2 = makeCtx()
    await getStars(ctx2)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(ctx2.body).toEqual(ctx1.body)
  })

  it("serves cached value and sets a short failure TTL on error", async () => {
    const fetchMock = getFetchMock()
    fetchMock.mockRejectedValue(new Error("timeout"))

    const { getStars } = require("../github")
    const ctx1 = makeCtx()
    await getStars(ctx1)
    const ctx2 = makeCtx()
    await getStars(ctx2)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(ctx1.body).toEqual({ stars: null, fetchedAt: null })
    expect(ctx2.body).toEqual(ctx1.body)
  })

  it("returns last known value on refresh failure", async () => {
    const fetchMock = getFetchMock()
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ stargazers_count: 111 }),
    })

    const { getStars } = require("../github")
    const ctx1 = makeCtx()
    await getStars(ctx1)

    jest.setSystemTime(new Date(Date.now() + 6 * 60 * 60 * 1000 + 1))
    fetchMock.mockRejectedValue(new Error("github down"))

    const ctx2 = makeCtx()
    await getStars(ctx2)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(ctx2.body).toEqual(ctx1.body)
  })

  it("retries after failure backoff expires", async () => {
    const fetchMock = getFetchMock()
    fetchMock.mockRejectedValue(new Error("timeout"))

    const { getStars } = require("../github")
    const ctx1 = makeCtx()
    await getStars(ctx1)
    const ctx2 = makeCtx()
    await getStars(ctx2)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    jest.setSystemTime(new Date(Date.now() + 5 * 60 * 1000 + 1))
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ stargazers_count: 222 }),
    })

    const ctx3 = makeCtx()
    await getStars(ctx3)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(ctx3.body.stars).toEqual(222)
  })
})
