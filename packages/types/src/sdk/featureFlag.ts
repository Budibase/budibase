export enum FeatureFlag {
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
  VALIDATE_HBS_MISSING_EXPRESSIONS = "VALIDATE_HBS_MISSING_EXPRESSIONS",

  // Account-portal
  DIRECT_LOGIN_TO_ACCOUNT_PORTAL = "DIRECT_LOGIN_TO_ACCOUNT_PORTAL",
}

export const FeatureFlagDefaults = {
  [FeatureFlag.USE_ZOD_VALIDATOR]: false,
  [FeatureFlag.VALIDATE_HBS_MISSING_EXPRESSIONS]: false,

  // Account-portal
  [FeatureFlag.DIRECT_LOGIN_TO_ACCOUNT_PORTAL]: false,
}

export type FeatureFlags = typeof FeatureFlagDefaults
