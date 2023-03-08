import fetch from "node-fetch"
import { constants, tenancy, logging } from "@budibase/backend-core"
import { checkSlashesInUrl } from "../utilities"
import env from "../environment"
import { SyncUserRequest, User } from "@budibase/types"

async function makeAppRequest(url: string, method: string, body: any) {
  if (env.isTest()) {
    return
  }
  const request: any = { headers: {} }
  request.headers[constants.Header.API_KEY] = env.INTERNAL_API_KEY
  if (tenancy.isTenantIdSet()) {
    request.headers[constants.Header.TENANT_ID] = tenancy.getTenantId()
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

export async function syncUserInApps(userId: string, previousUser?: User) {
  const body: SyncUserRequest = {
    previousUser,
  }

  const response = await makeAppRequest(
    `/api/users/metadata/sync/${userId}`,
    "POST",
    body
  )
  if (response && response.status !== 200) {
    throw "Unable to sync user."
  }
}
