const { newid } = require("../hashing")

exports.StaticDatabases = {
  USER: {
    name: "user-db",
  },
}

const DocumentTypes = {
  USER: "us",
  APP: "app",
  GROUP: "group",
}

exports.DocumentTypes = DocumentTypes

const UNICODE_MAX = "\ufff0"
const SEPARATOR = "_"

exports.SEPARATOR = SEPARATOR

/**
 * Generates a new user ID based on the passed in email.
 * @param {string} email The email which the ID is going to be built up of.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
exports.generateUserID = email => {
  return `${DocumentTypes.USER}${SEPARATOR}${email}`
}

exports.getEmailFromUserID = userId => {
  return userId.split(`${DocumentTypes.USER}${SEPARATOR}`)[1]
}

/**
 * Generates a new group ID.
 * @returns {string} The new group ID which the group doc can be stored under.
 */
exports.generateGroupID = () => {
  return `${DocumentTypes.GROUP}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving users, this is a utility function for the getDocParams function.
 */
exports.getUserParams = (email = "", otherProps = {}) => {
  if (!email) {
    email = ""
  }
  return {
    ...otherProps,
    startkey: `${DocumentTypes.USER}${SEPARATOR}${email}`,
    endkey: `${DocumentTypes.USER}${SEPARATOR}${email}${UNICODE_MAX}`,
  }
}
