exports.StaticDatabases = {
  USER: {
    name: "user-db",
  },
}

const DocumentTypes = {
  USER: "us",
}

const UNICODE_MAX = "\ufff0"
const SEPARATOR = "_"

/**
 * Generates a new user ID based on the passed in email.
 * @param {string} email The email which the ID is going to be built up of.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
exports.generateUserID = email => {
  return `${DocumentTypes.USER}${SEPARATOR}${email}`
}

/**
 * Gets parameters for retrieving users, this is a utility function for the getDocParams function.
 */
exports.getUserParams = (email = "", otherProps = {}) => {
  return {
    ...otherProps,
    startkey: `${DocumentTypes.USER}${SEPARATOR}${email}`,
    endkey: `${DocumentTypes.USER}${SEPARATOR}${email}${UNICODE_MAX}`,
  }
}
