import ipLockout from "../ipLockout"
import { cache } from "@budibase/backend-core"
import env from "../../environment"

jest.mock("@budibase/backend-core", () => ({
  cache: {
    get: jest.fn(),
    store: jest.fn(),
  },
}))

describe("ipLockout middleware", () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      ip: "1.2.3.4",
      set: jest.fn(),
      throw: jest.fn(),
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  it("should call next if no IP is present", async () => {
    ctx.ip = ""

    await ipLockout(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should call next when count is below the limit", async () => {
    jest.mocked(cache.get).mockResolvedValue(0)

    await ipLockout(ctx, next)

    expect(cache.store).toHaveBeenCalledWith(
      "auth:login:ip:1.2.3.4",
      1,
      env.LOGIN_LOCKOUT_SECONDS
    )
    expect(next).toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should call next when count equals the limit", async () => {
    jest.mocked(cache.get).mockResolvedValue(env.LOGIN_IP_LOCKOUT_LIMIT - 1)

    await ipLockout(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should throw 429 with Retry-After when count exceeds the limit", async () => {
    jest.mocked(cache.get).mockResolvedValue(env.LOGIN_IP_LOCKOUT_LIMIT)

    ctx.throw = jest.fn().mockImplementation((status, message) => {
      const error = new Error(message)
      ;(error as any).status = status
      throw error
    })

    await expect(ipLockout(ctx, next)).rejects.toThrow(
      "Too many login attempts. Try again later."
    )

    expect(next).not.toHaveBeenCalled()
    expect(ctx.set).toHaveBeenCalledWith(
      "Retry-After",
      String(env.LOGIN_LOCKOUT_SECONDS)
    )
    expect(ctx.throw).toHaveBeenCalledWith(
      429,
      "Too many login attempts. Try again later."
    )
  })
})
