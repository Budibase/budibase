import { HealthStatusResponse } from "@budibase/types"
import { TestConfiguration } from "../../../../tests"
import { accounts as _accounts } from "@budibase/backend-core"

const accounts = jest.mocked(_accounts)

describe("/api/system/status", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/system/status", () => {
    it("returns status in self host", async () => {
      config.selfHosted()
      const res = await config.api.status.getStatus()
      expect(res.body).toEqual({
        health: {
          passing: true,
        },
        version: expect.any(String),
      })
      expect(accounts.getStatus).toHaveBeenCalledTimes(0)
      config.cloudHosted()
    })

    it("returns status in cloud", async () => {
      const value: HealthStatusResponse = {
        passing: false,
        checks: {
          login: false,
          search: false,
        },
      }

      accounts.getStatus.mockResolvedValue(value)

      const res = await config.api.status.getStatus()

      expect(accounts.getStatus).toHaveBeenCalledTimes(1)
      expect(res.body).toEqual(value)
    })
  })
})
