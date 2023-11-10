import env from "../environment"
import * as context from "../context"
export * from "./installation"

/**
 * Read the TENANT_FEATURE_FLAGS env var and return an array of features flags for each tenant.
 * The env var is formatted as:
 *  tenant1:feature1:feature2,tenant2:feature1
 */
export function buildFeatureFlags() {
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

export function isEnabled(featureFlag: string) {
  const tenantId = context.getTenantId()
  const flags = getTenantFeatureFlags(tenantId)
  return flags.includes(featureFlag)
}

export function getTenantFeatureFlags(tenantId: string) {
  let flags: string[] = []
  const envFlags = buildFeatureFlags()
  if (envFlags) {
    const globalFlags = envFlags["*"]
    const tenantFlags = envFlags[tenantId] || []

    // Explicitly exclude tenants from global features if required.
    // Prefix the tenant flag with '!'
    const tenantOverrides = tenantFlags.reduce(
      (acc: string[], flag: string) => {
        if (flag.startsWith("!")) {
          let stripped = flag.substring(1)
          acc.push(stripped)
        }
        return acc
      },
      []
    )

    if (globalFlags) {
      flags.push(...globalFlags)
    }
    if (tenantFlags.length) {
      flags.push(...tenantFlags)
    }

    // Purge any tenant specific overrides
    flags = flags.filter(flag => {
      return tenantOverrides.indexOf(flag) == -1 && !flag.startsWith("!")
    })
  }

  return flags
}

export enum TenantFeatureFlag {
  LICENSING = "LICENSING",
  GOOGLE_SHEETS = "GOOGLE_SHEETS",
  USER_GROUPS = "USER_GROUPS",
  ONBOARDING_TOUR = "ONBOARDING_TOUR",
}
