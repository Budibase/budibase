export enum FeatureFlag {
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
  AI_JS_GENERATION = "AI_JS_GENERATION",
  OAUTH2_CONFIG = "OAUTH2_CONFIG",

  // Account-portal
  DIRECT_LOGIN_TO_ACCOUNT_PORTAL = "DIRECT_LOGIN_TO_ACCOUNT_PORTAL",
}

export const FeatureFlagDefaults: Record<FeatureFlag, boolean> = {
  [FeatureFlag.USE_ZOD_VALIDATOR]: false,
  [FeatureFlag.AI_JS_GENERATION]: false,
  [FeatureFlag.OAUTH2_CONFIG]: false,

  // Account-portal
  [FeatureFlag.DIRECT_LOGIN_TO_ACCOUNT_PORTAL]: false,
}

export type FeatureFlags = typeof FeatureFlagDefaults
