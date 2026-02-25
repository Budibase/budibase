import { type GetWorkspaceHomeMetricsResponse } from "@budibase/types"

describe("workspace home metrics caching", () => {
  let cacheGet: jest.Mock
  let cacheStore: jest.Mock
  let find: jest.Mock
  let getQuotaUsage: jest.Mock
  let cacheState: Map<string, unknown>
  let getWorkspaceHomeMetrics: (
    workspaceId: string
  ) => Promise<GetWorkspaceHomeMetricsResponse>

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-01-20T12:00:00.000Z"))

    cacheState = new Map()
    find = jest.fn(async () => ({ docs: [{ _id: "us_1" }], bookmark: null }))
    getQuotaUsage = jest.fn(async () => ({
      apps: {
        prod_workspace: {
          monthly: {
            "2026-01": {
              automations: 2,
            },
          },
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
          getGlobalDB: () => ({
            find,
          }),
        },
        db: {
          getProdWorkspaceID: jest.fn(() => "prod_workspace"),
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
    const first = await getWorkspaceHomeMetrics("dev_workspace")

    find.mockResolvedValue({
      docs: [{ _id: "us_1" }, { _id: "us_2" }],
      bookmark: null,
    })
    getQuotaUsage.mockResolvedValue({
      apps: {
        prod_workspace: {
          monthly: {
            "2026-01": {
              automations: 7,
            },
          },
        },
      },
    })

    const second = await getWorkspaceHomeMetrics("dev_workspace")

    expect(second).toEqual(first)
    expect(find).toHaveBeenCalledTimes(1)
    expect(getQuotaUsage).toHaveBeenCalledTimes(1)
  })

  it("returns stale metrics when refresh fails after ttl", async () => {
    const first = await getWorkspaceHomeMetrics("dev_workspace")

    jest.setSystemTime(new Date(Date.now() + 10 * 60 * 1000 + 1))
    find.mockRejectedValue(new Error("failed"))

    const second = await getWorkspaceHomeMetrics("dev_workspace")

    expect(second).toEqual(first)
  })

  it("returns safe defaults on cold cache failure", async () => {
    find.mockRejectedValue(new Error("failed"))

    const res = await getWorkspaceHomeMetrics("dev_workspace")

    expect(res.totalUsers).toEqual(0)
    expect(res.automationRunsThisMonth).toEqual(0)
    expect(res.agentActionsThisMonth).toEqual(0)
    expect(new Date(res.periodStart)).toEqual(
      new Date("2026-01-01T00:00:00.000Z")
    )
    expect(new Date(res.periodEnd)).toEqual(
      new Date("2026-02-01T00:00:00.000Z")
    )
  })
})
