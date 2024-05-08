/**
 * Util to check is a given value is "better" than another. "Betterness" is
 * defined as presence and length.
 */
const isBetterSample = (newValue, oldValue) => {
  // Prefer non-null values
  if (oldValue == null && newValue != null) {
    return true
  }

  if (oldValue != null && newValue == null) {
    return false
  }

  // Don't change type
  const oldType = typeof oldValue
  const newType = typeof newValue
  if (oldType !== newType) {
    return false
  }

  // Prefer longer values
  if (newType === "string" && newValue.length > oldValue.length) {
    return true
  }
  if (
    newType === "object" &&
    Object.keys(newValue).length > Object.keys(oldValue).length
  ) {
    return true
  }

  return false
}

/**
 * Generates a best-case example object of the provided samples.
 * The generated sample does not necessarily exist - it simply is a sample that
 * contains "good" examples for every property of all the samples.
 * The generate sample will have a value for all keys across all samples.
 */
export const generateGoldenSample = samples => {
  let goldenSample = {}
  samples?.slice(0, 100).forEach(sample => {
    Object.keys(sample).forEach(key => {
      if (isBetterSample(sample[key], goldenSample[key])) {
        goldenSample[key] = sample[key]
      }
    })
  })
  return goldenSample
}
