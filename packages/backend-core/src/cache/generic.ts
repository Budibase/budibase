const BaseCache = require("./base")

const GENERIC = new BaseCache.default()

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

function performExport(funcName: string) {
  return (...args: any) => GENERIC[funcName](...args)
}

export const keys = performExport("keys")
export const get = performExport("get")
export const store = performExport("store")
export const destroy = performExport("delete")
export const withCache = performExport("withCache")
export const bustCache = performExport("bustCache")
