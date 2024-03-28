import { features } from "@budibase/backend-core"
import env from "./environment"

// eslint-disable-next-line no-unused-vars
enum WorkerFeature {}

const featureList: WorkerFeature[] = features.processFeatureEnvVar(
  Object.values(WorkerFeature),
  env.WORKER_FEATURES
)

export function isFeatureEnabled(feature: WorkerFeature) {
  return featureList.includes(feature)
}
