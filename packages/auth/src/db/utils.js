const { newid } = require("../hashing")
const Replication = require("./Replication")
const { DEFAULT_TENANT_ID } = require("../constants")
const env = require("../environment")
const { StaticDatabases, SEPARATOR } = require("./constants")
const { getTenantId } = require("../tenancy")
const fetch = require("node-fetch")
const { getCouch } = require("./index")

const UNICODE_MAX = "\ufff0"

exports.ViewNames = {
  USER_BY_EMAIL: "by_email",
}

exports.StaticDatabases = StaticDatabases

const PRE_APP = "app"
const PRE_DEV = "dev"

const DocumentTypes = {
  USER: "us",
  WORKSPACE: "workspace",
  CONFIG: "config",
  TEMPLATE: "template",
  APP: PRE_APP,
  DEV: PRE_DEV,
  APP_DEV: `${PRE_APP}${SEPARATOR}${PRE_DEV}`,
  APP_METADATA: `${PRE_APP}${SEPARATOR}metadata`,
  ROLE: "role",
}

exports.DocumentTypes = DocumentTypes
exports.APP_PREFIX = DocumentTypes.APP + SEPARATOR
exports.APP_DEV = exports.APP_DEV_PREFIX = DocumentTypes.APP_DEV + SEPARATOR
exports.SEPARATOR = SEPARATOR

/**
 * If creating DB allDocs/query params with only a single top level ID this can be used, this
 * is usually the case as most of our docs are top level e.g. tables, automations, users and so on.
 * More complex cases such as link docs and rows which have multiple levels of IDs that their
 * ID consists of need their own functions to build the allDocs parameters.
 * @param {string} docType The type of document which input params are being built for, e.g. user,
 * link, app, table and so on.
 * @param {string|null} docId The ID of the document minus its type - this is only needed if looking
 * for a singular document.
 * @param {object} otherProps Add any other properties onto the request, e.g. include_docs.
 * @returns {object} Parameters which can then be used with an allDocs request.
 */
function getDocParams(docType, docId = null, otherProps = {}) {
  if (docId == null) {
    docId = ""
  }
  return {
    ...otherProps,
    startkey: `${docType}${SEPARATOR}${docId}`,
    endkey: `${docType}${SEPARATOR}${docId}${UNICODE_MAX}`,
  }
}

exports.isDevAppID = appId => {
  return appId.startsWith(exports.APP_DEV_PREFIX)
}

exports.isProdAppID = appId => {
  return appId.startsWith(exports.APP_PREFIX) && !exports.isDevAppID(appId)
}

function isDevApp(app) {
  return exports.isDevAppID(app.appId)
}

/**
 * Given an app ID this will attempt to retrieve the tenant ID from it.
 * @return {null|string} The tenant ID found within the app ID.
 */
