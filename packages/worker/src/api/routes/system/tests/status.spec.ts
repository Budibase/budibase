import { TestConfiguration } from "../../../../tests"
import { accounts } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"

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
      config.modeSelf()
      const res = await config.api.status.getStatus()
      expect(res.body).toEqual({
        health: {
          passing: true,
        },
      })
      expect(accounts.getStatus).toBeCalledTimes(0)
      config.modeCloud()
    })

    it("returns status in cloud", async () => {
      const value = {
        health: {
          passing: false,
        },
      }

      mocks.accounts.getStatus.mockReturnValueOnce(value)

      const res = await config.api.status.getStatus()

      expect(accounts.getStatus).toBeCalledTimes(1)
      expect(res.body).toEqual(value)
    })
  })
})
