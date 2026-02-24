import { activeTenant } from "../activation"
import { ConfigType } from "@budibase/types"
import * as configs from "../../configs"

// Mock the configs module
jest.mock("../../configs", () => ({
  getConfig: jest.fn(),
}))

const mockGetConfig = configs.getConfig as jest.MockedFunction<
  typeof configs.getConfig
>

describe("activeTenant middleware", () => {
  let ctx: any
  let next: jest.MockedFunction<any>

  beforeEach(() => {
    ctx = {
      status: undefined,
      body: undefined,
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  it("should proceed to next middleware when tenant is active", async () => {
    mockGetConfig.mockResolvedValue({
      type: ConfigType.SETTINGS,
      config: { active: true },
    })

    const middleware = activeTenant()
    await middleware(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.status).toBeUndefined()
  })

  it("should return 404 when tenant is inactive", async () => {
    mockGetConfig.mockResolvedValue({
      type: ConfigType.SETTINGS,
      config: { active: false },
    })

    const middleware = activeTenant()
    await middleware(ctx, next)

    expect(next).not.toHaveBeenCalled()
    expect(ctx.status).toBe(404)
    expect(ctx.body).toEqual({ message: "Tenant not found" })
  })

  it("should proceed when settings config does not exist", async () => {
    mockGetConfig.mockResolvedValue(undefined)

    const middleware = activeTenant()
    await middleware(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.status).toBeUndefined()
  })

  it("should proceed when Global DB not found (public endpoints)", async () => {
    const globalDbError = new Error("Global DB not found")
    mockGetConfig.mockRejectedValue(globalDbError)

    const middleware = activeTenant()
    await middleware(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.status).toBeUndefined()
  })

  it("should throw other errors", async () => {
    const otherError = new Error("Some other error")
    mockGetConfig.mockRejectedValue(otherError)

    const middleware = activeTenant()

    await expect(middleware(ctx, next)).rejects.toThrow("Some other error")
    expect(next).not.toHaveBeenCalled()
  })

  it("should call getConfig with SETTINGS type", async () => {
    mockGetConfig.mockResolvedValue({
      type: ConfigType.SETTINGS,
      config: { active: true },
    })

    const middleware = activeTenant()
    await middleware(ctx, next)

    expect(mockGetConfig).toHaveBeenCalledWith(ConfigType.SETTINGS)
  })
})
