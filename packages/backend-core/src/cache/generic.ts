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

export const keys = GENERIC.keys
export const get = GENERIC.get
export const store = GENERIC.store
export const destroy = GENERIC.delete
export const withCache = GENERIC.withCache
export const bustCache = GENERIC.bustCache
