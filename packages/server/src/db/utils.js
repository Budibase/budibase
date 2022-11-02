const newid = require("./newid")
const {
  DocumentType: CoreDocType,
  InternalTable,
  getRoleParams,
  generateRoleID,
  APP_DEV_PREFIX,
  APP_PREFIX,
  SEPARATOR,
  StaticDatabases,
  isDevAppID,
  isProdAppID,
  getDevelopmentAppID,
  generateAppID,
  getQueryIndex,
  ViewName,
  getDocParams,
  getRowParams,
  generateRowID,
  getUserMetadataParams,
  generateUserMetadataID,
  getGlobalIDFromUserMetadataID,
} = require("@budibase/backend-core/db")

const UNICODE_MAX = "\ufff0"

const AppStatus = {
  DEV: "development",
  ALL: "all",
  DEPLOYED: "published",
}

const DocumentType = CoreDocType

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
exports.isDevAppID = isDevAppID
exports.isProdAppID = isProdAppID
exports.USER_METDATA_PREFIX = `${DocumentType.ROW}${SEPARATOR}${InternalTable.USER_METADATA}${SEPARATOR}`
exports.LINK_USER_METADATA_PREFIX = `${DocumentType.LINK}${SEPARATOR}${InternalTable.USER_METADATA}${SEPARATOR}`
exports.TABLE_ROW_PREFIX = `${DocumentType.ROW}${SEPARATOR}${DocumentType.TABLE}`
exports.ViewName = ViewName
exports.InternalTables = InternalTable
exports.DocumentType = DocumentType
exports.SEPARATOR = SEPARATOR
exports.UNICODE_MAX = UNICODE_MAX
exports.SearchIndexes = SearchIndexes
exports.AppStatus = AppStatus
exports.BudibaseInternalDB = BudibaseInternalDB
exports.generateAppID = generateAppID
exports.generateDevAppID = getDevelopmentAppID
exports.generateRoleID = generateRoleID
exports.getRoleParams = getRoleParams
exports.getQueryIndex = getQueryIndex
exports.getDocParams = getDocParams
exports.getRowParams = getRowParams
exports.generateRowID = generateRowID
exports.getUserMetadataParams = getUserMetadataParams
exports.generateUserMetadataID = generateUserMetadataID
exports.getGlobalIDFromUserMetadataID = getGlobalIDFromUserMetadataID

/**
 * Gets parameters for retrieving tables, this is a utility function for the getDocParams function.
 */
exports.getTableParams = (tableId = null, otherProps = {}) => {
  return getDocParams(DocumentType.TABLE, tableId, otherProps)
}

/**
 * Generates a new table ID.
 * @returns {string} The new table ID which the table doc can be stored under.
 */
exports.generateTableID = () => {
  return `${DocumentType.TABLE}${SEPARATOR}${newid()}`
}

/**
 * Given a row ID this will find the table ID within it (only works for internal tables).
 * @param {string} rowId The ID of the row.
 * @returns {string} The table ID.
 */
exports.getTableIDFromRowID = rowId => {
  const components = rowId
    .split(DocumentType.TABLE + SEPARATOR)[1]
    .split(SEPARATOR)
  return `${DocumentType.TABLE}${SEPARATOR}${components[0]}`
}

/**
 * Gets parameters for retrieving automations, this is a utility function for the getDocParams function.
 */
exports.getAutomationParams = (automationId = null, otherProps = {}) => {
  return getDocParams(DocumentType.AUTOMATION, automationId, otherProps)
}

/**
 * Generates a new automation ID.
 * @returns {string} The new automation ID which the automation doc can be stored under.
 */
exports.generateAutomationID = () => {
  return `${DocumentType.AUTOMATION}${SEPARATOR}${newid()}`
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
  return `${DocumentType.LINK}${tables}${rows}${fields}`
}

/**
 * Gets parameters for retrieving link docs, this is a utility function for the getDocParams function.
 */
exports.getLinkParams = (otherProps = {}) => {
  return getDocParams(DocumentType.LINK, null, otherProps)
}

