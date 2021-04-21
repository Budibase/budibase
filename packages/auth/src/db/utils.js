const { newid } = require("../hashing")

exports.ViewNames = {
  USER_BY_EMAIL: "by_email",
}

exports.StaticDatabases = {
  GLOBAL: {
    name: "global-db",
  },
}

const DocumentTypes = {
  USER: "us",
  APP: "app",
  GROUP: "group",
  CONFIG: "config",
  TEMPLATE: "template",
}

exports.DocumentTypes = DocumentTypes

const UNICODE_MAX = "\ufff0"
const SEPARATOR = "_"

exports.SEPARATOR = SEPARATOR

/**
 * Generates a new group ID.
 * @returns {string} The new group ID which the group doc can be stored under.
 */
exports.generateGroupID = () => {
  return `${DocumentTypes.GROUP}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving groups.
 */
exports.getGroupParams = (id = "", otherProps = {}) => {
  return {
    ...otherProps,
    startkey: `${DocumentTypes.GROUP}${SEPARATOR}${id}`,
    endkey: `${DocumentTypes.GROUP}${SEPARATOR}${id}${UNICODE_MAX}`,
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
 * @param ownerId The owner/user of the template, this could be global or a group level.
 */
exports.generateTemplateID = ownerId => {
  return `${DocumentTypes.TEMPLATE}${SEPARATOR}${ownerId}${newid()}`
}

/**
 * Gets parameters for retrieving templates. Owner ID must be specified, either global or a group level.
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
 * Generates a new configuration ID.
 * @returns {string} The new configuration ID which the config doc can be stored under.
 */
exports.generateConfigID = (type = "", group = "", user = "") => {
  // group += SEPARATOR
  const scope = [type, group, user].join(SEPARATOR)

  return `${DocumentTypes.CONFIG}${SEPARATOR}${scope}${newid()}`
}

/**
 * Gets parameters for retrieving configurations.
 */
exports.getConfigParams = (type = "", group = "", otherProps = {}) => {
  return {
    ...otherProps,
    startkey: `${DocumentTypes.CONFIG}${SEPARATOR}${type}${SEPARATOR}${group}`,
    endkey: `${DocumentTypes.CONFIG}${SEPARATOR}${type}${SEPARATOR}${group}${UNICODE_MAX}`,
  }
}
