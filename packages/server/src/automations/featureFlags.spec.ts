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

const isDebugUiTrusted = jest.mocked(features.isEnabledWithoutOverrides)
const getOverrides = jest.mocked(context.getFeatureFlagOverrides)

describe("automation feature flag overrides", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("does not propagate overrides when Debug UI is not trusted", async () => {
    isDebugUiTrusted.mockResolvedValue(false)
    getOverrides.mockReturnValue({
      [FeatureFlag.DEBUG_UI]: true,
    })

    await expect(getAutomationFeatureFlagOverrides()).resolves.toEqual({})
    expect(isDebugUiTrusted).toHaveBeenCalledWith(FeatureFlag.DEBUG_UI)
    expect(getOverrides).not.toHaveBeenCalled()
  })

  it("does not prevent automation execution when trusted flags cannot be resolved", async () => {
    const error = new Error("Unable to load flags")
    const warn = jest.spyOn(console, "warn").mockImplementation()
    isDebugUiTrusted.mockRejectedValue(error)

    await expect(getAutomationFeatureFlagOverrides()).resolves.toEqual({})
    expect(warn).toHaveBeenCalledWith(
      "Unable to resolve automation feature flag overrides",
      error
    )
  })

  it("propagates all feature flag overrides", async () => {
    isDebugUiTrusted.mockResolvedValue(true)
    getOverrides.mockReturnValue({
      [FeatureFlag.AI_TOOL_ESCALATION]: true,
      [FeatureFlag.AI_AGENT_TOOL_SECURITY]: false,
      [FeatureFlag.AI_AGENT_ACTIVITY]: true,
      [FeatureFlag.DEBUG_UI]: true,
    })

    await expect(getAutomationFeatureFlagOverrides()).resolves.toEqual({
      [FeatureFlag.AI_TOOL_ESCALATION]: true,
      [FeatureFlag.AI_AGENT_TOOL_SECURITY]: false,
      [FeatureFlag.AI_AGENT_ACTIVITY]: true,
      [FeatureFlag.DEBUG_UI]: true,
    })
  })
})
