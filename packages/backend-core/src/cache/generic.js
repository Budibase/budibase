const BaseCache = require("./base")

const GENERIC = new BaseCache()

exports.CacheKeys = {
  CHECKLIST: "checklist",
  INSTALLATION: "installation",
  ANALYTICS_ENABLED: "analyticsEnabled",
  UNIQUE_TENANT_ID: "uniqueTenantId",
  EVENTS: "events",
  BACKFILL_METADATA: "backfillMetadata",
}

exports.TTL = {
  ONE_MINUTE: 600,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
}

exports.keys = GENERIC.keys
exports.get = GENERIC.get
exports.store = GENERIC.store
exports.delete = GENERIC.delete
exports.withCache = GENERIC.withCache
exports.bustCache = GENERIC.bustCache
