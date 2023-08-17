import env from "./environment"

enum WorkerFeature {}

const featureList: WorkerFeature[] = processFeatureList()

function processFeatureList() {
  const fullList = Object.values(WorkerFeature) as string[]
  let list
  if (!env.WORKER_FEATURES) {
    list = fullList
  } else {
    list = env.WORKER_FEATURES.split(",")
  }
  for (let feature of list) {
    if (!fullList.includes(feature)) {
      throw new Error(`Feature: ${feature} is not an allowed option`)
    }
  }
  // casting ok - confirmed definitely is a list of worker features
  return list as unknown as WorkerFeature[]
}

export function isFeatureEnabled(feature: WorkerFeature) {
  return featureList.includes(feature)
}
