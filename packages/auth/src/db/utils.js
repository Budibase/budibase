const { newid } = require("../hashing")
const Replication = require("./Replication")

const UNICODE_MAX = "\ufff0"
const SEPARATOR = "_"

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
  GROUP: "group",
  CONFIG: "config",
  TEMPLATE: "template",
  APP: "app",
  APP_DEV: "app_dev",
  ROLE: "role",
}

exports.DocumentTypes = DocumentTypes
exports.APP_PREFIX = DocumentTypes.APP + SEPARATOR
exports.APP_DEV_PREFIX = DocumentTypes.APP_DEV + SEPARATOR
exports.SEPARATOR = SEPARATOR

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
  return `${DocumentTypes.TEMPLATE}${SEPARATOR}${ownerId}${SEPARATOR}${newid()}`
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
 * Generates a new role ID.
 * @returns {string} The new role ID which the role doc can be stored under.
 */
exports.generateRoleID = id => {
  return `${DocumentTypes.ROLE}${SEPARATOR}${id || newid()}`
}

/**
 * Gets parameters for retrieving a role, this is a utility function for the getDocParams function.
 */
exports.getRoleParams = (roleId = null, otherProps = {}) => {
  return getDocParams(DocumentTypes.ROLE, roleId, otherProps)
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
 * @param {Object} db - db instance to query
 * @param {Object} scopes - the type, group and userID scopes of the configuration.
 * @returns The most granular configuration document based on the scope.
 */
const getScopedFullConfig = async function (db, { type, user, group }) {
  const response = await db.allDocs(
    getConfigParams(
      { type, user, group },
      {
        include_docs: true,
      }
    )
  )

  function determineScore(row) {
    const config = row.doc

    // Config is specific to a user and a group
    if (config._id.includes(generateConfigID({ type, user, group }))) {
      return 4
    } else if (config._id.includes(generateConfigID({ type, user }))) {
      // Config is specific to a user only
      return 3
    } else if (config._id.includes(generateConfigID({ type, group }))) {
      // Config is specific to a group only
      return 2
    } else if (config._id.includes(generateConfigID({ type }))) {
      // Config is specific to a type only
      return 1
    }
    return 0
  }

  // Find the config with the most granular scope based on context
  const scopedConfig = response.rows.sort(
    (a, b) => determineScore(a) - determineScore(b)
  )[0]

  return scopedConfig && scopedConfig.doc
}

async function getScopedConfig(db, params) {
  const configDoc = await getScopedFullConfig(db, params)
  return configDoc && configDoc.config ? configDoc.config : configDoc
}

exports.Replication = Replication
exports.getScopedConfig = getScopedConfig
exports.generateConfigID = generateConfigID
exports.getConfigParams = getConfigParams
exports.getScopedFullConfig = getScopedFullConfig
