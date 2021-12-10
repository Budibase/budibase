const { newid } = require("../hashing")
const Replication = require("./Replication")
const { DEFAULT_TENANT_ID, Configs } = require("../constants")
const env = require("../environment")
const { StaticDatabases, SEPARATOR, DocumentTypes } = require("./constants")
const {
  getTenantId,
  getTenantIDFromAppID,
  getGlobalDBName,
} = require("../tenancy")
const fetch = require("node-fetch")
const { getCouch } = require("./index")
const { getAppMetadata } = require("../cache/appMetadata")
const { checkSlashesInUrl } = require("../helpers")

const NO_APP_ERROR = "No app provided"

const UNICODE_MAX = "\ufff0"

exports.ViewNames = {
  USER_BY_EMAIL: "by_email",
}

exports.StaticDatabases = StaticDatabases

exports.DocumentTypes = DocumentTypes
exports.APP_PREFIX = DocumentTypes.APP + SEPARATOR
exports.APP_DEV = exports.APP_DEV_PREFIX = DocumentTypes.APP_DEV + SEPARATOR
exports.SEPARATOR = SEPARATOR
exports.getTenantIDFromAppID = getTenantIDFromAppID

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
  if (!appId) {
    throw NO_APP_ERROR
  }
  return appId.startsWith(exports.APP_DEV_PREFIX)
}

exports.isProdAppID = appId => {
  if (!appId) {
    throw NO_APP_ERROR
  }
  return appId.startsWith(exports.APP_PREFIX) && !exports.isDevAppID(appId)
}

function isDevApp(app) {
  if (!app) {
    throw NO_APP_ERROR
  }
  return exports.isDevAppID(app.appId)
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

/**
 * Convert a deployed app ID to a development app ID.
 */
exports.getDevelopmentAppID = appId => {
  if (!appId.startsWith(exports.APP_DEV_PREFIX)) {
    const id = appId.split(exports.APP_PREFIX)[1]
    return `${exports.APP_DEV_PREFIX}${id}`
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

exports.getStartEndKeyURL = (base, baseKey, tenantId = null) => {
  const tenancy = tenantId ? `${SEPARATOR}${tenantId}` : ""
  return `${base}?startkey="${baseKey}${tenancy}"&endkey="${baseKey}${tenancy}${UNICODE_MAX}"`
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
  let dbs = []
  async function addDbs(url) {
    const response = await fetch(checkSlashesInUrl(encodeURI(url)))
    if (response.status === 200) {
      let json = await response.json()
      dbs = dbs.concat(json)
    } else {
      throw "Cannot connect to CouchDB instance"
    }
  }
  let couchUrl = `${exports.getCouchUrl()}/_all_dbs`
  if (env.MULTI_TENANCY) {
    let tenantId = getTenantId()
    // get prod apps
    await addDbs(
      exports.getStartEndKeyURL(couchUrl, DocumentTypes.APP, tenantId)
    )
    // get dev apps
    await addDbs(
      exports.getStartEndKeyURL(couchUrl, DocumentTypes.APP_DEV, tenantId)
    )
    // add global db name
    dbs.push(getGlobalDBName(tenantId))
  } else {
    // just get all DBs in self host
    await addDbs(couchUrl)
  }
  return dbs
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
      // tenantId is always right before the UUID
      const possibleTenantId = split[split.length - 2]

      const noTenantId =
        split.length === 2 || possibleTenantId === DocumentTypes.DEV

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
  const appPromises = appDbNames.map(app =>
    // skip setup otherwise databases could be re-created
    getAppMetadata(app, CouchDB)
  )
  if (appPromises.length === 0) {
    return []
  } else {
    const response = await Promise.allSettled(appPromises)
    const apps = response
      .filter(result => result.status === "fulfilled" && result.value != null)
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

/**
 * Utility function for getAllApps but filters to production apps only.
 */
exports.getDeployedAppIDs = async CouchDB => {
  return (await exports.getAllApps(CouchDB, { idsOnly: true })).filter(
    id => !exports.isDevAppID(id)
  )
}

/**
 * Utility function for the inverse of above.
 */
exports.getDevAppIDs = async CouchDB => {
  return (await exports.getAllApps(CouchDB, { idsOnly: true })).filter(id =>
    exports.isDevAppID(id)
  )
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
  let scopedConfig = response.rows.sort(
    (a, b) => determineScore(a) - determineScore(b)
  )[0]

  // custom logic for settings doc
  // always provide the platform URL
  if (type === Configs.SETTINGS) {
    if (scopedConfig && scopedConfig.doc) {
      scopedConfig.doc.config.platformUrl = await getPlatformUrl(
        scopedConfig.doc.config
      )
    } else {
      scopedConfig = {
        doc: {
          config: {
            platformUrl: await getPlatformUrl(),
          },
        },
      }
    }
  }

  return scopedConfig && scopedConfig.doc
}

const getPlatformUrl = async settings => {
  let platformUrl = env.PLATFORM_URL || "http://localhost:10000"

  if (!env.SELF_HOSTED && env.MULTI_TENANCY) {
    // cloud and multi tenant - add the tenant to the default platform url
    const tenantId = getTenantId()
    if (!platformUrl.includes("localhost:")) {
      platformUrl = platformUrl.replace("://", `://${tenantId}.`)
    }
  } else {
    // self hosted - check for platform url override
    if (settings && settings.platformUrl) {
      platformUrl = settings.platformUrl
    }
  }

  return platformUrl
}

async function getScopedConfig(db, params) {
  const configDoc = await getScopedFullConfig(db, params)
  return configDoc && configDoc.config ? configDoc.config : configDoc
}

function generateNewUsageQuotaDoc() {
  return {
    _id: StaticDatabases.PLATFORM_INFO.docs.usageQuota,
    quotaReset: Date.now() + 2592000000,
    usageQuota: {
      automationRuns: 0,
      rows: 0,
      storage: 0,
      apps: 0,
      users: 0,
      views: 0,
      emails: 0,
    },
    usageLimits: {
      automationRuns: 1000,
      rows: 4000,
      apps: 4,
      storage: 1000,
      users: 10,
      emails: 50,
    },
  }
}

exports.Replication = Replication
exports.getScopedConfig = getScopedConfig
exports.generateConfigID = generateConfigID
exports.getConfigParams = getConfigParams
exports.getScopedFullConfig = getScopedFullConfig
exports.generateNewUsageQuotaDoc = generateNewUsageQuotaDoc
