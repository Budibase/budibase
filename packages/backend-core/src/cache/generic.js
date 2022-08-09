const BaseCache = require("./base")

const GENERIC = new BaseCache()

exports.CacheKeys = {
  CHECKLIST: "checklist",
  INSTALLATION: "installation",
  ANALYTICS_ENABLED: "analyticsEnabled",
  UNIQUE_TENANT_ID: "uniqueTenantId",
  EVENTS: "events",
  BACKFILL_METADATA: "backfillMetadata",
  EVENTS_RATE_LIMIT: "eventsRateLimit",
}

exports.TTL = {
  ONE_MINUTE: 600,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
}

function performExport(funcName) {
  return (...args) => GENERIC[funcName](...args)
}

exports.keys = performExport("keys")
exports.get = performExport("get")
exports.store = performExport("store")
exports.delete = performExport("delete")
exports.withCache = performExport("withCache")
exports.bustCache = performExport("bustCache")
