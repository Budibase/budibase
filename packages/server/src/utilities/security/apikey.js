const { apiKeyTable } = require("../../db/dynamoClient")
const env = require("../../environment")
const { getSelfHostInfo } = require("../../selfhost")

/**
 * This file purely exists so that we can centralise all logic pertaining to API keys, as their usage differs
 * in our Cloud environment versus self hosted.
 */

exports.getAPIKey = async apiKeyId => {
  if (env.CLOUD && !env.SELF_HOSTED) {
    return apiKeyTable.get({
      primary: apiKeyId,
    })
  }
  if (env.SELF_HOSTED) {
    const selfHostInfo = await getSelfHostInfo()
    // if the api key supplied is correct then return structure similar
    return apiKeyId === selfHostInfo.apiKeyId ? { pk: apiKeyId } : null
  }
  return null
}
