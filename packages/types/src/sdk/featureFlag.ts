export enum FeatureFlag {
  AUTOMATION_BRANCHING = "AUTOMATION_BRANCHING",
  AI_CUSTOM_CONFIGS = "AI_CUSTOM_CONFIGS",
  DEFAULT_VALUES = "DEFAULT_VALUES",
  BUDIBASE_AI = "BUDIBASE_AI",
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
}

export const FeatureFlagDefaults = {
  [FeatureFlag.DEFAULT_VALUES]: true,
  [FeatureFlag.AUTOMATION_BRANCHING]: true,
  [FeatureFlag.AI_CUSTOM_CONFIGS]: true,
  [FeatureFlag.BUDIBASE_AI]: true,
  [FeatureFlag.USE_ZOD_VALIDATOR]: false,
}

export type FeatureFlags = typeof FeatureFlagDefaults
