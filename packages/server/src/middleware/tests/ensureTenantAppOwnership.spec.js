import ensureTenantAppOwnership from "../ensureTenantAppOwnership"
import { tenancy, utils } from "@budibase/backend-core"

jest.mock("@budibase/backend-core", () => ({
  tenancy: {
    getTenantId: jest.fn(),
    getTenantIDFromAppID: jest.fn(),
  },
  utils: {
    getAppIdFromCtx: jest.fn(),
  },
}))

class TestConfiguration {
  constructor(appId = "app_123") {
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

  it("calls next() when tenant IDs match", async () => {
    tenancy.getTenantIDFromAppID.mockReturnValue("tenant_1")
    tenancy.getTenantId.mockReturnValue("tenant_1")

    await config.executeMiddleware()

    expect(utils.getAppIdFromCtx).toHaveBeenCalledWith(config.ctx)
    expect(config.next).toHaveBeenCalled()
  })

  it("throws 403 when tenant IDs do not match", async () => {
    tenancy.getTenantIDFromAppID.mockReturnValue("tenant_2")
    tenancy.getTenantId.mockReturnValue("tenant_1")

    await config.executeMiddleware()

    expect(utils.getAppIdFromCtx).toHaveBeenCalledWith(config.ctx)
    expect(config.throw).toHaveBeenCalledWith(
      403,
      "Cannot export app from another tenant"
    )
  })

  it("throws 400 when appId is missing", async () => {
    utils.getAppIdFromCtx.mockResolvedValue(null)

    await config.executeMiddleware()

    expect(config.throw).toHaveBeenCalledWith(400, "appId must be provided")
  })
})
