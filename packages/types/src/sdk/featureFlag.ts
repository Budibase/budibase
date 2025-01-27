export enum FeatureFlag {
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
  CHECK_SCREEN_COMPONENT_SETTINGS_ERRORS = "CHECK_SCREEN_COMPONENT_SETTINGS_ERRORS",

  // Account-portal
  DIRECT_LOGIN_TO_ACCOUNT_PORTAL = "DIRECT_LOGIN_TO_ACCOUNT_PORTAL",
}

export const FeatureFlagDefaults = {
  [FeatureFlag.USE_ZOD_VALIDATOR]: false,
  [FeatureFlag.CHECK_SCREEN_COMPONENT_SETTINGS_ERRORS]: false,

  // Account-portal
  [FeatureFlag.DIRECT_LOGIN_TO_ACCOUNT_PORTAL]: false,
}

export type FeatureFlags = typeof FeatureFlagDefaults
