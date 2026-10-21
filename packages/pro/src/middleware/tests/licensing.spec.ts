import { createMockContext } from "@shopify/jest-koa-mocks"
import { roles } from "@budibase/backend-core"
import { BBContext } from "@budibase/types"
import licensing from "../licensing"
import * as quotas from "../../sdk/quotas/quotas"
import { UNLIMITED_LICENSE } from "../../constants/licenses"

// Mock usageLimitIsExceeded at the module level
jest.mock("../../sdk/quotas/quotas", () => {
  const actual = jest.requireActual("../../sdk/quotas/quotas")
  return {
    ...actual,
    usageLimitIsExceeded: jest.fn(),
  }
})

describe("Licensing middleware", () => {
  let next: jest.Mock
  let ctx: BBContext

  beforeEach(() => {
    jest.clearAllMocks()
    ctx = createMockContext() as unknown as BBContext
    ctx.user = {
      _id: "us_123",
      email: "fake-email@budibase.com",
      tenantId: "124",
      accountPortalAccess: true,
      account: undefined,
    }
    ctx.isAuthenticated = true
    next = jest.fn()
    jest.mocked(quotas.usageLimitIsExceeded).mockResolvedValue(false)
  })

  const runLicensing = async ({ path }: { path: string }) => {
    const licensingMiddleware = licensing({
      checkUsersLimit: true,
    })

    ctx.path = path
    await licensingMiddleware(ctx, next)
  }

  it("does not check user limits for unrelated routes", async () => {
    await runLicensing({ path: "/home" })

    expect(quotas.usageLimitIsExceeded).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it("checks user limits for authenticated public API requests", async () => {
    await runLicensing({ path: "/api/public/v1/billing" })

    expect(quotas.usageLimitIsExceeded).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it("attaches the license without checking user limits for anonymous app requests", async () => {
    ctx.isAuthenticated = false
    ctx.user = {
      email: "",
      tenantId: "124",
      roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
    }

    await runLicensing({ path: "/app_test" })

    expect(ctx.user?.license).toEqual(UNLIMITED_LICENSE)
    expect(quotas.usageLimitIsExceeded).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it("attaches the license and checks user limits for authenticated app requests", async () => {
    await runLicensing({ path: "/app_test" })

    expect(ctx.user?.license).toEqual(UNLIMITED_LICENSE)
    expect(quotas.usageLimitIsExceeded).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
