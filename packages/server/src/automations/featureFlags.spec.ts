import { context, features } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"
import { getAutomationFeatureFlagOverrides } from "./featureFlags"

jest.mock("@budibase/backend-core", () => ({
  context: {
    getFeatureFlagOverrides: jest.fn(),
  },
  features: {
    isEnabledWithoutOverrides: jest.fn(),
  },
}))

const areFeatureFlagOverridesTrusted = jest.mocked(
  features.isEnabledWithoutOverrides
)
const getOverrides = jest.mocked(context.getFeatureFlagOverrides)

describe("automation feature flag overrides", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("does not propagate overrides when feature flag overrides are not trusted", async () => {
    areFeatureFlagOverridesTrusted.mockResolvedValue(false)
    getOverrides.mockReturnValue({
      [FeatureFlag.FEATURE_FLAG_OVERRIDES]: true,
    })

    await expect(getAutomationFeatureFlagOverrides()).resolves.toEqual({})
    expect(areFeatureFlagOverridesTrusted).toHaveBeenCalledWith(
      FeatureFlag.FEATURE_FLAG_OVERRIDES
    )
    expect(getOverrides).not.toHaveBeenCalled()
  })

  it("does not prevent automation execution when trusted flags cannot be resolved", async () => {
    const error = new Error("Unable to load flags")
    const warn = jest.spyOn(console, "warn").mockImplementation()
    areFeatureFlagOverridesTrusted.mockRejectedValue(error)

    await expect(getAutomationFeatureFlagOverrides()).resolves.toEqual({})
    expect(warn).toHaveBeenCalledWith(
      "Unable to resolve automation feature flag overrides",
      error
    )
  })

  it("propagates all feature flag overrides", async () => {
    areFeatureFlagOverridesTrusted.mockResolvedValue(true)
    getOverrides.mockReturnValue({
      [FeatureFlag.AI_TOOL_ESCALATION]: true,
      [FeatureFlag.AI_AGENT_TOOL_SECURITY]: false,
      [FeatureFlag.AI_AGENT_ACTIVITY]: true,
      [FeatureFlag.FEATURE_FLAG_OVERRIDES]: true,
    })

    await expect(getAutomationFeatureFlagOverrides()).resolves.toEqual({
      [FeatureFlag.AI_TOOL_ESCALATION]: true,
      [FeatureFlag.AI_AGENT_TOOL_SECURITY]: false,
      [FeatureFlag.AI_AGENT_ACTIVITY]: true,
      [FeatureFlag.FEATURE_FLAG_OVERRIDES]: true,
    })
  })
})
