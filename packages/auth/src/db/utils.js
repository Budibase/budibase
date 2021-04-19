const uuid = require("uuid/v4")

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
}

exports.DocumentTypes = DocumentTypes

const UNICODE_MAX = "\ufff0"
const SEPARATOR = "_"

exports.SEPARATOR = SEPARATOR

/**
 * Generates a new global user ID.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
exports.generateUserID = () => {
  return `${DocumentTypes.USER}${SEPARATOR}${uuid()}`
}

/**
 * Gets parameters for retrieving users, this is a utility function for the getDocParams function.
 */
exports.getUserParams = (globalId = "", otherProps = {}) => {
  if (!globalId) {
    globalId = ""
  }
  return {
    ...otherProps,
    startkey: `${DocumentTypes.USER}${SEPARATOR}${globalId}`,
    endkey: `${DocumentTypes.USER}${SEPARATOR}${globalId}${UNICODE_MAX}`,
  }
}