exports.getTenantIDFromAppID = appId => {
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

/**
 * Generates a new workspace ID.
 * @returns {string} The new workspace ID which the workspace doc can be stored under.
 */
exports.generateWorkspaceID = () => {
  return `${DocumentTypes.WORKSPACE}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving workspaces.
 */
exports.getWorkspaceParams = (id = "", otherProps = {}) => {
  return {
    ...otherProps,
    startkey: `${DocumentTypes.WORKSPACE}${SEPARATOR}${id}`,
    endkey: `${DocumentTypes.WORKSPACE}${SEPARATOR}${id}${UNICODE_MAX}`,
  }
}

/**
 * Generates a new global user ID.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
exports.generateGlobalUserID = id => {
  return `${DocumentTypes.USER}${SEPARATOR}${id || newid()}`
}

/**
 * Gets parameters for retrieving users.
 */
exports.getGlobalUserParams = (globalId, otherProps = {}) => {
  if (!globalId) {
    globalId = ""
  }
  return {
    ...otherProps,
    startkey: `${DocumentTypes.USER}${SEPARATOR}${globalId}`,
    endkey: `${DocumentTypes.USER}${SEPARATOR}${globalId}${UNICODE_MAX}`,
  }
}

/**
 * Generates a template ID.
 * @param ownerId The owner/user of the template, this could be global or a workspace level.
 */
exports.generateTemplateID = ownerId => {
  return `${DocumentTypes.TEMPLATE}${SEPARATOR}${ownerId}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving templates. Owner ID must be specified, either global or a workspace level.
 */
exports.getTemplateParams = (ownerId, templateId, otherProps = {}) => {
  if (!templateId) {
    templateId = ""
  }
  let final
  if (templateId) {
    final = templateId
  } else {
    final = `${DocumentTypes.TEMPLATE}${SEPARATOR}${ownerId}${SEPARATOR}`
  }
  return {
    ...otherProps,
    startkey: final,
    endkey: `${final}${UNICODE_MAX}`,
  }
}

/**
 * Generates a new role ID.
 * @returns {string} The new role ID which the role doc can be stored under.
 */
exports.generateRoleID = id => {
  return `${DocumentTypes.ROLE}${SEPARATOR}${id || newid()}`
}

/**
 * Gets parameters for retrieving a role, this is a utility function for the getDocParams function.
 */
exports.getRoleParams = (roleId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.ROLE, roleId, otherProps)
}

/**
 * Convert a development app ID to a deployed app ID.
 */
exports.getDeployedAppID = appId => {
  // if dev, convert it
  if (appId.startsWith(exports.APP_DEV_PREFIX)) {
    const id = appId.split(exports.APP_DEV_PREFIX)[1]
    return `${exports.APP_PREFIX}${id}`
  }
  return appId
}

exports.getCouchUrl = () => {
  if (!env.COUCH_DB_URL) return

  // username and password already exist in URL
  if (env.COUCH_DB_URL.includes("@")) {
    return env.COUCH_DB_URL
  }

  const [protocol, ...rest] = env.COUCH_DB_URL.split("://")

  if (!env.COUCH_DB_USERNAME || !env.COUCH_DB_PASSWORD) {
    throw new Error(
      "CouchDB configuration invalid. You must provide a fully qualified CouchDB url, or the COUCH_DB_USER and COUCH_DB_PASSWORD environment variables."
    )
  }

  return `${protocol}://${env.COUCH_DB_USERNAME}:${env.COUCH_DB_PASSWORD}@${rest}`
}

/**
 * if in production this will use the CouchDB _all_dbs call to retrieve a list of databases. If testing
 * when using Pouch it will use the pouchdb-all-dbs package.
 */
exports.getAllDbs = async () => {
  // specifically for testing we use the pouch package for this
  if (env.isTest()) {
    return getCouch().allDbs()
  }
  const response = await fetch(`${exports.getCouchUrl()}/_all_dbs`)
  if (response.status === 200) {
    return response.json()
  } else {
    throw "Cannot connect to CouchDB instance"
  }
}

/**
 * Lots of different points in the system need to find the full list of apps, this will
 * enumerate the entire CouchDB cluster and get the list of databases (every app).
 * NOTE: this operation is fine in self hosting, but cannot be used when hosting many
 * different users/companies apps as there is no security around it - all apps are returned.
 * @return {Promise<object[]>} returns the app information document stored in each app database.
 */
exports.getAllApps = async (CouchDB, { dev, all, idsOnly } = {}) => {
  let tenantId = getTenantId()
  if (!env.MULTI_TENANCY && !tenantId) {
    tenantId = DEFAULT_TENANT_ID
  }
  let dbs = await exports.getAllDbs()
  const appDbNames = dbs.filter(dbName => {
    const split = dbName.split(SEPARATOR)
    // it is an app, check the tenantId
    if (split[0] === DocumentTypes.APP) {
      const noTenantId = split.length === 2 || split[1] === DocumentTypes.DEV
      // tenantId is always right before the UUID
      const possibleTenantId = split[split.length - 2]
      return (
        (tenantId === DEFAULT_TENANT_ID && noTenantId) ||
        possibleTenantId === tenantId
      )
    }
    return false
  })
  if (idsOnly) {
    return appDbNames
  }
  const appPromises = appDbNames.map(db =>
    // skip setup otherwise databases could be re-created
    new CouchDB(db, { skip_setup: true }).get(DocumentTypes.APP_METADATA)
  )
  if (appPromises.length === 0) {
    return []
  } else {
    const response = await Promise.allSettled(appPromises)
    const apps = response
      .filter(result => result.status === "fulfilled")
      .map(({ value }) => value)
    if (!all) {
      return apps.filter(app => {
        if (dev) {
          return isDevApp(app)
        }
        return !isDevApp(app)
      })
    } else {
      return apps.map(app => ({
        ...app,
        status: isDevApp(app) ? "development" : "published",
      }))
    }
  }
}

exports.dbExists = async (CouchDB, dbName) => {
  let exists = false
  try {
    const db = CouchDB(dbName, { skip_setup: true })
    // check if database exists
    const info = await db.info()
    if (info && !info.error) {
      exists = true
    }
  } catch (err) {
    exists = false
  }
  return exists
}

/**
 * Generates a new configuration ID.
 * @returns {string} The new configuration ID which the config doc can be stored under.
 */
const generateConfigID = ({ type, workspace, user }) => {
  const scope = [type, workspace, user].filter(Boolean).join(SEPARATOR)

  return `${DocumentTypes.CONFIG}${SEPARATOR}${scope}`
}

/**
 * Gets parameters for retrieving configurations.
 */
const getConfigParams = ({ type, workspace, user }, otherProps = {}) => {
  const scope = [type, workspace, user].filter(Boolean).join(SEPARATOR)

  return {
    ...otherProps,
    startkey: `${DocumentTypes.CONFIG}${SEPARATOR}${scope}`,
    endkey: `${DocumentTypes.CONFIG}${SEPARATOR}${scope}${UNICODE_MAX}`,
  }
}

/**
 * Returns the most granular configuration document from the DB based on the type, workspace and userID passed.
 * @param {Object} db - db instance to query
 * @param {Object} scopes - the type, workspace and userID scopes of the configuration.
 * @returns The most granular configuration document based on the scope.
 */
const getScopedFullConfig = async function (db, { type, user, workspace }) {
  const response = await db.allDocs(
    getConfigParams(
      { type, user, workspace },
      {
        include_docs: true,
      }
    )
  )

  function determineScore(row) {
    const config = row.doc

    // Config is specific to a user and a workspace
    if (config._id.includes(generateConfigID({ type, user, workspace }))) {
      return 4
    } else if (config._id.includes(generateConfigID({ type, user }))) {
      // Config is specific to a user only
      return 3
    } else if (config._id.includes(generateConfigID({ type, workspace }))) {
      // Config is specific to a workspace only
      return 2
    } else if (config._id.includes(generateConfigID({ type }))) {
      // Config is specific to a type only
      return 1
    }
    return 0
  }

  // Find the config with the most granular scope based on context
  const scopedConfig = response.rows.sort(
    (a, b) => determineScore(a) - determineScore(b)
  )[0]

  return scopedConfig && scopedConfig.doc
}

async function getScopedConfig(db, params) {
  const configDoc = await getScopedFullConfig(db, params)
  return configDoc && configDoc.config ? configDoc.config : configDoc
}

exports.Replication = Replication
exports.getScopedConfig = getScopedConfig
exports.generateConfigID = generateConfigID
exports.getConfigParams = getConfigParams
exports.getScopedFullConfig = getScopedFullConfig
