import { features } from "@budibase/backend-core"
import env from "./environment"

enum AppFeature {
  API = "api",
  AUTOMATIONS = "automations",
}

const featureList = features.processFeatureEnvVar<AppFeature>(
  Object.values(AppFeature),
  env.APP_FEATURES
)

export function isFeatureEnabled(feature: AppFeature) {
  return featureList.includes(feature)
}

export function automationsEnabled() {
  return featureList.includes(AppFeature.AUTOMATIONS)
}

export function apiEnabled() {
  return featureList.includes(AppFeature.API)
}
