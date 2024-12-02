export enum FeatureFlag {
  AUTOMATION_BRANCHING = "AUTOMATION_BRANCHING",
  AI_CUSTOM_CONFIGS = "AI_CUSTOM_CONFIGS",
  DEFAULT_VALUES = "DEFAULT_VALUES",
  BUDIBASE_AI = "BUDIBASE_AI",
  USE_ZOD_VALIDATOR = "USE_ZOD_VALIDATOR",
}

export interface TenantFeatureFlags {
  [key: string]: FeatureFlag[]
}
