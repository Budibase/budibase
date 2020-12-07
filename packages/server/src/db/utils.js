const newid = require("./newid")

const UNICODE_MAX = "\ufff0"
const SEPARATOR = "_"

const DocumentTypes = {
  TABLE: "ta",
  ROW: "ro",
  USER: "us",
  AUTOMATION: "au",
  LINK: "li",
  APP: "app",
  ACCESS_LEVEL: "ac",
  WEBHOOK: "wh",
  INSTANCE: "inst",
  PAGE: "page",
  SCREEN: "screen",
}

const ViewNames = {
  LINK: "by_link",
  ROUTING: "screen_routes",
  USERS: "ta_users",
}

exports.ViewNames = ViewNames
exports.DocumentTypes = DocumentTypes
exports.SEPARATOR = SEPARATOR
exports.UNICODE_MAX = UNICODE_MAX

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

  const endOfKey =
    rowId == null ? `${tableId}${SEPARATOR}` : `${tableId}${SEPARATOR}${rowId}`

  return getDocParams(DocumentTypes.ROW, endOfKey, otherProps)
}

/**
 * Gets a new row ID for the specified table.
 * @param {string} tableId The table which the row is being created for.
 * @returns {string} The new ID which a row doc can be stored under.
 */
exports.generateRowID = tableId => {
  return `${DocumentTypes.ROW}${SEPARATOR}${tableId}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving users, this is a utility function for the getDocParams function.
 */
exports.getUserParams = (email = "", otherProps = {}) => {
  return getDocParams(
    DocumentTypes.ROW,
    `${ViewNames.USERS}${SEPARATOR}${DocumentTypes.USER}${SEPARATOR}${email}`,
    otherProps
  )
}

/**
 * Generates a new user ID based on the passed in username.
 * @param {string} email The email which the ID is going to be built up of.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
exports.generateUserID = email => {
  return `${DocumentTypes.ROW}${SEPARATOR}${ViewNames.USERS}${SEPARATOR}${DocumentTypes.USER}${SEPARATOR}${email}`
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
 * @returns {string} The new link doc ID which the automation doc can be stored under.
 */
exports.generateLinkID = (tableId1, tableId2, rowId1, rowId2) => {
  return `${DocumentTypes.LINK}${SEPARATOR}${tableId1}${SEPARATOR}${tableId2}${SEPARATOR}${rowId1}${SEPARATOR}${rowId2}`
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
exports.generateAppID = () => {
  return `${DocumentTypes.APP}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving apps, this is a utility function for the getDocParams function.
 */
exports.getAppParams = (appId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.APP, appId, otherProps)
}

/**
 * Generates a new access level ID.
 * @returns {string} The new access level ID which the access level doc can be stored under.
 */
exports.generateAccessLevelID = () => {
  return `${DocumentTypes.ACCESS_LEVEL}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving an access level, this is a utility function for the getDocParams function.
 */
exports.getAccessLevelParams = (accessLevelId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.ACCESS_LEVEL, accessLevelId, otherProps)
}

/**
 * Generates a new webhook ID.
 * @returns {string} The new webhook ID which the webhook doc can be stored under.
 */
exports.generateWebhookID = () => {
  return `${DocumentTypes.WEBHOOK}${SEPARATOR}${newid()}`
}

/**
 * Generates a new page ID.
 * @returns {string} The new page ID which the page doc can be stored under.
 */
exports.generatePageID = () => {
  return `${DocumentTypes.PAGE}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving pages, this is a utility function for the getDocParams function.
 */
exports.getPageParams = (pageId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.PAGE, pageId, otherProps)
}

/**
 * Generates a new screen ID.
 * @returns {string} The new screen ID which the screen doc can be stored under.
 */
exports.generateScreenID = pageId => {
  return `${DocumentTypes.SCREEN}${SEPARATOR}${pageId}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving screens for a particular page, this is a utility function for the getDocParams function.
 */
exports.getScreenParams = (pageId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.SCREEN, pageId, otherProps)
}

/**
 * Gets parameters for retrieving a webhook, this is a utility function for the getDocParams function.
 */
exports.getWebhookParams = (webhookId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.WEBHOOK, webhookId, otherProps)
}
