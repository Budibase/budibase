import { TestConfiguration, API } from "../../../../tests"

describe("/api/global/workspaces", () => {
  const config = new TestConfiguration()
  const api = new API(config)

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("DELETE /api/system/tenants/:tenantId", () => {
    it("allows deleting the current tenant", async () => {
      const user = await config.createTenant()
      await config.createSession(user)
      const res = await api.tenants.delete(user.tenantId, {
        headers: config.authHeaders(user),
      })
    })

    it("rejects deleting another tenant", () => {})

    it("requires admin", () => {})
  })
})
