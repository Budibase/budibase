export enum FeatureFlag {
  DEBUG_UI = "DEBUG_UI",
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
  AI_JS_GENERATION = "AI_JS_GENERATION",
  AI_TABLE_GENERATION = "AI_TABLE_GENERATION",
  AI_AGENTS = "AI_AGENTS",
  WORKSPACES = "WORKSPACES",

  // Account-portal
  DIRECT_LOGIN_TO_ACCOUNT_PORTAL = "DIRECT_LOGIN_TO_ACCOUNT_PORTAL",
}

export const FeatureFlagDefaults: Record<FeatureFlag, boolean> = {
  [FeatureFlag.USE_ZOD_VALIDATOR]: false,
  [FeatureFlag.AI_JS_GENERATION]: true,
  [FeatureFlag.AI_TABLE_GENERATION]: true,
  [FeatureFlag.AI_AGENTS]: false,
  [FeatureFlag.WORKSPACES]: false,

  // Account-portal
  [FeatureFlag.DIRECT_LOGIN_TO_ACCOUNT_PORTAL]: false,

  [FeatureFlag.DEBUG_UI]: false,
}

export type FeatureFlags = typeof FeatureFlagDefaults
