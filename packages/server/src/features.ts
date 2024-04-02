import { features } from "@budibase/backend-core"
import env from "./environment"

// eslint-disable-next-line no-unused-vars
enum AppFeature {
  // eslint-disable-next-line no-unused-vars
  API = "api",
  // eslint-disable-next-line no-unused-vars
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

export function printFeatures() {
  if (!env.APP_FEATURES) {
    return
  }
  console.log(`**** APP FEATURES SET: ${featureList.join(", ")} ****`)
}
