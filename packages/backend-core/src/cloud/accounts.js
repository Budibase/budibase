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

// TODO: Replace with licensing key
exports.getLicense = async tenantId => {
  const response = await api.get(`/api/license/${tenantId}`, {
    headers: {
      [Headers.API_KEY]: env.ACCOUNT_PORTAL_API_KEY,
    },
  })

  if (response.status !== 200) {
    const text = await response.text()
    console.error("Error getting license: ", text)
    throw new Error(`Error getting license for tenant ${tenantId}`)
  }

  const json = await response.json()
  return json
}
