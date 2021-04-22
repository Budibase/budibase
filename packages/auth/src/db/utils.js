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
const generateConfigID = ({ type, group, user }) => {
  const scope = [type, group, user].filter(Boolean).join(SEPARATOR)

  return `${DocumentTypes.CONFIG}${SEPARATOR}${scope}`
}

/**
 * Gets parameters for retrieving configurations.
 */
const getConfigParams = ({ type, group, user }, otherProps = {}) => {
  const scope = [type, group, user].filter(Boolean).join(SEPARATOR)

  return {
    ...otherProps,
    startkey: `${DocumentTypes.CONFIG}${SEPARATOR}${scope}`,
    endkey: `${DocumentTypes.CONFIG}${SEPARATOR}${scope}${UNICODE_MAX}`,
  }
}

/**
 * Returns the most granular configuration document from the DB based on the type, group and userID passed.
 * @param {*} db - db instance to quer
 * @param {Object} scopes - the type, group and userID scopes of the configuration.
 * @returns The most granular configuration document based on the scope.
 */
const determineScopedConfig = async function(db, { type, user, group }) {
  const response = await db.allDocs(
    getConfigParams(
      { type, user, group },
      {
        include_docs: true,
      }
    )
  )
  const configs = response.rows.map(row => row.doc)

  // Find the config with the most granular scope based on context
  const scopedConfig = configs.find(config => {
    // Config is specific to a user and a group
    if (config._id.includes(generateConfigID({ type, user, group }))) {
      return config
    }

    // Config is specific to a user
    if (config._id.includes(generateConfigID({ type, user }))) {
      return config
    }

    // Config is specific to a group only
    if (config._id.includes(generateConfigID({ type, group }))) {
      return config
    }

    // Config specific to a config type only
    return config
  })

  return scopedConfig
}

exports.generateConfigID = generateConfigID
exports.getConfigParams = getConfigParams
exports.determineScopedConfig = determineScopedConfig
