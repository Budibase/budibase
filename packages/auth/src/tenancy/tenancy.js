const { getDB } = require("../db")
const { SEPARATOR, StaticDatabases } = require("../db/constants")
const { getTenantId, DEFAULT_TENANT_ID, isMultiTenant } = require("./context")
const env = require("../environment")

const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants
const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name

exports.addTenantToUrl = url => {
  const tenantId = getTenantId()

  if (isMultiTenant()) {
    const char = url.indexOf("?") === -1 ? "?" : "&"
    url += `${char}tenantId=${tenantId}`
  }

  return url
}

exports.doesTenantExist = async tenantId => {
  const db = getDB(PLATFORM_INFO_DB)
  let tenants
  try {
    tenants = await db.get(TENANT_DOC)
  } catch (err) {
    // if theres an error the doc doesn't exist, no tenants exist
    return false
  }
  return (
    tenants &&
    Array.isArray(tenants.tenantIds) &&
    tenants.tenantIds.indexOf(tenantId) !== -1
  )
}

exports.tryAddTenant = async (tenantId, userId, email) => {
  const db = getDB(PLATFORM_INFO_DB)
  const getDoc = async id => {
    if (!id) {
      return null
    }
    try {
      return await db.get(id)
    } catch (err) {
      return { _id: id }
    }
  }
  let [tenants, userIdDoc, emailDoc] = await Promise.all([
    getDoc(TENANT_DOC),
    getDoc(userId),
    getDoc(email),
  ])
  if (!Array.isArray(tenants.tenantIds)) {
    tenants = {
      _id: TENANT_DOC,
      tenantIds: [],
    }
  }
  let promises = []
  if (userIdDoc) {
    userIdDoc.tenantId = tenantId
    promises.push(db.put(userIdDoc))
  }
  if (emailDoc) {
    emailDoc.tenantId = tenantId
    emailDoc.userId = userId
    promises.push(db.put(emailDoc))
  }
  if (tenants.tenantIds.indexOf(tenantId) === -1) {
    tenants.tenantIds.push(tenantId)
    promises.push(db.put(tenants))
  }
  await Promise.all(promises)
}

const DocumentTypes = {
  USER: "us",
}
const UNICODE_MAX = "\ufff0"

/**
 * Gets parameters for retrieving users.
 * Duplicate of "../db/utils" due to circular dependency
 */
const getGlobalUserParams = (globalId, otherProps = {}) => {
  if (!globalId) {
    globalId = ""
  }
  return {
    ...otherProps,
    startkey: `${DocumentTypes.USER}${SEPARATOR}${globalId}`,
    endkey: `${DocumentTypes.USER}${SEPARATOR}${globalId}${UNICODE_MAX}`,
  }
}

exports.deleteTenant = async tenantId => {
  const globalDb = exports.getGlobalDB()

  let promises = []
  // remove the tenant entry from global info
  const infoDb = getDB(PLATFORM_INFO_DB)
  let tenants = await infoDb.get(TENANT_DOC)
  tenants.tenantIds = tenants.tenantIds.filter(id => id !== tenantId)
  promises.push(infoDb.put(tenants))

  // remove the users
  const allUsers = await globalDb.allDocs(
    getGlobalUserParams(null, {
      include_docs: true,
    })
  )
  allUsers.rows.map(row => {
    promises.push(infoDb.remove(row.id, row.value.rev))
    promises.push(infoDb.remove(row.doc.email, row.value.rev))
  })

  // remove the global db
  promises.push(globalDb.destroy())

  await Promise.all(promises)
  // TODO: Delete all apps
}

exports.getGlobalDB = (tenantId = null) => {
  // tenant ID can be set externally, for example user API where
  // new tenants are being created, this may be the case
  if (!tenantId) {
    tenantId = getTenantId()
  }

  let dbName

  if (tenantId === DEFAULT_TENANT_ID) {
    dbName = StaticDatabases.GLOBAL.name
  } else {
    dbName = `${tenantId}${SEPARATOR}${StaticDatabases.GLOBAL.name}`
  }

  return getDB(dbName)
}

exports.lookupTenantId = async userId => {
  const db = getDB(StaticDatabases.PLATFORM_INFO.name)
  let tenantId = env.MULTI_TENANCY ? DEFAULT_TENANT_ID : null
  try {
    const doc = await db.get(userId)
    if (doc && doc.tenantId) {
      tenantId = doc.tenantId
    }
  } catch (err) {
    // just return the default
  }
  return tenantId
}
