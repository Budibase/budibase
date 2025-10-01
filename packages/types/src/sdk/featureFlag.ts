export enum FeatureFlag {
  DEBUG_UI = "DEBUG_UI",
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
  AI_AGENTS = "AI_AGENTS",
  USE_DYNAMIC_LOADING = "USE_DYNAMIC_LOADING",
  DUPLICATE_APP = "DUPLICATE_APP",
  COPY_APPS_BETWEEN_WORKSPACES = "COPY_APPS_BETWEEN_WORKSPACES",

  // Account-portal
  DIRECT_LOGIN_TO_ACCOUNT_PORTAL = "DIRECT_LOGIN_TO_ACCOUNT_PORTAL",
}

export const FeatureFlagDefaults: Record<FeatureFlag, boolean> = {
  [FeatureFlag.USE_ZOD_VALIDATOR]: false,
  [FeatureFlag.AI_AGENTS]: false,
  [FeatureFlag.USE_DYNAMIC_LOADING]: true,
  [FeatureFlag.COPY_APPS_BETWEEN_WORKSPACES]: false,

  // Account-portal
  [FeatureFlag.DIRECT_LOGIN_TO_ACCOUNT_PORTAL]: false,

  [FeatureFlag.DEBUG_UI]: false,
  [FeatureFlag.DUPLICATE_APP]: false,
}

export type FeatureFlags = typeof FeatureFlagDefaults
