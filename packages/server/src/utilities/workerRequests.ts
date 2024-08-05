import { Response, default as fetch, type RequestInit } from "node-fetch"
import env from "../environment"
import { checkSlashesInUrl } from "./index"
import {
  db as dbCore,
  constants,
  tenancy,
  logging,
  env as coreEnv,
} from "@budibase/backend-core"
import { Ctx, User, EmailInvite, EmailAttachment } from "@budibase/types"

interface Request {
  ctx?: Ctx
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: { [key: string]: string }
  body?: { [key: string]: any }
}

export function createRequest(request: Request): RequestInit {
  const headers: Record<string, string> = {}
  const requestInit: RequestInit = {
    method: request.method,
  }

  const ctx = request.ctx

  if (!ctx && coreEnv.INTERNAL_API_KEY) {
    headers[constants.Header.API_KEY] = coreEnv.INTERNAL_API_KEY
  } else if (ctx && ctx.headers) {
    // copy all Budibase utilised headers over - copying everything can have
    // side effects like requests being rejected due to odd content types etc
    for (let header of Object.values(constants.Header)) {
      const value = ctx.headers[header]
      if (value === undefined) {
        continue
      }
      headers[header] = Array.isArray(value) ? value[0] : value
    }
    // be specific about auth headers
    const cookie = ctx.headers[constants.Header.COOKIE],
      apiKey = ctx.headers[constants.Header.API_KEY]
    if (cookie) {
      headers[constants.Header.COOKIE] = cookie
    } else if (apiKey) {
      headers[constants.Header.API_KEY] = Array.isArray(apiKey)
        ? apiKey[0]
        : apiKey
    }
  }

  // apply tenancy if its available
  if (tenancy.isTenantIdSet()) {
    headers[constants.Header.TENANT_ID] = tenancy.getTenantId()
  }

  if (request.body && Object.keys(request.body).length > 0) {
    headers["Content-Type"] = "application/json"
    requestInit.body = JSON.stringify(request.body)
  }

  logging.correlation.setHeader(headers)
  requestInit.headers = headers
  return requestInit
}

async function checkResponse(
  response: Response,
  errorMsg: string,
  { ctx }: { ctx?: Ctx } = {}
) {
  if (response.status >= 300) {
    let responseErrorMessage
    if (response.headers.get("content-type")?.includes("json")) {
      const error = await response.json()
      responseErrorMessage = error.message ?? JSON.stringify(error)
    } else {
      responseErrorMessage = await response.text()
    }
    const msg = `Unable to ${errorMsg} - ${responseErrorMessage}`
    if (ctx) {
      ctx.throw(response.status || 500, msg)
    } else {
      throw msg
    }
  }
  return response.json()
}

// have to pass in the tenant ID as this could be coming from an automation
export async function sendSmtpEmail({
  to,
  from,
  subject,
  contents,
  cc,
  bcc,
  automation,
  invite,
  attachments,
}: {
  to: string
  from: string
  subject: string
  contents: string
  cc?: string
  bcc?: string
  automation: boolean
  attachments?: EmailAttachment[]
  invite?: EmailInvite
}) {
  // tenant ID will be set in header
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/global/email/send`),
    createRequest({
      method: "POST",
      body: {
        email: to,
        from,
        contents,
        subject,
        cc,
        bcc,
        purpose: "custom",
        automation,
        invite,
        attachments,
      },
    })
  )
  return checkResponse(response, "send email")
}

export async function removeAppFromUserRoles(ctx: Ctx, appId: string) {
  const prodAppId = dbCore.getProdAppID(appId)
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/global/roles/${prodAppId}`),
    createRequest({
      ctx,
      method: "DELETE",
    })
  )
  return checkResponse(response, "remove app role")
}

export async function allGlobalUsers(ctx: Ctx) {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users"),
    // we don't want to use API key when getting self
    createRequest({ ctx, method: "GET" })
  )
  return checkResponse(response, "get users", { ctx })
}

export async function saveGlobalUser(ctx: Ctx) {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users"),
    // we don't want to use API key when getting self
    createRequest({ ctx, method: "POST", body: ctx.request.body })
  )
  return checkResponse(response, "save user", { ctx })
}

export async function deleteGlobalUser(ctx: Ctx) {
  const response = await fetch(
    checkSlashesInUrl(
      env.WORKER_URL + `/api/global/users/${ctx.params.userId}`
    ),
    // we don't want to use API key when getting self
    createRequest({ ctx, method: "DELETE" })
  )
  return checkResponse(response, "delete user", { ctx })
}

export async function readGlobalUser(ctx: Ctx): Promise<User> {
  const response = await fetch(
    checkSlashesInUrl(
      env.WORKER_URL + `/api/global/users/${ctx.params.userId}`
    ),
    // we don't want to use API key when getting self
    createRequest({ ctx, method: "GET" })
  )
  return checkResponse(response, "get user", { ctx })
}

export async function getChecklist(): Promise<{
  adminUser: { checked: boolean }
}> {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/configs/checklist"),
    createRequest({ method: "GET" })
  )
  return checkResponse(response, "get checklist")
}

export async function generateApiKey(userId: string) {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/self/api_key"),
    createRequest({ method: "POST", body: { userId } })
  )
  return checkResponse(response, "generate API key")
}
