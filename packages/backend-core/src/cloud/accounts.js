const API = require("./api")
const env = require("../environment")
const { Headers } = require("../constants")

const api = new API(env.ACCOUNT_PORTAL_URL)

exports.getAccount = async email => {
  const payload = {
    email,
  }
  const response = await api.post(`/api/accounts/search`, {
    body: payload,
    headers: {
      [Headers.API_KEY]: env.ACCOUNT_PORTAL_API_KEY,
    },
  })
  const json = await response.json()

  if (response.status !== 200) {
    throw new Error(`Error getting account by email ${email}`, json)
  }

  return json[0]
}

exports.getStatus = async () => {
  const response = await api.get(`/api/status`, {
    headers: {
      [Headers.API_KEY]: env.ACCOUNT_PORTAL_API_KEY,
    },
  })
  const json = await response.json()

  if (response.status !== 200) {
    throw new Error(`Error getting status`)
  }

  return json
}
