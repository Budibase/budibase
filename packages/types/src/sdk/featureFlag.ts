export enum FeatureFlag {
  AI_AGENTS = "AI_AGENTS",

  // Dev
  DEBUG_UI = "DEBUG_UI",
  DEV_USE_CLIENT_FROM_STORAGE = "DEV_USE_CLIENT_FROM_STORAGE",
}

export type FeatureFlags = Record<FeatureFlag, boolean>
