import ipLockout from "../ipLockout"
import { cache } from "@budibase/backend-core"
import env from "../../environment"

jest.mock("@budibase/backend-core", () => ({
  ...jest.requireActual("@budibase/backend-core"),
  cache: {
    get: jest.fn(),
    increment: jest.fn(),
  },
}))

describe("ipLockout middleware", () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      request: { headers: { "x-real-ip": "1.2.3.4" } },
      req: { socket: { remoteAddress: "10.0.0.1" } },
      set: jest.fn(),
      throw: jest.fn(),
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  it("should call next if no IP can be resolved", async () => {
    ctx.request.headers = {}
    ctx.req.socket.remoteAddress = ""

    await ipLockout(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(cache.get).not.toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should call next when there are no recorded failures", async () => {
    jest.mocked(cache.get).mockResolvedValue(null)

    await ipLockout(ctx, next)

    expect(cache.get).toHaveBeenCalledWith("auth:login:ip:1.2.3.4")
    expect(next).toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should never increment the counter itself", async () => {
    jest.mocked(cache.get).mockResolvedValue(1)

    await ipLockout(ctx, next)

    expect(cache.increment).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it("should call next when failures are one below the limit", async () => {
    jest.mocked(cache.get).mockResolvedValue(env.LOGIN_IP_LOCKOUT_LIMIT - 1)

    await ipLockout(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.throw).not.toHaveBeenCalled()
  })

  it("should throw 429 with Retry-After once failures reach the limit", async () => {
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
