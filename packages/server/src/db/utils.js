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

exports.getModelParams = (modelId, otherProps = {}) => {
  return singleInputParams(DocumentTypes.MODEL, modelId, otherProps)
}

exports.generateModelID = modelId => {
  return `${DocumentTypes.MODEL}:${modelId}`
}

exports.getRecordParams = (modelId, recordId, otherProps = {}) => {
  if (modelId == null && recordId != null) {
    throw "Cannot build key for record ID without a model ID"
  }
  const endOfKey = recordId == null ? `${modelId}:` : `${modelId}:${recordId}`
  return {
    ...otherProps,
    startkey: `${DocumentTypes.RECORD}:${endOfKey}`,
    endkey: `${DocumentTypes.RECORD}:${endOfKey}${UNICODE_MAX}`,
  }
}

exports.generateRecordID = (modelId, recordId) => {
  return `${DocumentTypes.RECORD}:${modelId}:${recordId}`
}

exports.getUserParams = (username, otherProps = {}) => {
  return singleInputParams(DocumentTypes.USER, username, otherProps)
}

exports.generateUserID = username => {
  return `${DocumentTypes.USER}:${username}`
}

exports.getAutomationParams = (automationId, otherProps = {}) => {
  return singleInputParams(DocumentTypes.AUTOMATION, automationId, otherProps)
}

exports.generateAutomationID = automationId => {
  return `${DocumentTypes.AUTOMATION}:${automationId}`
}

// for now link records still have their own view as we can walk multiple directions
exports.generateLinkID = (modelId1, modelId2, recordId1, recordId2) => {
  return `${DocumentTypes.AUTOMATION}:${modelId1}:${modelId2}:${recordId1}:${recordId2}`
}

exports.generateAppID = appId => {
  return `${DocumentTypes.APP}:${appId}`
}

exports.getAppParams = (appId, otherProps = {}) => {
  return singleInputParams(DocumentTypes.APP, appId, otherProps)
}

exports.generateAccessLevelID = accessLevelId => {
  return `${DocumentTypes.ACCESS_LEVEL}:${accessLevelId}`
}

exports.getAccessLevelParams = (accessLevelId, otherProps) => {
  return singleInputParams(
    DocumentTypes.ACCESS_LEVEL,
    accessLevelId,
    otherProps
  )
}
