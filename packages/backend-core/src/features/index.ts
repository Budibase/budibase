import env from "../environment"
import * as context from "../context"
import { PostHog, PostHogOptions } from "posthog-node"
import { IdentityType, UserCtx } from "@budibase/types"
import tracer from "dd-trace"

let posthog: PostHog | undefined
export function init(opts?: PostHogOptions) {
  if (env.POSTHOG_TOKEN && env.POSTHOG_API_HOST) {
    console.log("initializing posthog client...")
    posthog = new PostHog(env.POSTHOG_TOKEN, {
      host: env.POSTHOG_API_HOST,
      personalApiKey: env.POSTHOG_PERSONAL_TOKEN,
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

  async get<K extends keyof T>(
    key: K,
    ctx?: UserCtx
  ): Promise<FlagValues<T>[K]> {
    const flags = await this.fetch(ctx)
    return flags[key]
  }

  async isEnabled<K extends KeysOfType<T, boolean>>(
    key: K,
    ctx?: UserCtx
  ): Promise<boolean> {
    const flags = await this.fetch(ctx)
    return flags[key]
  }

  async fetch(ctx?: UserCtx): Promise<FlagValues<T>> {
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

      const split = (env.TENANT_FEATURE_FLAGS || "")
        .split(",")
        .map(x => x.split(":"))
      for (const [tenantId, ...features] of split) {
        if (!tenantId || (tenantId !== "*" && tenantId !== currentTenantId)) {
          continue
        }

        tags[`readFromEnvironmentVars`] = true

        for (let feature of features) {
          let value = true
          if (feature.startsWith("!")) {
            feature = feature.slice(1)
            value = false
            specificallySetFalse.add(feature)
          }

          if (!this.isFlagName(feature)) {
            throw new Error(`Feature: ${feature} is not an allowed option`)
          }

          if (typeof flagValues[feature] !== "boolean") {
            throw new Error(`Feature: ${feature} is not a boolean`)
          }

          // @ts-expect-error - TS does not like you writing into a generic type,
          // but we know that it's okay in this case because it's just an object.
          flagValues[feature] = value
          tags[`flags.${feature}.source`] = "environment"
        }
      }

      const license = ctx?.user?.license
      if (license) {
        tags[`readFromLicense`] = true

        for (const feature of license.features) {
          if (!this.isFlagName(feature)) {
            continue
          }

          if (
            flagValues[feature] === true ||
            specificallySetFalse.has(feature)
          ) {
            // If the flag is already set to through environment variables, we
            // don't want to override it back to false here.
            continue
          }

          // @ts-expect-error - TS does not like you writing into a generic type,
          // but we know that it's okay in this case because it's just an object.
          flagValues[feature] = true
          tags[`flags.${feature}.source`] = "license"
        }
      }

      const identity = context.getIdentity()
      tags[`identity.type`] = identity?.type
      tags[`identity.tenantId`] = identity?.tenantId
      tags[`identity._id`] = identity?._id

      if (posthog && identity?.type === IdentityType.USER) {
        tags[`readFromPostHog`] = true

        const personProperties: Record<string, string> = {}
        if (identity.tenantId) {
          personProperties.tenantId = identity.tenantId
        }

        const posthogFlags = await posthog.getAllFlagsAndPayloads(
          identity._id,
          {
            personProperties,
          }
        )

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
  LICENSING: Flag.boolean(false),
  GOOGLE_SHEETS: Flag.boolean(false),
  USER_GROUPS: Flag.boolean(false),
  ONBOARDING_TOUR: Flag.boolean(false),
  DEFAULT_VALUES: Flag.boolean(false),
})
