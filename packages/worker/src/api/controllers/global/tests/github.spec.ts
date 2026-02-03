jest.mock("node-fetch", () => jest.fn())

describe("GitHub controller", () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
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
})
