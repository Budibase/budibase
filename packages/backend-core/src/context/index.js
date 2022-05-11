const env = require("../environment")
const { Headers } = require("../../constants")
const { SEPARATOR, DocumentTypes } = require("../db/constants")
const { DEFAULT_TENANT_ID } = require("../constants")
const cls = require("./FunctionContext")
const { dangerousGetDB, closeDB } = require("../db")
const { getProdAppID, getDevelopmentAppID } = require("../db/conversions")
const { baseGlobalDBName } = require("../tenancy/utils")
const { isEqual } = require("lodash")

// some test cases call functions directly, need to
// store an app ID to pretend there is a context
let TEST_APP_ID = null

const ContextKeys = {
  TENANT_ID: "tenantId",
  GLOBAL_DB: "globalDb",
  APP_ID: "appId",
  // whatever the request app DB was
  CURRENT_DB: "currentDb",
  // get the prod app DB from the request
  PROD_DB: "prodDb",
  // get the dev app DB from the request
  DEV_DB: "devDb",
  DB_OPTS: "dbOpts",
  // check if something else is using the context, don't close DB
  IN_USE: "inUse",
}

exports.DEFAULT_TENANT_ID = DEFAULT_TENANT_ID

// this function makes sure the PouchDB objects are closed and
// fully deleted when finished - this protects against memory leaks
async function closeAppDBs() {
  const dbKeys = [
    ContextKeys.CURRENT_DB,
    ContextKeys.PROD_DB,
    ContextKeys.DEV_DB,
  ]
  for (let dbKey of dbKeys) {
    const db = cls.getFromContext(dbKey)
    if (!db) {
      continue
    }
    await closeDB(db)
    // clear the DB from context, incase someone tries to use it again
    cls.setOnContext(dbKey, null)
  }
  // clear the app ID now that the databases are closed
  if (cls.getFromContext(ContextKeys.APP_ID)) {
    cls.setOnContext(ContextKeys.APP_ID, null)
  }
  if (cls.getFromContext(ContextKeys.DB_OPTS)) {
    cls.setOnContext(ContextKeys.DB_OPTS, null)
  }
}

exports.closeTenancy = async () => {
  if (env.USE_COUCH) {
    await closeDB(exports.getGlobalDB())
  }
  // clear from context now that database is closed/task is finished
  cls.setOnContext(ContextKeys.TENANT_ID, null)
  cls.setOnContext(ContextKeys.GLOBAL_DB, null)
}

exports.isDefaultTenant = () => {
  return exports.getTenantId() === exports.DEFAULT_TENANT_ID
}

exports.isMultiTenant = () => {
  return env.MULTI_TENANCY
}

// used for automations, API endpoints should always be in context already
exports.doInTenant = (tenantId, task) => {
  // the internal function is so that we can re-use an existing
  // context - don't want to close DB on a parent context
  async function internal(opts = { existing: false }) {
    // set the tenant id
    if (!opts.existing) {
      cls.setOnContext(ContextKeys.TENANT_ID, tenantId)
      if (env.USE_COUCH) {
        exports.setGlobalDB(tenantId)
      }
    }

    try {
      // invoke the task
      return await task()
    } finally {
      const using = cls.getFromContext(ContextKeys.IN_USE)
      if (!using || using <= 1) {
        await exports.closeTenancy()
      } else {
        cls.setOnContext(using - 1)
      }
    }
  }
  const using = cls.getFromContext(ContextKeys.IN_USE)
  if (using && cls.getFromContext(ContextKeys.TENANT_ID) === tenantId) {
    cls.setOnContext(ContextKeys.IN_USE, using + 1)
    return internal({ existing: true })
  } else {
    return cls.run(async () => {
      cls.setOnContext(ContextKeys.IN_USE, 1)
      return internal()
    })
  }
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
  const appTenantId =
    exports.getTenantIDFromAppID(appId) || exports.DEFAULT_TENANT_ID
  exports.updateTenantId(appTenantId)
}

exports.doInAppContext = (appId, task) => {
  if (!appId) {
    throw new Error("appId is required")
  }

  // the internal function is so that we can re-use an existing
  // context - don't want to close DB on a parent context
  async function internal(opts = { existing: false }) {
    // set the app tenant id
    if (!opts.existing) {
      setAppTenantId(appId)
    }
    // set the app ID
    cls.setOnContext(ContextKeys.APP_ID, appId)
    try {
      // invoke the task
      return await task()
    } finally {
      const using = cls.getFromContext(ContextKeys.IN_USE)
      if (!using || using <= 1) {
        await closeAppDBs()
      } else {
        cls.setOnContext(using - 1)
      }
    }
  }
  const using = cls.getFromContext(ContextKeys.IN_USE)
  if (using && cls.getFromContext(ContextKeys.APP_ID) === appId) {
    cls.setOnContext(ContextKeys.IN_USE, using + 1)
    return internal({ existing: true })
  } else {
    return cls.run(async () => {
      cls.setOnContext(ContextKeys.IN_USE, 1)
      return internal()
    })
  }
}

exports.updateTenantId = tenantId => {
  cls.setOnContext(ContextKeys.TENANT_ID, tenantId)
  exports.setGlobalDB(tenantId)
}

exports.updateAppId = async appId => {
  try {
    // have to close first, before removing the databases from context
    await closeAppDBs()
    cls.setOnContext(ContextKeys.APP_ID, appId)
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
    cls.setOnContext(ContextKeys.TENANT_ID, exports.DEFAULT_TENANT_ID)
    return exports.DEFAULT_TENANT_ID
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
  return tenantId
}

exports.setGlobalDB = tenantId => {
  const dbName = baseGlobalDBName(tenantId)
  const db = dangerousGetDB(dbName)
  cls.setOnContext(ContextKeys.GLOBAL_DB, db)
  return db
}

exports.getGlobalDB = () => {
  const db = cls.getFromContext(ContextKeys.GLOBAL_DB)
  if (!db) {
    throw new Error("Global DB not found")
  }
  return db
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

function getContextDB(key, opts) {
  const dbOptsKey = `${key}${ContextKeys.DB_OPTS}`
  let storedOpts = cls.getFromContext(dbOptsKey)
  let db = cls.getFromContext(key)
  if (db && isEqual(opts, storedOpts)) {
    return db
  }

  const appId = exports.getAppId()
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
  db = dangerousGetDB(toUseAppId, opts)
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
  return getContextDB(ContextKeys.CURRENT_DB, opts)
}

/**
 * This specifically gets the prod app ID, if the request
 * contained a development app ID, this will open the prod one.
 */
exports.getProdAppDB = opts => {
  return getContextDB(ContextKeys.PROD_DB, opts)
}

/**
 * This specifically gets the dev app ID, if the request
 * contained a prod app ID, this will open the dev one.
 */
exports.getDevAppDB = opts => {
  return getContextDB(ContextKeys.DEV_DB, opts)
}
