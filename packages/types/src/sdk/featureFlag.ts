export enum FeatureFlag {
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
}

export const FeatureFlagDefaults = {
  [FeatureFlag.USE_ZOD_VALIDATOR]: false,
}

export type FeatureFlags = typeof FeatureFlagDefaults
