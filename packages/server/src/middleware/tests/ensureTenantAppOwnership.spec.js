import ensureTenantAppOwnership from "../ensureTenantAppOwnership"
import { tenancy, utils } from "@budibase/backend-core"

jest.mock("@budibase/backend-core", () => ({
  ...jest.requireActual("@budibase/backend-core"),
  tenancy: {
    getTenantId: jest.fn(),
  },
  utils: {
    getAppIdFromCtx: jest.fn(),
  },
}))

class TestConfiguration {
  constructor(appId = "tenant_1") {
    this.next = jest.fn()
    this.throw = jest.fn()
    this.middleware = ensureTenantAppOwnership

    this.ctx = {
      next: this.next,
      throw: this.throw,
    }

    utils.getAppIdFromCtx.mockResolvedValue(appId)
  }

  async executeMiddleware() {
    return this.middleware(this.ctx, this.next)
  }

  afterEach() {
    jest.clearAllMocks()
  }
}

describe("Ensure Tenant Ownership Middleware", () => {
  let config

  beforeEach(() => {
    config = new TestConfiguration()
  })

  afterEach(() => {
    config.afterEach()
  })

  it("calls next() when appId matches tenant ID", async () => {
    tenancy.getTenantId.mockReturnValue("tenant_1")

    await config.executeMiddleware()

    expect(utils.getAppIdFromCtx).toHaveBeenCalledWith(config.ctx)
    expect(config.next).toHaveBeenCalled()
  })

  it("throws when tenant appId does not match tenant ID", async () => {
    const appId = "app_dev_tenant3_fce449c4d75b4e4a9c7a6980d82a3e22"
    utils.getAppIdFromCtx.mockResolvedValue(appId)
    tenancy.getTenantId.mockReturnValue("tenant_2")

    await config.executeMiddleware()

    expect(utils.getAppIdFromCtx).toHaveBeenCalledWith(config.ctx)
    expect(config.throw).toHaveBeenCalledWith(403, "Unauthorized")
  })

  it("throws 400 when appId is missing", async () => {
    utils.getAppIdFromCtx.mockResolvedValue(null)

    await config.executeMiddleware()

    expect(config.throw).toHaveBeenCalledWith(400, "appId must be provided")
  })
})
