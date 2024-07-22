import env from "./environment"

enum AppFeature {
  API = "api",
  AUTOMATIONS = "automations",
}

export function processFeatureEnvVar<T>(
  fullList: string[],
  featureList?: string
) {
  let list
  if (!featureList) {
    list = fullList
  } else {
    list = featureList.split(",")
  }
  for (let feature of list) {
    if (!fullList.includes(feature)) {
      throw new Error(`Feature: ${feature} is not an allowed option`)
    }
  }
  return list as unknown as T[]
}

const featureList = processFeatureEnvVar<AppFeature>(
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
