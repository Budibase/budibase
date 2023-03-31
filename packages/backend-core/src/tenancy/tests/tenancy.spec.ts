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

describe("getTenantIDFromCtx", () => {})
