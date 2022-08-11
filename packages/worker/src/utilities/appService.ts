const fetch = require("node-fetch")
import { Headers, logging } from "@budibase/backend-core"
import { getTenantId, isTenantIdSet } from "@budibase/backend-core/tenancy"
const { checkSlashesInUrl } = require("../utilities")
const env = require("../environment")

const makeAppRequest = async (url: string, method: string, body: any) => {
  if (env.isTest()) {
    return
  }
  const request: any = { headers: {} }
  request.headers[Headers.API_KEY] = env.INTERNAL_API_KEY
  if (isTenantIdSet()) {
    request.headers[Headers.TENANT_ID] = getTenantId()
  }
  if (body) {
    request.headers["Content-Type"] = "application/json"
    request.body = JSON.stringify(body)
  }
  request.method = method

  // add x-budibase-correlation-id header
  logging.correlation.setHeader(request.headers)

  return fetch(checkSlashesInUrl(env.APPS_URL + url), request)
}

export const syncUserInApps = async (userId: string) => {
  const response = await makeAppRequest(
    `/api/users/metadata/sync/${userId}`,
    "POST",
    {}
  )
  if (response && response.status !== 200) {
    throw "Unable to sync user."
  }
}
