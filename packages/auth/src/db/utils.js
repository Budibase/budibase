const { newid } = require("../hashing")
const Replication = require("./Replication")
const { getDB, getCouch } = require("./index")
const { DEFAULT_TENANT_ID } = require("../constants")

const UNICODE_MAX = "\ufff0"
const SEPARATOR = "_"

exports.ViewNames = {
  USER_BY_EMAIL: "by_email",
}

exports.StaticDatabases = {
  GLOBAL: {
    name: "global-db",
    docs: {
      apiKeys: "apikeys",
    },
  },
  // contains information about tenancy and so on
  PLATFORM_INFO: {
    name: "global-info",
    docs: {
      tenants: "tenants",
    },
  },
}

const DocumentTypes = {
  USER: "us",
  WORKSPACE: "workspace",
  CONFIG: "config",
  TEMPLATE: "template",
  APP: "app",
  APP_DEV: "app_dev",
  APP_METADATA: "app_metadata",
  ROLE: "role",
}

exports.DocumentTypes = DocumentTypes
exports.APP_PREFIX = DocumentTypes.APP + SEPARATOR
exports.APP_DEV_PREFIX = DocumentTypes.APP_DEV + SEPARATOR
exports.SEPARATOR = SEPARATOR

function isDevApp(app) {
  return app.appId.startsWith(exports.APP_DEV_PREFIX)
}

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

/**
 * Gets the name of the global DB to connect to in a multi-tenancy system.
 */
exports.getGlobalDB = tenantId => {
  // fallback for system pre multi-tenancy
  let dbName = exports.StaticDatabases.GLOBAL.name
  if (tenantId && tenantId !== DEFAULT_TENANT_ID) {
    dbName = `${tenantId}${SEPARATOR}${dbName}`
  }
  return getDB(dbName)
}

/**
 * Given a koa context this tries to extra what tenant is being accessed.
 */
exports.getTenantIdFromCtx = ctx => {
  const user = ctx.user || {}
  const params = ctx.request.params || {}
  const query = ctx.request.query || {}
  return user.tenantId || params.tenantId || query.tenantId
}

/**
 * Given a koa context this tries to find the correct tenant Global DB.
 */
exports.getGlobalDBFromCtx = ctx => {
  const tenantId = exports.getTenantIdFromCtx(ctx)
  return exports.getGlobalDB(tenantId)
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
 * Lots of different points in the system need to find the full list of apps, this will
 * enumerate the entire CouchDB cluster and get the list of databases (every app).
 * NOTE: this operation is fine in self hosting, but cannot be used when hosting many
 * different users/companies apps as there is no security around it - all apps are returned.
 * @return {Promise<object[]>} returns the app information document stored in each app database.
 */
exports.getAllApps = async ({ tenantId, dev, all } = {}) => {
  if (!tenantId) {
    tenantId = DEFAULT_TENANT_ID
  }
  const CouchDB = getCouch()
  let allDbs = await CouchDB.allDbs()
  const appDbNames = allDbs.filter(dbName =>
    dbName.startsWith(exports.APP_PREFIX)
  )
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
      .filter(app => {
        const appTenant = !app.tenantId ? DEFAULT_TENANT_ID : app.tenantId
        return tenantId === appTenant
      })
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