/**
 * Generates a new layout ID.
 * @returns {string} The new layout ID which the layout doc can be stored under.
 */
exports.generateLayoutID = id => {
  return `${DocumentType.LAYOUT}${SEPARATOR}${id || newid()}`
}

/**
 * Gets parameters for retrieving layout, this is a utility function for the getDocParams function.
 */
exports.getLayoutParams = (layoutId = null, otherProps = {}) => {
  return getDocParams(DocumentType.LAYOUT, layoutId, otherProps)
}

/**
 * Generates a new screen ID.
 * @returns {string} The new screen ID which the screen doc can be stored under.
 */
exports.generateScreenID = () => {
  return `${DocumentType.SCREEN}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving screens, this is a utility function for the getDocParams function.
 */
exports.getScreenParams = (screenId = null, otherProps = {}) => {
  return getDocParams(DocumentType.SCREEN, screenId, otherProps)
}

/**
 * Generates a new webhook ID.
 * @returns {string} The new webhook ID which the webhook doc can be stored under.
 */
exports.generateWebhookID = () => {
  return `${DocumentType.WEBHOOK}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving a webhook, this is a utility function for the getDocParams function.
 */
exports.getWebhookParams = (webhookId = null, otherProps = {}) => {
  return getDocParams(DocumentType.WEBHOOK, webhookId, otherProps)
}

/**
 * Generates a new datasource ID.
 * @returns {string} The new datasource ID which the webhook doc can be stored under.
 */
exports.generateDatasourceID = ({ plus = false } = {}) => {
  return `${
    plus ? DocumentType.DATASOURCE_PLUS : DocumentType.DATASOURCE
  }${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving a datasource, this is a utility function for the getDocParams function.
 */
exports.getDatasourceParams = (datasourceId = null, otherProps = {}) => {
  return getDocParams(DocumentType.DATASOURCE, datasourceId, otherProps)
}

/**
 * Generates a new query ID.
 * @returns {string} The new query ID which the query doc can be stored under.
 */
exports.generateQueryID = datasourceId => {
  return `${
    DocumentType.QUERY
  }${SEPARATOR}${datasourceId}${SEPARATOR}${newid()}`
}

/**
 * Generates a metadata ID for automations, used to track errors in recurring
 * automations etc.
 */
exports.generateAutomationMetadataID = automationId => {
  return `${DocumentType.AUTOMATION_METADATA}${SEPARATOR}${automationId}`
}

/**
 * Retrieve all automation metadata in an app database.
 */
exports.getAutomationMetadataParams = (otherProps = {}) => {
  return getDocParams(DocumentType.AUTOMATION_METADATA, null, otherProps)
}

/**
 * Gets parameters for retrieving a query, this is a utility function for the getDocParams function.
 */
exports.getQueryParams = (datasourceId = null, otherProps = {}) => {
  if (datasourceId == null) {
    return getDocParams(DocumentType.QUERY, null, otherProps)
  }

  return getDocParams(
    DocumentType.QUERY,
    `${datasourceId}${SEPARATOR}`,
    otherProps
  )
}

/**
 * Generates a new flag document ID.
 * @returns {string} The ID of the flag document that was generated.
 */
exports.generateUserFlagID = userId => {
  return `${DocumentType.USER_FLAG}${SEPARATOR}${userId}`
}

exports.generateMetadataID = (type, entityId) => {
  return `${DocumentType.METADATA}${SEPARATOR}${type}${SEPARATOR}${entityId}`
}

exports.getMetadataParams = (type, entityId = null, otherProps = {}) => {
  let docId = `${type}${SEPARATOR}`
  if (entityId != null) {
    docId += entityId
  }
  return getDocParams(DocumentType.METADATA, docId, otherProps)
}

exports.generateMemoryViewID = viewName => {
  return `${DocumentType.MEM_VIEW}${SEPARATOR}${viewName}`
}

exports.getMemoryViewParams = (otherProps = {}) => {
  return getDocParams(DocumentType.MEM_VIEW, null, otherProps)
}

exports.generatePluginID = name => {
  return `${DocumentType.PLUGIN}${SEPARATOR}${name}`
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
