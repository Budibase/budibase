// mock the `getTenantId` and `isMultiTenant` functions
jest.mock("../../context", () => ({
  getTenantId: jest.fn(() => "budibase"),
  isMultiTenant: jest.fn(() => true),
}))

import { addTenantToUrl, isUserInAppTenant, getTenantIDFromCtx } from "../"
import { isMultiTenant, getTenantIDFromAppID } from "../../context"
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
    // mock the `isMultiTenant` function to return false

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

const mockCtx = {
  user: { tenantId: "123" },
  request: {
    headers: { "X-Tenant-ID": "456" },
    query: { tenantId: "789" },
  },
  host: "tenant.budibase.app",
  originalUrl: "/tenant/123",
  matched: [
    {
      paramNames: [{ name: "tenantId" }],
      params: (url: any, captures: any, ctx: any) => ({ tenantId: "456" }),
    },
  ],
}
const mockOpts = {
  allowNoTenant: false,
  includeStrategies: ["USER", "HEADER", "QUERY", "SUBDOMAIN", "PATH"],
  excludeStrategies: ["QUERY"],
}
// mock the `getTenantId` and `isMultiTenant` functions
jest.mock("../../context", () => ({
  isMultiTenant: jest.fn(() => true),
}))
describe("getTenantIDFromCtx", () => {
  describe("when isMultiTenant() returns true", () => {
    beforeEach(() => {
      jest.spyOn(global, "isMultiTenant").mockReturnValue(true)
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    describe("when tenant can be found", () => {
      it("returns the tenant ID from the user object", () => {
        expect(getTenantIDFromCtx(mockCtx, mockOpts)).toEqual("123")
      })

      it("returns the tenant ID from the header", () => {
        mockCtx.user = null
        expect(getTenantIDFromCtx(mockCtx, mockOpts)).toEqual("456")
      })

      it("returns the tenant ID from the query param", () => {
        mockCtx.user = null
        mockCtx.request.headers = {}
        expect(getTenantIDFromCtx(mockCtx, mockOpts)).toEqual("789")
      })

      it("returns the tenant ID from the subdomain", () => {
        mockCtx.user = null
        mockCtx.request.headers = {}
        mockCtx.request.query = {}
        expect(getTenantIDFromCtx(mockCtx, mockOpts)).toEqual("tenant")
      })

      it("returns the tenant ID from the path", () => {
        mockCtx.user = null
        mockCtx.request.headers = {}
        mockCtx.request.query = {}
        mockCtx.host = "budibase.app"
        expect(getTenantIDFromCtx(mockCtx, mockOpts)).toEqual("123")
      })
    })

    describe("when tenant cannot be found", () => {
      it("throws a 403 error if allowNoTenant is false", () => {
        mockCtx.user = null
        mockCtx.request.headers = {}
        mockCtx.request.query = {}
        mockCtx.host = "budibase.app"
        mockOpts.allowNoTenant = false
        expect(() => getTenantIDFromCtx(mockCtx, mockOpts)).toThrowError(
          "Tenant id not set"
        )
      })

      it("returns null if allowNoTenant is true", () => {
        mockCtx.user = null
        mockCtx.request.headers = {}
        mockCtx.request.query = {}
        mockCtx.host = "budibase.app"
        mockOpts.allowNoTenant = true
        expect(getTenantIDFromCtx(mockCtx, mockOpts)).toBeNull()
      })
    })
  })

  it("returns the default tenant ID when isMultiTenant() returns false", () => {
    mockedIsMultiTenant.mockImplementation(() => false)
    expect(getTenantIDFromCtx(mockCtx, mockOpts)).toEqual("default")
  })
})
