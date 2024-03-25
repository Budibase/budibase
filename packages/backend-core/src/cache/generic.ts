import BaseCache from "./base"

const GENERIC = new BaseCache()

export enum CacheKey {
  CHECKLIST = "checklist",
  INSTALLATION = "installation",
  ANALYTICS_ENABLED = "analyticsEnabled",
  UNIQUE_TENANT_ID = "uniqueTenantId",
  EVENTS = "events",
  BACKFILL_METADATA = "backfillMetadata",
  EVENTS_RATE_LIMIT = "eventsRateLimit",
}

export enum TTL {
  ONE_MINUTE = 600,
  ONE_HOUR = 3600,
  ONE_DAY = 86400,
}

export const keys = (...args: Parameters<typeof GENERIC.keys>) =>
  GENERIC.keys(...args)
export const get = (...args: Parameters<typeof GENERIC.get>) =>
  GENERIC.get(...args)
export const store = (...args: Parameters<typeof GENERIC.store>) =>
  GENERIC.store(...args)
export const destroy = (...args: Parameters<typeof GENERIC.delete>) =>
  GENERIC.delete(...args)
export const withCache = <T>(
  ...args: Parameters<typeof GENERIC.withCache<T>>
) => GENERIC.withCache(...args)
export const bustCache = (...args: Parameters<typeof GENERIC.bustCache>) =>
  GENERIC.bustCache(...args)
