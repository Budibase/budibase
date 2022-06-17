const env = require("../environment")
const tenancy = require("../tenancy")

/**
 * Read the TENANT_FEATURE_FLAGS env var and return an array of features flags for each tenant.
 * The env var is formatted as:
 *  tenant1:feature1:feature2,tenant2:feature1
 */
const getFeatureFlags = () => {
  if (!env.TENANT_FEATURE_FLAGS) {
    return
  }

  const tenantFeatureFlags = {}

  env.TENANT_FEATURE_FLAGS.split(",").forEach(tenantToFeatures => {
    const [tenantId, ...features] = tenantToFeatures.split(":")

    features.forEach(feature => {
      if (!tenantFeatureFlags[tenantId]) {
        tenantFeatureFlags[tenantId] = []
      }
      tenantFeatureFlags[tenantId].push(feature)
    })
  })

  return tenantFeatureFlags
}

const TENANT_FEATURE_FLAGS = getFeatureFlags()

exports.isEnabled = featureFlag => {
  const tenantId = tenancy.getTenantId()

  return (
    TENANT_FEATURE_FLAGS &&
    TENANT_FEATURE_FLAGS[tenantId] &&
    TENANT_FEATURE_FLAGS[tenantId].includes(featureFlag)
  )
}

exports.getTenantFeatureFlags = tenantId => {
  if (TENANT_FEATURE_FLAGS && TENANT_FEATURE_FLAGS[tenantId]) {
    return TENANT_FEATURE_FLAGS[tenantId]
  }

  return []
}

exports.FeatureFlag = {
  LICENSING: "LICENSING",
  GOOGLE_SHEETS: "GOOGLE_SHEETS",
}
