import { TenantResolutionStrategy } from "@budibase/types"
import { addTenantToUrl, isUserInAppTenant, getTenantIDFromCtx } from "../"
import { isMultiTenant, getTenantIDFromAppID } from "../../context"

jest.mock("../../context", () => ({
  getTenantId: jest.fn(() => "budibase"),
  isMultiTenant: jest.fn(() => true),
  getTenantIDFromAppID: jest.fn(),
  getPlatformURL: jest.fn(() => "https://app.com"),
  DEFAULT_TENANT_ID: "default",
}))

const mockedIsMultiTenant = isMultiTenant as jest.MockedFunction<
  typeof isMultiTenant
>
const mockedGetTenantIDFromAppID = getTenantIDFromAppID as jest.MockedFunction<
  typeof getTenantIDFromAppID
>

describe("addTenantToUrl", () => {
  it("should append tenantId parameter to the URL", () => {
    const url = "https://budibase.com"
    const expectedUrl = "https://budibase.com?tenantId=budibase"
    expect(addTenantToUrl(url)).toEqual(expectedUrl)
  })

  it("should append tenantId parameter to the URL query string", () => {
    const url = "https://budibase.com?var=test"
    const expectedUrl = "https://budibase.com?var=test&tenantId=budibase"
    expect(addTenantToUrl(url)).toEqual(expectedUrl)
  })

  it("should not append tenantId parameter to the URL if isMultiTenant is false", () => {
    mockedIsMultiTenant.mockImplementation(() => false)

    const url = "https://budibase.com"
    const expectedUrl = "https://budibase.com"
    expect(addTenantToUrl(url)).toEqual(expectedUrl)
  })
})

describe("isUserInAppTenant", () => {
  mockedGetTenantIDFromAppID.mockImplementation(() => "budibase")
  const mockUser = { tenantId: "budibase" }

  it("returns true if user tenant ID matches app tenant ID", () => {
    const appId = "app-budibase"
    const result = isUserInAppTenant(appId, mockUser)
    expect(result).toBe(true)
  })

  it("uses default tenant ID if user is not provided", () => {
    const appId = "app-budibase"
    const result = isUserInAppTenant(appId)
    expect(result).toBe(true)
  })

  it("uses default tenant ID if app tenant ID is not found", () => {
    const appId = "not-budibase-app"
    const result = isUserInAppTenant(appId, mockUser)
    expect(result).toBe(true)
  })

  it("returns false if user tenant ID does not match app tenant ID", () => {
    const appId = "app-budibase"
    mockedGetTenantIDFromAppID.mockImplementation(() => "not-budibase")
    const result = isUserInAppTenant(appId, mockUser)
    expect(result).toBe(false)
  })
})

let mockOpts: any = {}
function createCtx(opts: {
  originalUrl?: string
  headers?: Record<string, string>
  qsTenantId?: string
  userTenantId?: string
  host?: string
  path?: string
}) {
  const createdCtx: any = {
    originalUrl: opts.originalUrl || "budibase.com",
    matched: [{ name: "name" }],
    throw: jest.fn(),
    request: { headers: {} },
  }
  if (opts.headers) {
    createdCtx.request.headers = opts.headers
  }
  if (opts.qsTenantId) {
    createdCtx.request.query = { tenantId: opts.qsTenantId }
  }
  if (opts.userTenantId) {
    createdCtx.user = { tenantId: opts.userTenantId }
  }
  if (opts.host) {
    createdCtx.host = opts.host
  }
  if (opts.path) {
    createdCtx.matched = [
      {
        paramNames: [{ name: "tenantId" }],
        params: () => ({ tenantId: opts.path }),
        captures: jest.fn(),
      },
    ]
  }

  return createdCtx as any
}

describe("getTenantIDFromCtx", () => {
  describe("when tenant can be found", () => {
    it("returns the tenant ID from the user object", () => {
      mockedIsMultiTenant.mockImplementation(() => true)
      const ctx = createCtx({ userTenantId: "budibase" })
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("budibase")
    })

    it("returns the tenant ID from the header", () => {
      mockedIsMultiTenant.mockImplementation(() => true)
      const ctx = createCtx({ headers: { "x-budibase-tenant-id": "budibase" } })
      mockOpts = { includeStrategies: [TenantResolutionStrategy.HEADER] }
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("budibase")
    })

    it("returns the tenant ID from the query param", () => {
      mockedIsMultiTenant.mockImplementation(() => true)
      mockOpts = { includeStrategies: [TenantResolutionStrategy.QUERY] }
      const ctx = createCtx({ qsTenantId: "budibase" })
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("budibase")
    })

    it("returns the tenant ID from the subdomain", () => {
      mockedIsMultiTenant.mockImplementation(() => true)
      const ctx = createCtx({ host: "bb.app.com" })
      mockOpts = { includeStrategies: [TenantResolutionStrategy.SUBDOMAIN] }
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("bb")
    })

    it("returns the tenant ID from the path", () => {
      mockedIsMultiTenant.mockImplementation(() => true)
      const ctx = createCtx({ path: "bb" })
      mockOpts = { includeStrategies: [TenantResolutionStrategy.PATH] }
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("bb")
    })
  })

  describe("when tenant cannot be found", () => {
    it("throws a 403 error if allowNoTenant is false", () => {
      const ctx = createCtx({})
      mockOpts = {
        allowNoTenant: false,
        excludeStrategies: [
          TenantResolutionStrategy.QUERY,
          TenantResolutionStrategy.SUBDOMAIN,
          TenantResolutionStrategy.PATH,
        ],
      }
      expect(getTenantIDFromCtx(ctx, mockOpts)).toBeNull()
      expect(ctx.throw).toBeCalledTimes(1)
      expect(ctx.throw).toBeCalledWith(403, "Tenant id not set")
    })

    it("returns null if allowNoTenant is true", () => {
      const ctx = createCtx({})
      mockOpts = {
        allowNoTenant: true,
        excludeStrategies: [
          TenantResolutionStrategy.QUERY,
          TenantResolutionStrategy.SUBDOMAIN,
          TenantResolutionStrategy.PATH,
        ],
      }
      expect(getTenantIDFromCtx(ctx, mockOpts)).toBeNull()
    })
  })

  it("returns the default tenant ID when isMultiTenant() returns false", () => {
    mockedIsMultiTenant.mockImplementation(() => false)
    const ctx = createCtx({})
    expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("default")
  })
})
