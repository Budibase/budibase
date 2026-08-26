import { features } from "@budibase/backend-core"
import { FeatureFlag, type Ctx } from "@budibase/types"
import { debugUIEnabled } from "../debugUIEnabled"

jest.mock("@budibase/backend-core", () => ({
  features: {
    isEnabledWithoutOverrides: jest.fn(),
  },
}))

const createCtx = (): Ctx =>
  ({
    throw: jest.fn((status, message) => {
      throw Object.assign(new Error(message), { status })
    }),
  }) as unknown as Ctx

describe("debugUIEnabled middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("rejects overrides when trusted Debug UI is disabled", async () => {
    jest.mocked(features.isEnabledWithoutOverrides).mockResolvedValue(false)
    const next = jest.fn()

    await expect(debugUIEnabled(createCtx(), next)).rejects.toMatchObject({
      status: 403,
    })

    expect(features.isEnabledWithoutOverrides).toHaveBeenCalledWith(
      FeatureFlag.DEBUG_UI
    )
    expect(next).not.toHaveBeenCalled()
  })

  it("allows overrides when trusted Debug UI is enabled", async () => {
    jest.mocked(features.isEnabledWithoutOverrides).mockResolvedValue(true)
    const next = jest.fn()

    await debugUIEnabled(createCtx(), next)

    expect(next).toHaveBeenCalled()
  })
})
