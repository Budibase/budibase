import licensing from "../licensing"
import { createMockContext } from "@shopify/jest-koa-mocks"
import { BBContext } from "@budibase/types"
import * as quotas from "../../sdk/quotas/quotas"

// Mock usageLimitIsExceeded at the module level
jest.mock("../../sdk/quotas/quotas", () => {
  const actual = jest.requireActual("../../sdk/quotas/quotas")
  return {
    ...actual,
    usageLimitIsExceeded: jest.fn(),
  }
})

describe("Licensing middleware", () => {
  let next: any
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
    next = jest.fn()
  })

  const assertCallToUsersLimitCheck = async (
    currentPath: string,
    timesCalled: number
  ) => {
    const usageLimitIsExceededMock = jest
      .mocked(quotas.usageLimitIsExceeded)
      .mockResolvedValue(false)

    const licensingMiddleware = licensing({
      checkUsersLimit: true,
    })

    ctx.licensingCheck = true
    ctx.path = currentPath
    await licensingMiddleware(ctx, next)

    expect(usageLimitIsExceededMock).toHaveBeenCalledTimes(timesCalled)
    expect(next).toHaveBeenCalledTimes(1)
  }

  it("Users limit shouldn't be checked if context is not in the proper url", async () =>
    assertCallToUsersLimitCheck("home", 0))

  it("Users limit should be checked if context is in the proper url", async () =>
    assertCallToUsersLimitCheck("/api/public/v1/billing", 1))
})
