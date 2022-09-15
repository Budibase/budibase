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
  const flags = exports.getTenantFeatureFlags(tenantId)
  return flags.includes(featureFlag)
}

exports.getTenantFeatureFlags = tenantId => {
  const flags = []

  if (TENANT_FEATURE_FLAGS) {
    const globalFlags = TENANT_FEATURE_FLAGS["*"]
    const tenantFlags = TENANT_FEATURE_FLAGS[tenantId]

    if (globalFlags) {
      flags.push(...globalFlags)
    }
    if (tenantFlags) {
      flags.push(...tenantFlags)
    }
  }

  return flags
}

exports.FeatureFlag = {
  LICENSING: "LICENSING",
  GOOGLE_SHEETS: "GOOGLE_SHEETS",
  USER_GROUPS: "USER_GROUPS",
}
