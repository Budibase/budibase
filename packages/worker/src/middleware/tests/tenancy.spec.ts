import { TestConfiguration, structures } from "../../tests"
import { constants } from "@budibase/backend-core"

describe("tenancy middleware", () => {
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

  it("should get tenant id from user", async () => {
    const user = await config.createTenant()
    await config.createSession(user)
    const res = await config.api.self.getSelf(user)
    expect(res.headers[constants.Header.TENANT_ID]).toBe(user.tenantId)
  })

  it("should get tenant id from header", async () => {
    const tenantId = structures.tenant.id()
    const headers = {
      [constants.Header.TENANT_ID]: tenantId,
    }
    const res = await config.request
      .get(`/api/global/configs/checklist`)
      .set(headers)
    expect(res.headers[constants.Header.TENANT_ID]).toBe(tenantId)
  })

  it("should get tenant id from query param", async () => {
    const tenantId = structures.tenant.id()
    const res = await config.request.get(
      `/api/global/configs/checklist?tenantId=${tenantId}`
    )
    expect(res.headers[constants.Header.TENANT_ID]).toBe(tenantId)
  })

  it("should get tenant id from subdomain", async () => {
    const tenantId = structures.tenant.id()
    const headers = {
      host: `${tenantId}.localhost:10000`,
    }
    const res = await config.request
      .get(`/api/global/configs/checklist`)
      .set(headers)
    expect(res.headers[constants.Header.TENANT_ID]).toBe(tenantId)
  })

  it("should get tenant id from path variable", async () => {
    const user = await config.createTenant()
    const res = await config.request
      .post(`/api/global/auth/${user.tenantId}/login`)
      .send({
        username: user.email,
        password: user.password,
      })
    expect(res.headers[constants.Header.TENANT_ID]).toBe(user.tenantId)
  })

  it("should throw when no tenant id is found", async () => {
    const res = await config.request.get(`/api/global/configs/checklist`)
    expect(res.status).toBe(403)
    expect(res.body).toEqual({ message: "Tenant id not set", status: 403 })
    expect(res.headers[constants.Header.TENANT_ID]).toBe(undefined)
  })
})
