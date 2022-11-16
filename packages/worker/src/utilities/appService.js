const fetch = require("node-fetch")
const { Header } = require("@budibase/backend-core/constants")
const { getTenantId, isTenantIdSet } = require("@budibase/backend-core/tenancy")
const { checkSlashesInUrl } = require("../utilities")
const env = require("../environment")

async function makeAppRequest(url, method, body) {
  if (env.isTest()) {
    return
  }
  const request = { headers: {} }
  request.headers[Header.API_KEY] = env.INTERNAL_API_KEY
  if (isTenantIdSet()) {
    request.headers[Header.TENANT_ID] = getTenantId()
  }
  if (body) {
    request.headers["Content-Type"] = "application/json"
    request.body = JSON.stringify(body)
  }
  request.method = method
  return fetch(checkSlashesInUrl(env.APPS_URL + url), request)
}

exports.syncUserInApps = async userId => {
  const response = await makeAppRequest(
    `/api/users/metadata/sync/${userId}`,
    "POST",
    {}
  )
  if (response && response.status !== 200) {
    throw "Unable to sync user."
  }
}
