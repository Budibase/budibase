import { type GetWorkspaceHomeMetricsResponse } from "@budibase/types"

describe("workspace home metrics caching", () => {
  let cacheGet: jest.Mock
  let cacheStore: jest.Mock
  let getUserCount: jest.Mock
  let getQuotaUsage: jest.Mock
  let cacheState: Map<string, unknown>
  let getWorkspaceHomeMetrics: () => Promise<GetWorkspaceHomeMetricsResponse>

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-20T12:00:00.000Z"))

    cacheState = new Map()
    getUserCount = jest.fn(async () => 1)
    getQuotaUsage = jest.fn(async () => ({
      monthly: {
        current: {
          actions: 2,
          budibaseAICredits: 4500,
        },
      },
    }))

    jest.doMock("@budibase/backend-core", () => {
      cacheGet = jest.fn(async (key: string) => cacheState.get(key) ?? null)
      cacheStore = jest.fn(async (key: string, value: unknown) => {
        cacheState.set(key, value)
      })

      return {
        cache: {
          get: cacheGet,
          store: cacheStore,
        },
        context: {
          getTenantId: jest.fn(() => "tenant_1"),
        },
        users: {
          getUserCount,
        },
      }
    })

    jest.doMock("@budibase/pro", () => ({
      quotas: {
        getQuotaUsage,
      },
    }))
    ;({ getWorkspaceHomeMetrics } = require("./metrics"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns cached metrics inside the freshness window", async () => {
    const first = await getWorkspaceHomeMetrics()

    expect(first.budibaseAICreditsThisMonth).toEqual(4)

    getUserCount.mockResolvedValue(2)
    getQuotaUsage.mockResolvedValue({
      monthly: {
        current: {
          actions: 7,
          budibaseAICredits: 11999,
        },
      },
    })

    const second = await getWorkspaceHomeMetrics()

    expect(second).toEqual(first)
    expect(getUserCount).toHaveBeenCalledTimes(1)
    expect(getQuotaUsage).toHaveBeenCalledTimes(1)
  })

  it("returns stale metrics when refresh fails after ttl", async () => {
    const first = await getWorkspaceHomeMetrics()

    jest.setSystemTime(new Date(Date.now() + 90 * 1000 + 1))
    getUserCount.mockRejectedValue(new Error("failed"))

    const second = await getWorkspaceHomeMetrics()

    expect(second).toEqual(first)
  })

  it("returns safe defaults on cold cache failure", async () => {
    getUserCount.mockRejectedValue(new Error("failed"))

    const res = await getWorkspaceHomeMetrics()

    expect(res.totalUsers).toEqual(0)
    expect(res.operationsThisMonth).toEqual(0)
    expect(res.budibaseAICreditsThisMonth).toEqual(0)
    expect(new Date(res.periodStart)).toEqual(
      new Date("2026-01-01T00:00:00.000Z")
    )
    expect(new Date(res.periodEnd)).toEqual(
      new Date("2026-02-01T00:00:00.000Z")
    )
  })
})
