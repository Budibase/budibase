import env from "../environment"
import * as context from "../context"
import { cloneDeep } from "lodash"
import { PostHog, PostHogOptions } from "posthog-node"
import { IdentityType } from "@budibase/types"

let posthog: PostHog | undefined
export function init(opts?: PostHogOptions) {
  if (env.POSTHOG_TOKEN) {
    posthog = new PostHog(env.POSTHOG_TOKEN, {
      host: "https://us.i.posthog.com",
      ...opts,
    })
  }
}

abstract class Flag<T> {
  static boolean(defaultValue: boolean): Flag<boolean> {
    return new BooleanFlag(defaultValue)
  }

  static string(defaultValue: string): Flag<string> {
    return new StringFlag(defaultValue)
  }

  static number(defaultValue: number): Flag<number> {
    return new NumberFlag(defaultValue)
  }

  protected constructor(public defaultValue: T) {}

  abstract parse(value: any): T
}

class BooleanFlag extends Flag<boolean> {
  parse(value: any) {
    if (typeof value === "string") {
      return ["true", "t", "1"].includes(value.toLowerCase())
    }

    if (typeof value === "boolean") {
      return value
    }

    throw new Error(`could not parse value "${value}" as boolean`)
  }
}

class StringFlag extends Flag<string> {
  parse(value: any) {
    if (typeof value === "string") {
      return value
    }
    throw new Error(`could not parse value "${value}" as string`)
  }
}

class NumberFlag extends Flag<number> {
  parse(value: any) {
    if (typeof value === "number") {
      return value
    }

    if (typeof value === "string") {
      const parsed = parseFloat(value)
      if (!isNaN(parsed)) {
        return parsed
      }
    }

    throw new Error(`could not parse value "${value}" as number`)
  }
}

// This is the primary source of truth for feature flags. If you want to add a
// new flag, add it here and use the `fetch` and `get` functions to access it.
// All of the machinery in this file is to make sure that flags have their
// default values set correctly and their types flow through the system.
const FLAGS = {
  LICENSING: Flag.boolean(false),
  GOOGLE_SHEETS: Flag.boolean(false),
  USER_GROUPS: Flag.boolean(false),
  ONBOARDING_TOUR: Flag.boolean(false),

  _TEST_BOOLEAN: Flag.boolean(false),
  _TEST_STRING: Flag.string("default value"),
  _TEST_NUMBER: Flag.number(0),
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
  const flags = defaultFlags()

  const currentTenantId = context.getTenantId()

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

  const identity = context.getIdentity()
  if (posthog && identity?.type === IdentityType.USER) {
    const posthogFlags = await posthog.getAllFlagsAndPayloads(identity._id)
    for (const [name, value] of Object.entries(posthogFlags.featureFlags)) {
      const key = name as keyof typeof FLAGS
      const flag = FLAGS[key]
      if (!flag) {
        // We don't want an unexpected PostHog flag to break the app, so we
        // just log it and continue.
        console.warn(`Unexpected posthog flag "${name}": ${value}`)
        continue
      }

      const payload = posthogFlags.featureFlagPayloads?.[name]

      try {
        // @ts-ignore
        flags[key] = flag.parse(payload || value)
      } catch (err) {
        // We don't want an invalid PostHog flag to break the app, so we just
        // log it and continue.
        console.warn(`Error parsing posthog flag "${name}": ${value}`, err)
      }
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
