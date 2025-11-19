import lockout from "../lockout"
import { cache } from "@budibase/backend-core"
import * as userSdk from "../../sdk/users"
import env from "../../environment"

jest.mock("@budibase/backend-core", () => ({
  cache: {
    get: jest.fn(),
  },
}))

jest.mock("../../sdk/users", () => ({
  db: {
    getUserByEmail: jest.fn(),
  },
}))

describe("lockout middleware", () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      request: {
        body: {},
      },
      set: jest.fn(),
      throw: jest.fn(),
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  it("should call next if no email provided", async () => {
    ctx.request.body = {}

    await lockout(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should call next if user not found", async () => {
    ctx.request.body = { username: "test@example.com" }
    ;(userSdk.db.getUserByEmail as jest.Mock).mockResolvedValue(null)

    await lockout(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should call next if user exists but not locked", async () => {
    ctx.request.body = { username: "test@example.com" }
    ;(userSdk.db.getUserByEmail as jest.Mock).mockResolvedValue({
      email: "test@example.com",
    })
    ;(cache.get as jest.Mock).mockResolvedValue(null)

    await lockout(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should throw 403 if user is locked", async () => {
    ctx.request.body = { username: "test@example.com" }
    ;(userSdk.db.getUserByEmail as jest.Mock).mockResolvedValue({
      email: "test@example.com",
    })
    ;(cache.get as jest.Mock).mockResolvedValue("1")

    // Mock ctx.throw to actually throw
    ctx.throw = jest.fn().mockImplementation((status, message) => {
      const error = new Error(message)
      ;(error as any).status = status
      throw error
    })

    await expect(lockout(ctx, next)).rejects.toThrow(
      "Account temporarily locked. Try again later."
    )

    expect(next).not.toHaveBeenCalled()
    expect(ctx.set).toHaveBeenCalledWith("X-Account-Locked", "1")
    expect(ctx.set).toHaveBeenCalledWith(
      "Retry-After",
      String(env.LOGIN_LOCKOUT_SECONDS)
    )
    expect(ctx.throw).toHaveBeenCalledWith(
      403,
      "Account temporarily locked. Try again later."
    )
  })
})
