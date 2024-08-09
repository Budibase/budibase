import env from "../environment"
import * as context from "../context"
import { PostHog, PostHogOptions } from "posthog-node"
import { IdentityType, UserCtx } from "@budibase/types"
import tracer from "dd-trace"

let posthog: PostHog | undefined
export function init(opts?: PostHogOptions) {
  if (env.POSTHOG_TOKEN && env.POSTHOG_API_HOST) {
    posthog = new PostHog(env.POSTHOG_TOKEN, {
      host: env.POSTHOG_API_HOST,
      ...opts,
    })
  }
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
  private readonly flags: T

  constructor(flags: T) {
    this.flags = flags
  }

  defaults(): FlagValues<T> {
    return Object.keys(this.flags).reduce((acc, key) => {
      const typedKey = key as keyof T
      acc[typedKey] = this.flags[key].defaultValue
      return acc
    }, {} as FlagValues<T>)
  }

  isFlagName(name: string | number | symbol): name is keyof T {
    return this.flags[name as keyof T] !== undefined
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
      const tags: Record<string, any> = {}

      const flags = this.defaults()

      const currentTenantId = context.getTenantId()
      const specificallySetFalse = new Set<string>()

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
            specificallySetFalse.add(feature)
          }

          if (!this.isFlagName(feature)) {
            throw new Error(`Feature: ${feature} is not an allowed option`)
          }

          if (typeof flags[feature] !== "boolean") {
            throw new Error(`Feature: ${feature} is not a boolean`)
          }

          // @ts-ignore
          flags[feature] = value
          tags[`flags.${feature}.source`] = "environment"
        }
      }

      const license = ctx?.user?.license
      if (license) {
        for (const feature of license.features) {
          const flag = this.flags[feature]
          if (!flag) {
            continue
          }

          if (flags[feature] === true || specificallySetFalse.has(feature)) {
            // If the flag is already set to through environment variables, we
            // don't want to override it back to false here.
            continue
          }

          // @ts-ignore
          flags[feature] = true
          tags[`flags.${feature}.source`] = "license"
        }
      }

      const identity = context.getIdentity()
      if (posthog && identity?.type === IdentityType.USER) {
        const posthogFlags = await posthog.getAllFlagsAndPayloads(identity._id)
        for (const [name, value] of Object.entries(posthogFlags.featureFlags)) {
          const flag = this.flags[name]
          if (!flag) {
            // We don't want an unexpected PostHog flag to break the app, so we
            // just log it and continue.
            console.warn(`Unexpected posthog flag "${name}": ${value}`)
            continue
          }

          if (flags[name] === true || specificallySetFalse.has(name)) {
            // If the flag is already set to through environment variables, we
            // don't want to override it back to false here.
            continue
          }

          const payload = posthogFlags.featureFlagPayloads?.[name]

          try {
            // @ts-ignore
            flags[name] = flag.parse(payload || value)
            tags[`flags.${name}.source`] = "posthog"
          } catch (err) {
            // We don't want an invalid PostHog flag to break the app, so we just
            // log it and continue.
            console.warn(`Error parsing posthog flag "${name}": ${value}`, err)
          }
        }
      }

      for (const [key, value] of Object.entries(flags)) {
        tags[`flags.${key}.value`] = value
      }
      span?.addTags(tags)

      return flags
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
})
