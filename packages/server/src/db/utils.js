const newid = require("./newid")
const {
  DocumentTypes: CoreDocTypes,
  getRoleParams,
  generateRoleID,
  APP_DEV_PREFIX,
  APP_PREFIX,
  SEPARATOR,
  StaticDatabases,
} = require("@budibase/auth/db")

const UNICODE_MAX = "\ufff0"

const AppStatus = {
  DEV: "development",
  ALL: "all",
  DEPLOYED: "published",
}

const DocumentTypes = {
  APP: CoreDocTypes.APP,
  DEV: CoreDocTypes.DEV,
  APP_DEV: CoreDocTypes.APP_DEV,
  APP_METADATA: CoreDocTypes.APP_METADATA,
  ROLE: CoreDocTypes.ROLE,
  TABLE: "ta",
  ROW: "ro",
  USER: "us",
  AUTOMATION: "au",
  LINK: "li",
  WEBHOOK: "wh",
  INSTANCE: "inst",
  LAYOUT: "layout",
  SCREEN: "screen",
  DATASOURCE: "datasource",
  DATASOURCE_PLUS: "datasource_plus",
  QUERY: "query",
  DEPLOYMENTS: "deployments",
}

const ViewNames = {
  LINK: "by_link",
  ROUTING: "screen_routes",
}

const InternalTables = {
  USER_METADATA: "ta_users",
}

const SearchIndexes = {
  ROWS: "rows",
}

exports.StaticDatabases = StaticDatabases

const BudibaseInternalDB = {
  _id: "bb_internal",
  type: "budibase",
  name: "Budibase DB",
  source: "BUDIBASE",
  config: {},
}

exports.APP_PREFIX = APP_PREFIX
exports.APP_DEV_PREFIX = APP_DEV_PREFIX
exports.USER_METDATA_PREFIX = `${DocumentTypes.ROW}${SEPARATOR}${InternalTables.USER_METADATA}${SEPARATOR}`
exports.LINK_USER_METADATA_PREFIX = `${DocumentTypes.LINK}${SEPARATOR}${InternalTables.USER_METADATA}${SEPARATOR}`
exports.ViewNames = ViewNames
exports.InternalTables = InternalTables
exports.DocumentTypes = DocumentTypes
exports.SEPARATOR = SEPARATOR
exports.UNICODE_MAX = UNICODE_MAX
exports.SearchIndexes = SearchIndexes
exports.AppStatus = AppStatus
exports.BudibaseInternalDB = BudibaseInternalDB

exports.generateRoleID = generateRoleID
exports.getRoleParams = getRoleParams

exports.getQueryIndex = viewName => {
  return `database/${viewName}`
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
 * Gets parameters for retrieving tables, this is a utility function for the getDocParams function.
 */
exports.getTableParams = (tableId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.TABLE, tableId, otherProps)
}

/**
 * Generates a new table ID.
 * @returns {string} The new table ID which the table doc can be stored under.
 */
exports.generateTableID = () => {
  return `${DocumentTypes.TABLE}${SEPARATOR}${newid()}`
}

/**
 * Gets the DB allDocs/query params for retrieving a row.
 * @param {string|null} tableId The table in which the rows have been stored.
 * @param {string|null} rowId The ID of the row which is being specifically queried for. This can be
 * left null to get all the rows in the table.
 * @param {object} otherProps Any other properties to add to the request.
 * @returns {object} Parameters which can then be used with an allDocs request.
 */
exports.getRowParams = (tableId = null, rowId = null, otherProps = {}) => {
  if (tableId == null) {
    return getDocParams(DocumentTypes.ROW, null, otherProps)
  }

  const endOfKey = rowId == null ? `${tableId}${SEPARATOR}` : rowId

  return getDocParams(DocumentTypes.ROW, endOfKey, otherProps)
}

/**
 * Gets a new row ID for the specified table.
 * @param {string} tableId The table which the row is being created for.
 * @param {string|null} id If an ID is to be used then the UUID can be substituted for this.
 * @returns {string} The new ID which a row doc can be stored under.
 */
exports.generateRowID = (tableId, id = null) => {
  id = id || newid()
  return `${DocumentTypes.ROW}${SEPARATOR}${tableId}${SEPARATOR}${id}`
}

/**
 * Gets parameters for retrieving users, this is a utility function for the getDocParams function.
 */
exports.getUserMetadataParams = (userId = null, otherProps = {}) => {
  return exports.getRowParams(InternalTables.USER_METADATA, userId, otherProps)
}

/**
 * Generates a new user ID based on the passed in global ID.
 * @param {string} globalId The ID of the global user.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
exports.generateUserMetadataID = globalId => {
  return exports.generateRowID(InternalTables.USER_METADATA, globalId)
}

/**
 * Breaks up the ID to get the global ID.
 */
exports.getGlobalIDFromUserMetadataID = id => {
  const prefix = `${DocumentTypes.ROW}${SEPARATOR}${InternalTables.USER_METADATA}${SEPARATOR}`
  if (!id || !id.includes(prefix)) {
    return id
  }
  return id.split(prefix)[1]
}

