const fetch = require("node-fetch")
const { Headers } = require("@budibase/auth/constants")
const { getTenantId, isTenantIdSet } = require("@budibase/auth/tenancy")
const { checkSlashesInUrl } = require("../utilities")
const env = require("../environment")

exports.syncUserInApps = async userId => {
  const request = { headers: {} }
  request.headers[Headers.API_KEY] = env.INTERNAL_API_KEY
  if (isTenantIdSet()) {
    request.headers[Headers.TENANT_ID] = getTenantId()
  }
  request.headers["Content-Type"] = "application/json"
  request.body = JSON.stringify({})
  request.method = "POST"
  const response = await fetch(
    checkSlashesInUrl(env.APPS_URL + `/api/users/sync/${userId}`),
    request
  )
  if (response.status !== 200) {
    throw "Unable to sync user."
  }
}
