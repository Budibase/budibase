import BaseCache from "./base"

const GENERIC = new BaseCache()

export const CacheKeys = {
  CHECKLIST: "checklist",
  INSTALLATION: "installation",
  ANALYTICS_ENABLED: "analyticsEnabled",
  UNIQUE_TENANT_ID: "uniqueTenantId",
  EVENTS: "events",
  BACKFILL_METADATA: "backfillMetadata",
  EVENTS_RATE_LIMIT: "eventsRateLimit",
}

export const TTL = {
  ONE_MINUTE: 600,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
}

export const keys = (pattern: string) => {
  return GENERIC.keys(pattern)
}

export const get = (key: string, opts = { useTenancy: true }) => {
  return GENERIC.get(key, opts)
}

export const store = (
  key: string,
  value: any,
  ttl: number | null = null,
  opts = { useTenancy: true }
) => {
  return GENERIC.store(key, value, ttl, opts)
}

export const deleteKey = (key: string, opts = { useTenancy: true }) => {
  return GENERIC.delete(key, opts)
}

export const withCache = (
  key: string,
  ttl: number,
  fetchFn: any,
  opts = { useTenancy: true }
) => {
  return GENERIC.withCache(key, ttl, fetchFn, opts)
}

export const bustCache = (key: string, opts = { client: null }) => {
  return GENERIC.bustCache(key, opts)
}
