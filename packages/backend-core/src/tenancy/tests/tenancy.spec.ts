// mock the `getTenantId` and `isMultiTenant` functions
jest.mock("../../context", () => ({
  getTenantId: jest.fn(() => "budibase"),
  isMultiTenant: jest.fn(() => true),
}))

import { TenantResolutionStrategy } from "@budibase/types"
import { addTenantToUrl, isUserInAppTenant, getTenantIDFromCtx } from "../"
import {
  isMultiTenant,
  getTenantIDFromAppID,
  DEFAULT_TENANT_ID,
} from "../../context"
import { any } from "joi"
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

jest.mock("../../context", () => ({
  getTenantId: jest.fn(() => "budibase"),
  getTenantIDFromAppID: jest.fn(() => "budibase"),
}))
describe("isUserInAppTenant", () => {
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
jest.mock("../../context", () => ({
  isMultiTenant: jest.fn(() => true),
}))

function createCtx(opts: {
  originalUrl?: string
  headers?: string[]
  qsTenantId?: string
  userTenantId?: string
  host?: string
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

  return createdCtx as any
}
jest.mock("../../../src/constants/misc", () => ({
  DEFAULT_TENANT_ID: "default",
}))
describe("getTenantIDFromCtx", () => {
  describe("when tenant can be found", () => {
    it("returns the tenant ID from the user object", () => {
      const ctx = createCtx({ userTenantId: "budibase" })
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("budibase")
    })

    it("returns the tenant ID from the header", () => {
      const ctx = createCtx({ headers: ["TENANT_ID=budibase"] })
      mockOpts = { includeStrategies: [TenantResolutionStrategy.HEADER] }
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("budibase")
    })

    it("returns the tenant ID from the query param", () => {
      mockOpts = { includeStrategies: [TenantResolutionStrategy.QUERY] }
      const ctx = createCtx({ qsTenantId: "budibase" })
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("budibase")
    })

    it("returns the tenant ID from the subdomain", () => {
      const ctx = createCtx({ host: "bb.app.com" })
      mockOpts = { includeStrategies: [TenantResolutionStrategy.SUBDOMAIN] }
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("bb")
    })

    it("returns the tenant ID from the path", () => {
      const ctx = createCtx({ host: "bb" })
      mockOpts = { includeStrategies: [TenantResolutionStrategy.PATH] }
      expect(getTenantIDFromCtx(ctx, mockOpts)).toEqual("123")
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
      expect(() => getTenantIDFromCtx(ctx, mockOpts)).rejects.toThrowError(
        "Tenant id not set"
      )
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
