const env = require("../environment")
const { Headers } = require("../../constants")
const { SEPARATOR, DocumentTypes } = require("../db/constants")
const cls = require("./FunctionContext")
const { getCouch } = require("../db")
const { getProdAppID, getDevelopmentAppID } = require("../db/conversions")
const { isEqual } = require("lodash")

// some test cases call functions directly, need to
// store an app ID to pretend there is a context
let TEST_APP_ID = null

const ContextKeys = {
  TENANT_ID: "tenantId",
  APP_ID: "appId",
  // whatever the request app DB was
  CURRENT_DB: "currentDb",
  // get the prod app DB from the request
  PROD_DB: "prodDb",
  // get the dev app DB from the request
  DEV_DB: "devDb",
  DB_OPTS: "dbOpts",
}

exports.DEFAULT_TENANT_ID = "default"

exports.isDefaultTenant = () => {
  return exports.getTenantId() === exports.DEFAULT_TENANT_ID
}

exports.isMultiTenant = () => {
  return env.MULTI_TENANCY
}

// used for automations, API endpoints should always be in context already
exports.doInTenant = (tenantId, task) => {
  return cls.run(() => {
    // set the tenant id
    cls.setOnContext(ContextKeys.TENANT_ID, tenantId)

    // invoke the task
    return task()
  })
}

/**
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
exports.getTenantIDFromAppID = appId => {
  if (!appId) {
    return null
  }
  const split = appId.split(SEPARATOR)
  const hasDev = split[1] === DocumentTypes.DEV
  if ((hasDev && split.length === 3) || (!hasDev && split.length === 2)) {
    return null
  }
  if (hasDev) {
    return split[2]
  } else {
    return split[1]
  }
}

const setAppTenantId = appId => {
  const appTenantId = this.getTenantIDFromAppID(appId) || this.DEFAULT_TENANT_ID
  this.updateTenantId(appTenantId)
}

exports.doInAppContext = (appId, task) => {
  if (!appId) {
    throw new Error("appId is required")
  }
  return cls.run(() => {
    // set the app tenant id
    setAppTenantId(appId)

    // set the app ID
    cls.setOnContext(ContextKeys.APP_ID, appId)

    // invoke the task
    return task()
  })
}

exports.updateTenantId = tenantId => {
  cls.setOnContext(ContextKeys.TENANT_ID, tenantId)
}

exports.updateAppId = appId => {
  try {
    cls.setOnContext(ContextKeys.APP_ID, appId)
    cls.setOnContext(ContextKeys.PROD_DB, null)
    cls.setOnContext(ContextKeys.DEV_DB, null)
    cls.setOnContext(ContextKeys.CURRENT_DB, null)
    cls.setOnContext(ContextKeys.DB_OPTS, null)
  } catch (err) {
    if (env.isTest()) {
      TEST_APP_ID = appId
    } else {
      throw err
    }
  }
}

exports.setTenantId = (
  ctx,
  opts = { allowQs: false, allowNoTenant: false }
) => {
  let tenantId
  // exit early if not multi-tenant
  if (!exports.isMultiTenant()) {
    cls.setOnContext(ContextKeys.TENANT_ID, this.DEFAULT_TENANT_ID)
    return
  }

  const allowQs = opts && opts.allowQs
  const allowNoTenant = opts && opts.allowNoTenant
  const header = ctx.request.headers[Headers.TENANT_ID]
  const user = ctx.user || {}
  if (allowQs) {
    const query = ctx.request.query || {}
    tenantId = query.tenantId
  }
  // override query string (if allowed) by user, or header
  // URL params cannot be used in a middleware, as they are
  // processed later in the chain
  tenantId = user.tenantId || header || tenantId

  // Set the tenantId from the subdomain
  if (!tenantId) {
    tenantId = ctx.subdomains && ctx.subdomains[0]
  }

  if (!tenantId && !allowNoTenant) {
    ctx.throw(403, "Tenant id not set")
  }
  // check tenant ID just incase no tenant was allowed
  if (tenantId) {
    cls.setOnContext(ContextKeys.TENANT_ID, tenantId)
  }
}

exports.isTenantIdSet = () => {
  const tenantId = cls.getFromContext(ContextKeys.TENANT_ID)
  return !!tenantId
}

exports.getTenantId = () => {
  if (!exports.isMultiTenant()) {
    return exports.DEFAULT_TENANT_ID
  }
  const tenantId = cls.getFromContext(ContextKeys.TENANT_ID)
  if (!tenantId) {
    throw new Error("Tenant id not found")
  }
  return tenantId
}

exports.getAppId = () => {
  const foundId = cls.getFromContext(ContextKeys.APP_ID)
  if (!foundId && env.isTest() && TEST_APP_ID) {
    return TEST_APP_ID
  } else {
    return foundId
  }
}

function getDB(key, opts) {
  const dbOptsKey = `${key}${ContextKeys.DB_OPTS}`
  let storedOpts = cls.getFromContext(dbOptsKey)
  let db = cls.getFromContext(key)
  if (db && isEqual(opts, storedOpts)) {
    return db
  }
  const appId = exports.getAppId()
  const CouchDB = getCouch()
  let toUseAppId
  switch (key) {
    case ContextKeys.CURRENT_DB:
      toUseAppId = appId
      break
    case ContextKeys.PROD_DB:
      toUseAppId = getProdAppID(appId)
      break
    case ContextKeys.DEV_DB:
      toUseAppId = getDevelopmentAppID(appId)
      break
  }
  db = new CouchDB(toUseAppId, opts)
  try {
    cls.setOnContext(key, db)
    if (opts) {
      cls.setOnContext(dbOptsKey, opts)
    }
  } catch (err) {
    if (!env.isTest()) {
      throw err
    }
  }
  return db
}

/**
 * Opens the app database based on whatever the request
 * contained, dev or prod.
 */
exports.getAppDB = opts => {
  return getDB(ContextKeys.CURRENT_DB, opts)
}

/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will open the prod one.
 */
exports.getProdAppDB = opts => {
  return getDB(ContextKeys.PROD_DB, opts)
}

/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will open the dev one.
 */
exports.getDevAppDB = opts => {
  return getDB(ContextKeys.DEV_DB, opts)
}
