const { apiKeyTable } = require("../../db/dynamoClient")
const env = require("../../environment")

/**
 * This file purely exists so that we can centralise all logic pertaining to API keys, as their usage differs
 * in our Cloud environment versus self hosted.
 */

exports.isAPIKeyValid = async apiKeyId => {
  if (!env.SELF_HOSTED) {
    let apiKeyInfo = await apiKeyTable.get({
      primary: apiKeyId,
    })
    return apiKeyInfo != null
  } else {
    // if the api key supplied is correct then return structure similar
    return apiKeyId === env.HOSTING_KEY
  }
}
