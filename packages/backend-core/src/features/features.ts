import env from "../environment"
import * as crypto from "crypto"
import * as context from "../context"
import { PostHog, PostHogOptions } from "posthog-node"
import tracer from "dd-trace"
import { Duration } from "../utils"
import { cloneDeep } from "lodash"
import { FeatureFlagDefaults } from "@budibase/types"

let posthog: PostHog | undefined
export function init(opts?: PostHogOptions) {
  if (
    env.POSTHOG_TOKEN &&
    env.POSTHOG_API_HOST &&
    !env.SELF_HOSTED &&
    env.POSTHOG_FEATURE_FLAGS_ENABLED
  ) {
    console.log("initializing posthog client...")
    posthog = new PostHog(env.POSTHOG_TOKEN, {
      host: env.POSTHOG_API_HOST,
      personalApiKey: env.POSTHOG_PERSONAL_TOKEN,
      featureFlagsPollingInterval: Duration.fromMinutes(3).toMs(),
      ...opts,
    })
  } else {
    console.log("posthog disabled")
  }
}

export function shutdown() {
  posthog?.shutdown()
}

export interface EnvFlagEntry {
  tenantId: string
  key: string
  value: boolean
}

export function parseEnvFlags(flags: string): EnvFlagEntry[] {
  const split = flags.split(",").map(x => x.split(":"))
  const result: EnvFlagEntry[] = []
  for (const [tenantId, ...features] of split) {
    for (let feature of features) {
      let value = true
      if (feature.startsWith("!")) {
        feature = feature.slice(1)
        value = false
      }
      result.push({ tenantId, key: feature, value })
    }
  }
  return result
}

export class FlagSet<T extends { [name: string]: boolean }> {
  // This is used to safely cache flags sets in the current request context.
  // Because multiple sets could theoretically exist, we don't want the cache of
  // one to leak into another.
  private readonly setId: string

  constructor(private readonly flagSchema: T) {
    this.setId = crypto.randomUUID()
  }

  defaults(): T {
    return cloneDeep(this.flagSchema)
  }

  isFlagName(name: string | number | symbol): name is keyof T {
    return this.flagSchema[name as keyof T] !== undefined
  }

  async isEnabled<K extends keyof T>(key: K): Promise<T[K]> {
    const flags = await this.fetch()
    return flags[key]
  }

  async fetch(): Promise<T> {
    return await tracer.trace("features.fetch", async span => {
      const cachedFlags = context.getFeatureFlags(this.setId)
      if (cachedFlags) {
        span?.addTags({ fromCache: true })
        return cachedFlags as T
      }

      const tags: Record<string, any> = {}
      const flagValues = this.defaults()
      const currentTenantId = context.getTenantId()
      const specificallySetFalse = new Set<string>()

      for (const { tenantId, key, value } of parseEnvFlags(
        env.TENANT_FEATURE_FLAGS || ""
      )) {
        if (!tenantId || (tenantId !== "*" && tenantId !== currentTenantId)) {
          continue
        }

        tags[`readFromEnvironmentVars`] = true

        if (value === false) {
          specificallySetFalse.add(key)
        }

        // ignore unknown flags
        if (!this.isFlagName(key)) {
          continue
        }

        if (typeof flagValues[key] !== "boolean") {
          throw new Error(`Feature: ${key} is not a boolean`)
        }

        // @ts-expect-error - TS does not like you writing into a generic type,
        // but we know that it's okay in this case because it's just an object.
        flagValues[key as keyof T] = value
        tags[`flags.${key}.source`] = "environment"
      }

      const identity = context.getIdentity()

      let userId = identity?._id
      if (!userId) {
        const ip = context.getIP()
        if (ip) {
          userId = crypto.createHash("sha512").update(ip).digest("hex")
        }
      }

      let tenantId = identity?.tenantId
      if (!tenantId) {
        tenantId = currentTenantId
      }

      tags[`identity.type`] = identity?.type
      tags[`identity._id`] = identity?._id
      tags[`tenantId`] = tenantId
      tags[`userId`] = userId

      if (posthog && userId) {
        tags[`readFromPostHog`] = true

        const personProperties: Record<string, string> = { tenantId }
        const posthogFlags = await posthog.getAllFlags(userId, {
          personProperties,
        })

        for (const [name, value] of Object.entries(posthogFlags)) {
          if (!this.isFlagName(name)) {
            // We don't want an unexpected PostHog flag to break the app, so we
            // just log it and continue.
            console.warn(`Unexpected posthog flag "${name}": ${value}`)
            continue
          }

          if (typeof value !== "boolean") {
            console.warn(`Invalid value for posthog flag "${name}": ${value}`)
            continue
          }

          if (flagValues[name] === true || specificallySetFalse.has(name)) {
            // If the flag is already set to through environment variables, we
            // don't want to override it back to false here.
            continue
          }

          try {
            // @ts-expect-error - TS does not like you writing into a generic type.
            flagValues[name] = value
            tags[`flags.${name}.source`] = "posthog"
          } catch (err) {
            // We don't want an invalid PostHog flag to break the app, so we just
            // log it and continue.
            console.warn(`Error parsing posthog flag "${name}": ${value}`, err)
          }
        }
      }

      context.setFeatureFlags(this.setId, flagValues)
      for (const [key, value] of Object.entries(flagValues)) {
        tags[`flags.${key}.value`] = value
      }
      span?.addTags(tags)

      return flagValues
    })
  }
}

export const flags = new FlagSet(FeatureFlagDefaults)

export async function isEnabled(flag: keyof typeof FeatureFlagDefaults) {
  return await flags.isEnabled(flag)
}

export async function all() {
  return await flags.fetch()
}
