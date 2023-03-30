import {
  DEFAULT_TENANT_ID,
  getTenantId,
  getTenantIDFromAppID,
  isMultiTenant,
} from "../../src/context"
import env from "../../src/environment"
import {
  BBContext,
  TenantResolutionStrategy,
  GetTenantIdOptions,
} from "@budibase/types"
import { Header } from "../../src/constants"
import {
  addTenantToUrl,
  isUserInAppTenant,
  getTenantIDFromCtx,
} from "../../src/tenancy"

// mock the `getTenantId` and `isMultiTenant` functions
jest.mock("../../src/context", () => ({
  getTenantId: jest.fn(() => "budibase"),
  isMultiTenant: jest.fn(() => true),
}))

describe("addTenantToUrl", () => {
  it("should append tenantId parameter to the URL", () => {
    const url = "https://budibase.com"
    const expectedUrl = "https://budibase.com?tenantId=budibase"
    expect(addTenantToUrl(url)).toEqual(expectedUrl)
  })

  it("should append tenantId parameter to the URL query string", () => {
    const url = "https://budibase.com?var=test"
    const expectedUrl = "https://budibase.com?var=test&tenantId=default"
    expect(addTenantToUrl(url)).toEqual(expectedUrl)
  })

  it("should not append tenantId parameter to the URL if isMultiTenant is false", () => {
    // mock the `isMultiTenant` function to return false
    jest.mock("../../src/context", () => ({
      getTenantId: jest.fn(() => "default"),
      isMultiTenant: jest.fn(() => false),
    }))

    const url = "https://budibase.com"
    const expectedUrl = "https://budibase.com"
    expect(addTenantToUrl(url)).toEqual(expectedUrl)
  })
})
