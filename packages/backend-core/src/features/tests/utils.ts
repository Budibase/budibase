import { FeatureFlags } from "@budibase/types"
import { setEnv } from "../../environment"
import { parseEnvFlags } from "../features"

function getCurrentFlags(): Record<string, Record<string, boolean>> {
  const result: Record<string, Record<string, boolean>> = {}
  for (const { tenantId, key, value } of parseEnvFlags(
    process.env.TENANT_FEATURE_FLAGS || ""
  )) {
    const tenantFlags = result[tenantId] || {}
    // Don't allow overwriting specifically false flags, to match the beheaviour
    // of FlagSet.
    if (tenantFlags[key] === false) {
      continue
    }
    tenantFlags[key] = value
    result[tenantId] = tenantFlags
  }
  return result
}

function buildFlagString(
  flags: Record<string, Record<string, boolean>>
): string {
  const parts: string[] = []
  for (const [tenantId, tenantFlags] of Object.entries(flags)) {
    for (const [key, value] of Object.entries(tenantFlags)) {
      if (value === false) {
        parts.push(`${tenantId}:!${key}`)
      } else {
        parts.push(`${tenantId}:${key}`)
      }
    }
  }
  return parts.join(",")
}

export function setFeatureFlags(
  tenantId: string,
  flags: Partial<FeatureFlags>
): () => void {
  const current = getCurrentFlags()
  for (const [key, value] of Object.entries(flags)) {
    const tenantFlags = current[tenantId] || {}
    tenantFlags[key] = value
    current[tenantId] = tenantFlags
  }
  const flagString = buildFlagString(current)
  return setEnv({ TENANT_FEATURE_FLAGS: flagString })
}

export function withFeatureFlags<T>(
  tenantId: string,
  flags: Partial<FeatureFlags>,
  f: () => T
) {
  const cleanup = setFeatureFlags(tenantId, flags)
  const result = f()
  if (result instanceof Promise) {
    return result.finally(cleanup)
  } else {
    cleanup()
    return result
  }
}
