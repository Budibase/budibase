import { features } from "@budibase/backend-core"
import { FeatureFlag, type Ctx } from "@budibase/types"
import { featureFlagOverridesEnabled } from "../featureFlagOverridesEnabled"

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

describe("featureFlagOverridesEnabled middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("rejects overrides when trusted overrides are disabled", async () => {
    jest.mocked(features.isEnabledWithoutOverrides).mockResolvedValue(false)
    const next = jest.fn()

    await expect(
      featureFlagOverridesEnabled(createCtx(), next)
    ).rejects.toMatchObject({ status: 403 })

    expect(features.isEnabledWithoutOverrides).toHaveBeenCalledWith(
      FeatureFlag.FEATURE_FLAG_OVERRIDES
    )
    expect(next).not.toHaveBeenCalled()
  })

  it("allows overrides when trusted overrides are enabled", async () => {
    jest.mocked(features.isEnabledWithoutOverrides).mockResolvedValue(true)
    const next = jest.fn()

    await featureFlagOverridesEnabled(createCtx(), next)

    expect(next).toHaveBeenCalled()
  })
})
