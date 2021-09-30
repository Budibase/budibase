const API = require("./api")
const env = require("../environment")

const api = new API(env.ACCOUNT_PORTAL_URL)

// TODO: Authorization

exports.getAccount = async email => {
  const payload = {
    email,
  }
  const response = await api.post(`/api/accounts/search`, {
    body: payload,
  })
  const json = await response.json()

  if (response.status !== 200) {
    throw Error(`Error getting account by email ${email}`, json)
  }

  return json[0]
}
