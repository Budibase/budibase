const newid = require("./newid")

const DocumentTypes = {
  MODEL: "model",
  RECORD: "record",
  USER: "user",
  AUTOMATION: "automation",
  LINK: "link",
  APP: "app",
  ACCESS_LEVEL: "accesslevel",
}

exports.DocumentTypes = DocumentTypes

const UNICODE_MAX = "\ufff0"

/**
 * If creating DB allDocs/query params with only a single input this can be used, this
 * is usually the case for top level documents like models, automations, users etc.
 * @param {string} docType The type of document which input params are being built for, e.g. user,
 * link, app, model and so on.
 * @param {string|null} input The input if looking for a particular entry.
 * @param {object} otherProps Add any other properties onto the request, e.g. include_docs.
 * @returns {object} Parameters which can then be used with an allDocs request.
 */
function singleInputParams(docType, input, otherProps = {}) {
  if (input == null) {
    input = ""
  }
  return {
    ...otherProps,
    startkey: `${docType}:${input}`,
    endkey: `${docType}:${input}${UNICODE_MAX}`,
  }
}

/**
 * Gets parameters for retrieving models, this is a utility function for the singleInputParams function.
 */
exports.getModelParams = (modelId = null, otherProps = {}) => {
  return singleInputParams(DocumentTypes.MODEL, modelId, otherProps)
}

/**
 * Generates a new model ID.
 * @returns {string} The new model ID which the model doc can be stored under.
 */
exports.generateModelID = () => {
  return `${DocumentTypes.MODEL}:${newid()}`
}

/**
 * Gets the DB allDocs/query params for retrieving a record.
 * @param {string} modelId The model in which the records have been stored.
 * @param {string|null} recordId The ID of the record which is being specifically queried for. This can be
 * left null to get all the records in the model.
 * @param {object} otherProps Any other properties to add to the request.
 * @returns {object} Parameters which can then be used with an allDocs request.
 */
exports.getRecordParams = (modelId, recordId = null, otherProps = {}) => {
  if (modelId == null) {
    throw "Cannot build params for records without a model ID"
  }
  const endOfKey = recordId == null ? `${modelId}:` : `${modelId}:${recordId}`
  return {
    ...otherProps,
    startkey: `${DocumentTypes.RECORD}:${endOfKey}`,
    endkey: `${DocumentTypes.RECORD}:${endOfKey}${UNICODE_MAX}`,
  }
}

/**
 * Gets a new record ID for the specified model.
 * @param {string} modelId The model which the record is being created for.
 * @returns {string} The new ID which a record doc can be stored under.
 */
exports.generateRecordID = modelId => {
  return `${DocumentTypes.RECORD}:${modelId}:${newid()}`
}

/**
 * Gets parameters for retrieving users, this is a utility function for the singleInputParams function.
 */
exports.getUserParams = (username = null, otherProps = {}) => {
  return singleInputParams(DocumentTypes.USER, username, otherProps)
}

/**
 * Generates a new user ID based on the passed in username.
 * @param {string} username The username which the ID is going to be built up of.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
exports.generateUserID = username => {
  return `${DocumentTypes.USER}:${username}`
}

/**
 * Gets parameters for retrieving automations, this is a utility function for the singleInputParams function.
 */
exports.getAutomationParams = (automationId = null, otherProps = {}) => {
  return singleInputParams(DocumentTypes.AUTOMATION, automationId, otherProps)
}

/**
 * Generates a new automation ID.
 * @returns {string} The new automation ID which the automation doc can be stored under.
 */
exports.generateAutomationID = () => {
  return `${DocumentTypes.AUTOMATION}:${newid()}`
}

/**
 * Generates a new link doc ID. This is currently not usable with the alldocs call,
 * instead a view is built to make walking to tree easier.
 * @param {string} modelId1 The ID of the linker model.
 * @param {string} modelId2 The ID of the linked model.
 * @param {string} recordId1 The ID of the linker record.
 * @param {string} recordId2 The ID of the linked record.
 * @returns {string} The new link doc ID which the automation doc can be stored under.
 */
exports.generateLinkID = (modelId1, modelId2, recordId1, recordId2) => {
  return `${DocumentTypes.AUTOMATION}:${modelId1}:${modelId2}:${recordId1}:${recordId2}`
}

/**
 * Generates a new app ID.
 * @returns {string} The new app ID which the app doc can be stored under.
 */
exports.generateAppID = () => {
  return `${DocumentTypes.APP}:${newid()}`
}

/**
 * Gets parameters for retrieving apps, this is a utility function for the singleInputParams function.
 */
exports.getAppParams = (appId = null, otherProps = {}) => {
  return singleInputParams(DocumentTypes.APP, appId, otherProps)
}

/**
 * Generates a new access level ID.
 * @returns {string} The new access level ID which the access level doc can be stored under.
 */
exports.generateAccessLevelID = () => {
  return `${DocumentTypes.ACCESS_LEVEL}:${newid()}`
}

/**
 * Gets parameters for retrieving an access level, this is a utility function for the singleInputParams function.
 */
exports.getAccessLevelParams = (accessLevelId = null, otherProps = {}) => {
  return singleInputParams(
    DocumentTypes.ACCESS_LEVEL,
    accessLevelId,
    otherProps
  )
}
