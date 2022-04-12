const { ViewNames } = require("./db/utils")
const { queryGlobalView } = require("./db/views")

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

  const response = await queryGlobalView(ViewNames.USER_BY_EMAIL, {
    key: email.toLowerCase(),
    include_docs: true,
  })

  if (response) {
    if (Array.isArray(response)) {
      for (let user of response) {
        delete user.password
      }
    } else {
      delete response.password
    }
  }

  return response
}
