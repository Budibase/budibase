export enum FeatureFlag {
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
  AI_AGENTS = "AI_AGENTS",
  AI_RAG = "AI_RAG",

  // Dev
  DEBUG_UI = "DEBUG_UI",
  DEV_USE_CLIENT_FROM_STORAGE = "DEV_USE_CLIENT_FROM_STORAGE",
}

export type FeatureFlags = Record<FeatureFlag, boolean>
