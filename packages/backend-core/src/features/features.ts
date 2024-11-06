import env from "../environment"
import * as crypto from "crypto"
import * as context from "../context"
import { PostHog, PostHogOptions } from "posthog-node"
import { FeatureFlag } from "@budibase/types"
import tracer from "dd-trace"
import { Duration } from "../utils"

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

export abstract class Flag<T> {
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

type UnwrapFlag<F> = F extends Flag<infer U> ? U : never

export type FlagValues<T> = {
  [K in keyof T]: UnwrapFlag<T[K]>
}

type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends Flag<U> ? K : never
}[keyof T]

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

export class FlagSet<V extends Flag<any>, T extends { [key: string]: V }> {
  // This is used to safely cache flags sets in the current request context.
  // Because multiple sets could theoretically exist, we don't want the cache of
  // one to leak into another.
  private readonly setId: string

  constructor(private readonly flagSchema: T) {
    this.setId = crypto.randomUUID()
  }

  defaults(): FlagValues<T> {
    return Object.keys(this.flagSchema).reduce((acc, key) => {
      const typedKey = key as keyof T
      acc[typedKey] = this.flagSchema[key].defaultValue
      return acc
    }, {} as FlagValues<T>)
  }

  isFlagName(name: string | number | symbol): name is keyof T {
    return this.flagSchema[name as keyof T] !== undefined
  }

  async get<K extends keyof T>(key: K): Promise<FlagValues<T>[K]> {
    const flags = await this.fetch()
    return flags[key]
  }

  async isEnabled<K extends KeysOfType<T, boolean>>(key: K): Promise<boolean> {
    const flags = await this.fetch()
    return flags[key]
  }

  async fetch(): Promise<FlagValues<T>> {
    return await tracer.trace("features.fetch", async span => {
      const cachedFlags = context.getFeatureFlags<FlagValues<T>>(this.setId)
      if (cachedFlags) {
        span?.addTags({ fromCache: true })
        return cachedFlags
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
        flagValues[key as keyof FlagValues] = value
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
        const posthogFlags = await posthog.getAllFlagsAndPayloads(userId, {
          personProperties,
        })

        for (const [name, value] of Object.entries(posthogFlags.featureFlags)) {
          if (!this.isFlagName(name)) {
            // We don't want an unexpected PostHog flag to break the app, so we
            // just log it and continue.
            console.warn(`Unexpected posthog flag "${name}": ${value}`)
            continue
          }

          if (flagValues[name] === true || specificallySetFalse.has(name)) {
            // If the flag is already set to through environment variables, we
            // don't want to override it back to false here.
            continue
          }

          const payload = posthogFlags.featureFlagPayloads?.[name]
          const flag = this.flagSchema[name]
          try {
            // @ts-expect-error - TS does not like you writing into a generic
            // type, but we know that it's okay in this case because it's just
            // an object.
            flagValues[name] = flag.parse(payload || value)
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

// This is the primary source of truth for feature flags. If you want to add a
// new flag, add it here and use the `fetch` and `get` functions to access it.
// All of the machinery in this file is to make sure that flags have their
// default values set correctly and their types flow through the system.
export const flags = new FlagSet({
  [FeatureFlag.DEFAULT_VALUES]: Flag.boolean(env.isDev()),
  [FeatureFlag.AUTOMATION_BRANCHING]: Flag.boolean(env.isDev()),
  [FeatureFlag.SQS]: Flag.boolean(true),
  [FeatureFlag.AI_CUSTOM_CONFIGS]: Flag.boolean(env.isDev()),
  [FeatureFlag.ENRICHED_RELATIONSHIPS]: Flag.boolean(env.isDev()),
  [FeatureFlag.BUDIBASE_AI]: Flag.boolean(env.isDev()),
})

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
export type FeatureFlags = UnwrapPromise<ReturnType<typeof flags.fetch>>
