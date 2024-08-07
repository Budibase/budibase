import env from "../environment"
import * as context from "../context"
import { cloneDeep } from "lodash"

class Flag<T> {
  static withDefault<T>(value: T) {
    return new Flag(value)
  }

  private constructor(public defaultValue: T) {}
}

// This is the primary source of truth for feature flags. If you want to add a
// new flag, add it here and use the `fetch` and `get` functions to access it.
// All of the machinery in this file is to make sure that flags have their
// default values set correctly and their types flow through the system.
const FLAGS = {
  LICENSING: Flag.withDefault(false),
  GOOGLE_SHEETS: Flag.withDefault(false),
  USER_GROUPS: Flag.withDefault(false),
  ONBOARDING_TOUR: Flag.withDefault(false),
}

const DEFAULTS = Object.keys(FLAGS).reduce((acc, key) => {
  const typedKey = key as keyof typeof FLAGS
  // @ts-ignore
  acc[typedKey] = FLAGS[typedKey].defaultValue
  return acc
}, {} as Flags)

type UnwrapFlag<F> = F extends Flag<infer U> ? U : never
export type Flags = {
  [K in keyof typeof FLAGS]: UnwrapFlag<(typeof FLAGS)[K]>
}

// Exported for use in tests, should not be used outside of this file.
export function defaultFlags(): Flags {
  return cloneDeep(DEFAULTS)
}

function isFlagName(name: string): name is keyof Flags {
  return FLAGS[name as keyof typeof FLAGS] !== undefined
}

/**
 * Reads the TENANT_FEATURE_FLAGS environment variable and returns a Flags object
 * populated with the flags for the current tenant, filling in the default values
 * if the flag is not set.
 *
 * Check the tests for examples of how TENANT_FEATURE_FLAGS should be formatted.
 *
 * In future we plan to add more ways of setting feature flags, e.g. PostHog, and
 * they will be accessed through this function as well.
 */
export async function fetch(): Promise<Flags> {
  const currentTenantId = context.getTenantId()
  const flags = defaultFlags()

  const split = (env.TENANT_FEATURE_FLAGS || "")
    .split(",")
    .map(x => x.split(":"))
  for (const [tenantId, ...features] of split) {
    if (!tenantId || (tenantId !== "*" && tenantId !== currentTenantId)) {
      continue
    }

    for (let feature of features) {
      let value = true
      if (feature.startsWith("!")) {
        feature = feature.slice(1)
        value = false
      }

      if (!isFlagName(feature)) {
        throw new Error(`Feature: ${feature} is not an allowed option`)
      }

      if (typeof flags[feature] !== "boolean") {
        throw new Error(`Feature: ${feature} is not a boolean`)
      }

      // @ts-ignore
      flags[feature] = value
    }
  }

  return flags
}

// Gets a single feature flag value. This is a convenience function for
// `fetch().then(flags => flags[name])`.
export async function get<K extends keyof Flags>(name: K): Promise<Flags[K]> {
  const flags = await fetch()
  return flags[name]
}

type BooleanFlags = {
  [K in keyof typeof FLAGS]: (typeof FLAGS)[K] extends Flag<boolean> ? K : never
}[keyof typeof FLAGS]

// Convenience function for boolean flag values. This makes callsites more
// readable for boolean flags.
export async function isEnabled<K extends BooleanFlags>(
  name: K
): Promise<boolean> {
  const flags = await fetch()
  return flags[name]
}
