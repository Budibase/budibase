import { FeatureFlag } from "@budibase/types"
import * as crypto from "crypto"
import tracer from "dd-trace"
import { cloneDeep } from "lodash"
import { AsyncLocalStorage } from "node:async_hooks"
import cluster from "node:cluster"
import { PostHog, PostHogOptions } from "posthog-node"
import * as configs from "../configs"
import * as context from "../context"
import env from "../environment"
import { HTTPError } from "../errors"
import { Duration } from "../utils"

interface ReloadAttempt {
  started: boolean
  successful: boolean
}

const reloadAttempts = new AsyncLocalStorage<ReloadAttempt>()
let posthog: PostHog | undefined
let pendingReload: Promise<void> | undefined

const getFeatureFlagsPollingInterval = () => {
  const configured = env.POSTHOG_FEATURE_FLAGS_POLLING_INTERVAL_MS
  if (configured) {
    const interval = parseInt(configured, 10)
    if (!Number.isNaN(interval) && interval > 0) {
      return interval
    }
  }
  return Duration.fromDays(1).toMs()
}

export function init(opts?: PostHogOptions) {
  if (
    env.POSTHOG_TOKEN &&
    env.POSTHOG_API_HOST &&
    !env.SELF_HOSTED &&
    env.POSTHOG_FEATURE_FLAGS_ENABLED
  ) {
    console.log("initializing posthog client...")
    const fetchImplementation = opts?.fetch || globalThis.fetch
    posthog = new PostHog(env.POSTHOG_TOKEN, {
      host: env.POSTHOG_API_HOST,
      personalApiKey: env.POSTHOG_PERSONAL_TOKEN,
      featureFlagsPollingInterval: getFeatureFlagsPollingInterval(),
      ...opts,
      fetch: async (url, options) => {
        if (new URL(url).pathname !== "/api/feature_flag/local_evaluation") {
          return fetchImplementation(url, options)
        }
        const attempt = reloadAttempts.getStore()
        // Poll timers inherit this context, so only claim the manual request.
        const trackedAttempt = attempt && !attempt.started ? attempt : undefined
        if (trackedAttempt) trackedAttempt.started = true
        const response = await fetchImplementation(url, options)
        return {
          status: response.status,
          text: () => response.text(),
          json: async () => {
            const body: unknown = await response.json()
            if (
              response.status !== 200 ||
              !body ||
              typeof body !== "object" ||
              !("flags" in body) ||
              !Array.isArray(body.flags) ||
              !body.flags.every(
                (flag: unknown) =>
                  !!flag &&
                  typeof flag === "object" &&
                  "key" in flag &&
                  typeof flag.key === "string"
              )
            ) {
              throw new Error("Invalid feature flag definitions")
            }
            if (trackedAttempt) trackedAttempt.successful = true
            return body
          },
        }
      },
    })
  } else {
    posthog = undefined
    console.log("posthog disabled")
  }
}

export async function reload(): Promise<void> {
  if (cluster.isWorker) {
    throw new HTTPError(
      "Feature flag reload is unavailable in clustered processes",
      409
    )
  }
  const client = posthog
  if (!client?.options.personalApiKey) {
    throw new HTTPError("Unable to reload feature flags", 503)
  }
  if (!pendingReload) {
    const attempt: ReloadAttempt = { started: false, successful: false }
    pendingReload = reloadAttempts.run(attempt, async () => {
      try {
        await client.reloadFeatureFlags()
        if (!attempt.successful) {
          throw new Error("Feature flag definitions were not refreshed")
        }
      } catch {
        throw new HTTPError("Unable to reload feature flags", 503)
      } finally {
        pendingReload = undefined
      }
    })
  }
  await pendingReload
}

export function shutdown() {
  posthog?.shutdown()
  posthog = undefined
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

export function getEnvFlags() {
  return parseEnvFlags(env.TENANT_FEATURE_FLAGS || "")
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

  async isEnabled<K extends keyof T>(
    key: K,
    options: { includeOverrides?: boolean } = {}
  ): Promise<T[K]> {
    const flags = await this.fetch(options)
    return flags[key]
  }

  async fetch({
    includeOverrides = true,
  }: { includeOverrides?: boolean } = {}): Promise<T> {
    return await tracer.trace("features.fetch", async span => {
      const cacheKey = includeOverrides
        ? this.setId
        : `${this.setId}:without-overrides`
      const cachedFlags = context.getFeatureFlags(cacheKey)
      if (cachedFlags) {
        span?.addTags({ fromCache: true })
        return cachedFlags as T
      }

      const tags: Record<string, any> = {}
      const flagValues = this.defaults()
      const currentTenantId = context.getTenantId()
      const specificallySetFalse = new Set<string>()

      // flags can't be worked out is self hoster accessing the cloud - no global DB
      if (context.isSelfHostUsingCloud()) {
        return flagValues
      }

      for (const { tenantId, key, value } of getEnvFlags()) {
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

        const config = await configs.getSettingsConfigDoc()
        const personProperties: Record<string, string> = { tenantId }

        const groupProperties: {
          tenant: {
            id: string
            createdVersion?: string
            createdAt?: string
          }
        } = {
          tenant: {
            id: tenantId,
          },
        }
        if (config.config.createdVersion) {
          groupProperties.tenant.createdVersion = config.config.createdVersion
        }
        if (config.createdAt) {
          groupProperties.tenant.createdAt = `${config.createdAt}`
        }
        const posthogFlags = await posthog.getAllFlags(userId, {
          personProperties,
          onlyEvaluateLocally: true,
          groups: {
            tenant: tenantId,
          },
          groupProperties,
        })

        for (const [name, value] of Object.entries(posthogFlags)) {
          if (!this.isFlagName(name)) {
            // We don't want an unexpected PostHog flag to break the app
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

      if (includeOverrides) {
        const overrides = context.getFeatureFlagOverrides()
        for (const [key, value] of Object.entries(overrides)) {
          if (!this.isFlagName(key)) {
            continue
          }

          if (typeof value !== "boolean") {
            continue
          }

          // @ts-expect-error - TS does not like you writing into a generic type.
          flagValues[key] = value
          tags[`flags.${key}.source`] = "override"
        }
      }

      context.setFeatureFlags(cacheKey, flagValues)
      for (const [key, value] of Object.entries(flagValues)) {
        tags[`flags.${key}.value`] = value
      }
      span?.addTags(tags)

      return flagValues
    })
  }
}

const featureFlagDefaults: Record<FeatureFlag, boolean> = {
  [FeatureFlag.CLOUD_CUSTOM_AI_CONFIG_CREATION]: false,
  [FeatureFlag.AI_TESTS]: false,
  [FeatureFlag.FRONT_COMPANION]: false,
  [FeatureFlag.PROJECTS]: false,
  [FeatureFlag.FEATURE_FLAG_OVERRIDES]: env.isDev(),
  [FeatureFlag.DEV_USE_CLIENT_FROM_STORAGE]: false,
  [FeatureFlag.AI_AGENT_ACTIVITY]: false,
}
export const flags = new FlagSet(featureFlagDefaults)

export async function isEnabled(flag: FeatureFlag) {
  return await flags.isEnabled(flag)
}

export async function isEnabledWithoutOverrides(flag: FeatureFlag) {
  return await flags.isEnabled(flag, { includeOverrides: false })
}

export async function all() {
  return await flags.fetch()
}
