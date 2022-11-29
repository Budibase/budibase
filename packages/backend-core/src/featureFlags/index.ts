import env from "../environment"
import * as tenancy from "../tenancy"

/**
 * Read the TENANT_FEATURE_FLAGS env var and return an array of features flags for each tenant.
 * The env var is formatted as:
 *  tenant1:feature1:feature2,tenant2:feature1
 */
function getFeatureFlags() {
  if (!env.TENANT_FEATURE_FLAGS) {
    return
  }

  const tenantFeatureFlags: Record<string, string[]> = {}

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

export function isEnabled(featureFlag: string) {
  const tenantId = tenancy.getTenantId()
  const flags = getTenantFeatureFlags(tenantId)
  return flags.includes(featureFlag)
}

export function getTenantFeatureFlags(tenantId: string) {
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

export enum TenantFeatureFlag {
  LICENSING = "LICENSING",
  GOOGLE_SHEETS = "GOOGLE_SHEETS",
  USER_GROUPS = "USER_GROUPS",
}
