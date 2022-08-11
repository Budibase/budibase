const fetch = require("node-fetch")
const env = require("../environment")
const { checkSlashesInUrl } = require("./index")
const { getProdAppID } = require("@budibase/backend-core/db")
const { updateAppRole } = require("./global")
const { getTenantId, isTenantIdSet } = require("@budibase/backend-core/tenancy")
import { Headers, logging } from "@budibase/backend-core"

export function request(ctx: any, request: any) {
  if (!request.headers) {
    request.headers = {}
  }
  if (!ctx) {
    request.headers[Headers.API_KEY] = env.INTERNAL_API_KEY
    if (isTenantIdSet()) {
      request.headers[Headers.TENANT_ID] = getTenantId()
    }
  }
  if (request.body && Object.keys(request.body).length > 0) {
    request.headers["Content-Type"] = "application/json"
    request.body =
      typeof request.body === "object"
        ? JSON.stringify(request.body)
        : request.body
  } else {
    delete request.body
  }
  if (ctx && ctx.headers) {
    request.headers = ctx.headers
  }

  // add x-budibase-correlation-id header
  logging.correlation.setHeader(request.headers)

  return request
}

async function checkResponse(
  response: any,
  errorMsg: string,
  { ctx }: any = {}
) {
  if (response.status !== 200) {
    let error
    try {
      error = await response.json()
    } catch (err) {
      error = await response.text()
    }
    const msg = `Unable to ${errorMsg} - ${
      error.message ? error.message : error
    }`
    if (ctx) {
      ctx.throw(400, msg)
    } else {
      throw msg
    }
  }
  return response.json()
}

// have to pass in the tenant ID as this could be coming from an automation
export const sendSmtpEmail = async (
  to: string,
  from: string,
  subject: string,
  contents: any,
  automation: any
) => {
  // tenant ID will be set in header
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/global/email/send`),
    request(null, {
      method: "POST",
      body: {
        email: to,
        from,
        contents,
        subject,
        purpose: "custom",
        automation,
      },
    })
  )
  return checkResponse(response, "send email")
}

export const getGlobalSelf = async (ctx: any, appId = null) => {
  const endpoint = `/api/global/self`
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    // we don't want to use API key when getting self
    request(ctx, { method: "GET" })
  )
  let json = await checkResponse(response, "get self globally", { ctx })
  if (appId) {
    json = updateAppRole(json)
  }
  return json
}

export const removeAppFromUserRoles = async (ctx: any, appId: any) => {
  const prodAppId = getProdAppID(appId)
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/global/roles/${prodAppId}`),
    request(ctx, {
      method: "DELETE",
    })
  )
  return checkResponse(response, "remove app role")
}

export const allGlobalUsers = async (ctx: any) => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users"),
    // we don't want to use API key when getting self
    request(ctx, { method: "GET" })
  )
  return checkResponse(response, "get users", { ctx })
}

export const saveGlobalUser = async (ctx: any) => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users"),
    // we don't want to use API key when getting self
    request(ctx, { method: "POST", body: ctx.request.body })
  )
  return checkResponse(response, "save user", { ctx })
}

export const deleteGlobalUser = async (ctx: any) => {
  const response = await fetch(
    checkSlashesInUrl(
      env.WORKER_URL + `/api/global/users/${ctx.params.userId}`
    ),
    // we don't want to use API key when getting self
    request(ctx, { method: "DELETE" })
  )
  return checkResponse(response, "delete user", { ctx, body: ctx.request.body })
}

export const readGlobalUser = async (ctx: any) => {
  const response = await fetch(
    checkSlashesInUrl(
      env.WORKER_URL + `/api/global/users/${ctx.params.userId}`
    ),
    // we don't want to use API key when getting self
    request(ctx, { method: "GET" })
  )
  return checkResponse(response, "get user", { ctx })
}

export const createAdminUser = async (
  email: string,
  password: string,
  tenantId: string
) => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users/init"),
    request(null, { method: "POST", body: { email, password, tenantId } })
  )
  return checkResponse(response, "create admin user")
}

export const getChecklist = async () => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/configs/checklist"),
    request(null, { method: "GET" })
  )
  return checkResponse(response, "get checklist")
}
