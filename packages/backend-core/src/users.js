const {
  ViewNames,
  getUsersByAppParams,
  getProdAppID,
  generateAppUserID,
} = require("./db/utils")
const { queryGlobalView } = require("./db/views")
const { UNICODE_MAX } = require("./db/constants")

/**
 * Given an email address this will use a view to search through
 * all the users to find one with this email address.
 * @param {string} email the email to lookup the user by.
 * @return {Promise<object|null>}
 */
exports.getGlobalUserByEmail = async email => {
  if (email == null) {
    throw "Must supply an email address to view"
  }

  return await queryGlobalView(ViewNames.USER_BY_EMAIL, {
    key: email.toLowerCase(),
    include_docs: true,
  })
}

exports.searchGlobalUsersByApp = async (appId, opts) => {
  if (typeof appId !== "string") {
    throw new Error("Must provide a string based app ID")
  }
  const params = getUsersByAppParams(appId, {
    include_docs: true,
  })
  params.startkey = opts && opts.startkey ? opts.startkey : params.startkey
  let response = await queryGlobalView(ViewNames.USER_BY_APP, params)
  if (!response) {
    response = []
  }
  return Array.isArray(response) ? response : [response]
}

exports.getGlobalUserByAppPage = (appId, user) => {
  if (!user) {
    return
  }
  return generateAppUserID(getProdAppID(appId), user._id)
}

/**
 * Performs a starts with search on the global email view.
 */
exports.searchGlobalUsersByEmail = async (email, opts) => {
  if (typeof email !== "string") {
    throw new Error("Must provide a string to search by")
  }
  const lcEmail = email.toLowerCase()
  // handle if passing up startkey for pagination
  const startkey = opts && opts.startkey ? opts.startkey : lcEmail
  let response = await queryGlobalView(ViewNames.USER_BY_EMAIL, {
    ...opts,
    startkey,
    endkey: `${lcEmail}${UNICODE_MAX}`,
  })
  if (!response) {
    response = []
  }
  return Array.isArray(response) ? response : [response]
}
