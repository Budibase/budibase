import ensureTenantAppOwnership from "../ensureTenantAppOwnership"
import { tenancy, utils } from "@budibase/backend-core"

jest.mock("@budibase/backend-core", () => ({
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

  it("throws 403 when appId does not match tenant ID", async () => {
    tenancy.getTenantId.mockReturnValue("tenant_2")

    await config.executeMiddleware()

    expect(utils.getAppIdFromCtx).toHaveBeenCalledWith(config.ctx)
    expect(config.throw).toHaveBeenCalledWith(
      403,
      "App does not belong to tenant"
    )
  })

  it("throws 400 when appId is missing", async () => {
    utils.getAppIdFromCtx.mockResolvedValue(null)

    await config.executeMiddleware()

    expect(config.throw).toHaveBeenCalledWith(400, "appId must be provided")
  })
})
