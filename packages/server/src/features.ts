import env from "./environment"

enum AppFeature {
  API = "api",
  AUTOMATIONS = "automations",
}

const featureList = processFeatureList()

function processFeatureList() {
  const fullList = Object.values(AppFeature) as string[]
  let list
  if (!env.APP_FEATURES) {
    list = fullList
  } else {
    list = env.APP_FEATURES.split(",")
  }
  for (let feature of list) {
    if (!fullList.includes(feature)) {
      throw new Error(`Feature: ${feature} is not an allowed option`)
    }
  }
  return list
}

export function isFeatureEnabled(feature: AppFeature) {
  return featureList.includes(feature)
}

export function automationsEnabled() {
  return featureList.includes(AppFeature.AUTOMATIONS)
}

export function apiEnabled() {
  return featureList.includes(AppFeature.API)
}
