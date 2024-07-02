import { Hosting, TenantInfo } from "@budibase/types"
import { TestConfiguration } from "../../../../tests"
import { tenancy as _tenancy } from "@budibase/backend-core"

const tenancy = jest.mocked(_tenancy)

describe("/api/global/tenant", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/global/tenant", () => {
    it("should save the tenantInfo", async () => {
      tenancy.saveTenantInfo = jest.fn().mockImplementation(async () => ({
        id: "DOC_ID",
        ok: true,
        rev: "DOC_REV",
      }))
      const tenantInfo: TenantInfo = {
        owner: {
          email: "test@example.com",
          password: "PASSWORD",
          ssoId: "SSO_ID",
          givenName: "Jane",
          familyName: "Doe",
          budibaseUserId: "USER_ID",
        },
        tenantId: "tenant123",
        hosting: Hosting.CLOUD,
      }
      const response = await config.api.tenants.saveTenantInfo(tenantInfo)

      expect(_tenancy.saveTenantInfo).toHaveBeenCalledTimes(1)
      expect(_tenancy.saveTenantInfo).toHaveBeenCalledWith(tenantInfo)
      expect(response.text).toEqual('{"_id":"DOC_ID","_rev":"DOC_REV"}')
    })
  })
})
