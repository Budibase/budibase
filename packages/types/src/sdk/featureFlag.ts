export enum FeatureFlag {
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
  AI_AGENTS = "AI_AGENTS",
  ESM_CLIENT = "ESM_CLIENT",
  DUPLICATE_APP = "DUPLICATE_APP",

  // Dev
  DEBUG_UI = "DEBUG_UI",
  DEV_USE_CLIENT_FROM_STORAGE = "DEV_USE_CLIENT_FROM_STORAGE",
}

export type FeatureFlags = Record<FeatureFlag, boolean>
