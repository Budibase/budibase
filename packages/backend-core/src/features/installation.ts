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
