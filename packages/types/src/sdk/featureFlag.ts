export enum FeatureFlag {
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
  AI_AGENTS = "AI_AGENTS",
  PRIVATE_LLMS = "PRIVATE_LLMS",

  // Dev
  DEBUG_UI = "DEBUG_UI",
  DEV_USE_CLIENT_FROM_STORAGE = "DEV_USE_CLIENT_FROM_STORAGE",
}

export type FeatureFlags = Record<FeatureFlag, boolean>