/**
 * Gets parameters for retrieving automations, this is a utility function for the getDocParams function.
 */
exports.getAutomationParams = (automationId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.AUTOMATION, automationId, otherProps)
}

/**
 * Generates a new automation ID.
 * @returns {string} The new automation ID which the automation doc can be stored under.
 */
exports.generateAutomationID = () => {
  return `${DocumentTypes.AUTOMATION}${SEPARATOR}${newid()}`
}

/**
 * Generates a new link doc ID. This is currently not usable with the alldocs call,
 * instead a view is built to make walking to tree easier.
 * @param {string} tableId1 The ID of the linker table.
 * @param {string} tableId2 The ID of the linked table.
 * @param {string} rowId1 The ID of the linker row.
 * @param {string} rowId2 The ID of the linked row.
 * @param {string} fieldName1 The name of the field in the linker row.
 * @param {string} fieldName2 the name of the field in the linked row.
 * @returns {string} The new link doc ID which the automation doc can be stored under.
 */
exports.generateLinkID = (
  tableId1,
  tableId2,
  rowId1,
  rowId2,
  fieldName1,
  fieldName2
) => {
  const tables = `${SEPARATOR}${tableId1}${SEPARATOR}${tableId2}`
  const rows = `${SEPARATOR}${rowId1}${SEPARATOR}${rowId2}`
  const fields = `${SEPARATOR}${fieldName1}${SEPARATOR}${fieldName2}`
  return `${DocumentTypes.LINK}${tables}${rows}${fields}`
}

/**
 * Gets parameters for retrieving link docs, this is a utility function for the getDocParams function.
 */
exports.getLinkParams = (otherProps = {}) => {
  return getDocParams(DocumentTypes.LINK, null, otherProps)
}

/**
 * Generates a new app ID.
 * @returns {string} The new app ID which the app doc can be stored under.
 */
exports.generateAppID = (tenantId = null) => {
  let id = `${DocumentTypes.APP}${SEPARATOR}`
  if (tenantId) {
    id += `${tenantId}${SEPARATOR}`
  }
  return `${id}${newid()}`
}

/**
 * Generates a development app ID from a real app ID.
 * @returns {string} the dev app ID which can be used for dev database.
 */
exports.generateDevAppID = appId => {
  const prefix = `${DocumentTypes.APP}${SEPARATOR}`
  const rest = appId.split(prefix)[1]
  return `${DocumentTypes.APP_DEV}${SEPARATOR}${rest}`
}

/**
 * Generates a new layout ID.
 * @returns {string} The new layout ID which the layout doc can be stored under.
 */
exports.generateLayoutID = id => {
  return `${DocumentTypes.LAYOUT}${SEPARATOR}${id || newid()}`
}

/**
 * Gets parameters for retrieving layout, this is a utility function for the getDocParams function.
 */
exports.getLayoutParams = (layoutId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.LAYOUT, layoutId, otherProps)
}

/**
 * Generates a new screen ID.
 * @returns {string} The new screen ID which the screen doc can be stored under.
 */
exports.generateScreenID = () => {
  return `${DocumentTypes.SCREEN}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving screens, this is a utility function for the getDocParams function.
 */
exports.getScreenParams = (screenId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.SCREEN, screenId, otherProps)
}

/**
 * Generates a new webhook ID.
 * @returns {string} The new webhook ID which the webhook doc can be stored under.
 */
exports.generateWebhookID = () => {
  return `${DocumentTypes.WEBHOOK}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving a webhook, this is a utility function for the getDocParams function.
 */
exports.getWebhookParams = (webhookId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.WEBHOOK, webhookId, otherProps)
}

/**
 * Generates a new datasource ID.
 * @returns {string} The new datasource ID which the webhook doc can be stored under.
 */
exports.generateDatasourceID = ({ plus = false } = {}) => {
  return `${
    plus ? DocumentTypes.DATASOURCE_PLUS : DocumentTypes.DATASOURCE
  }${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving a datasource, this is a utility function for the getDocParams function.
 */
exports.getDatasourceParams = (datasourceId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.DATASOURCE, datasourceId, otherProps)
}

/**
 * Generates a new query ID.
 * @returns {string} The new query ID which the query doc can be stored under.
 */
exports.generateQueryID = datasourceId => {
  return `${
    DocumentTypes.QUERY
  }${SEPARATOR}${datasourceId}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving a query, this is a utility function for the getDocParams function.
 */
exports.getQueryParams = (datasourceId = null, otherProps = {}) => {
  if (datasourceId == null) {
    return getDocParams(DocumentTypes.QUERY, null, otherProps)
  }

  return getDocParams(
    DocumentTypes.QUERY,
    `${datasourceId}${SEPARATOR}`,
    otherProps
  )
}

/**
 * This can be used with the db.allDocs to get a list of IDs
 */
exports.getMultiIDParams = ids => {
  return {
    keys: ids,
    include_docs: true,
  }
}
