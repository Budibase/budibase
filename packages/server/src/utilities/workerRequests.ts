import fetch from "node-fetch"
import env from "../environment"
import { checkSlashesInUrl } from "./index"
import {
  db as dbCore,
  constants,
  tenancy,
  logging,
  env as coreEnv,
} from "@budibase/backend-core"
import { Ctx, User, EmailInvite } from "@budibase/types"

export function request(ctx?: Ctx, request?: any) {
  if (!request.headers) {
    request.headers = {}
  }
  if (!ctx) {
    request.headers[constants.Header.API_KEY] = coreEnv.INTERNAL_API_KEY
    if (tenancy.isTenantIdSet()) {
      request.headers[constants.Header.TENANT_ID] = tenancy.getTenantId()
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
  { ctx }: { ctx?: Ctx } = {}
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
export async function sendSmtpEmail({
  to,
  from,
  subject,
  contents,
  cc,
  bcc,
  automation,
  invite,
}: {
  to: string
  from: string
  subject: string
  contents: string
  cc: string
  bcc: string
  automation: boolean
  invite?: EmailInvite
}) {
  // tenant ID will be set in header
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/global/email/send`),
    request(undefined, {
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
      },
    })
  )
  return checkResponse(response, "send email")
}

export async function removeAppFromUserRoles(ctx: Ctx, appId: string) {
  const prodAppId = dbCore.getProdAppID(appId)
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/global/roles/${prodAppId}`),
    request(ctx, {
      method: "DELETE",
    })
  )
  return checkResponse(response, "remove app role")
}

export async function allGlobalUsers(ctx: Ctx) {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users"),
    // we don't want to use API key when getting self
    request(ctx, { method: "GET" })
  )
  return checkResponse(response, "get users", { ctx })
}

export async function saveGlobalUser(ctx: Ctx) {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users"),
    // we don't want to use API key when getting self
    request(ctx, { method: "POST", body: ctx.request.body })
  )
  return checkResponse(response, "save user", { ctx })
}

export async function deleteGlobalUser(ctx: Ctx) {
  const response = await fetch(
    checkSlashesInUrl(
      env.WORKER_URL + `/api/global/users/${ctx.params.userId}`
    ),
    // we don't want to use API key when getting self
    request(ctx, { method: "DELETE" })
  )
  return checkResponse(response, "delete user", { ctx })
}

export async function readGlobalUser(ctx: Ctx): Promise<User> {
  const response = await fetch(
    checkSlashesInUrl(
      env.WORKER_URL + `/api/global/users/${ctx.params.userId}`
    ),
    // we don't want to use API key when getting self
    request(ctx, { method: "GET" })
  )
  return checkResponse(response, "get user", { ctx })
}

export async function createAdminUser(
  email: string,
  password: string,
  tenantId: string
) {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users/init"),
    request(undefined, { method: "POST", body: { email, password, tenantId } })
  )
  return checkResponse(response, "create admin user")
}

export async function getChecklist() {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/configs/checklist"),
    request(undefined, { method: "GET" })
  )
  return checkResponse(response, "get checklist")
}

export async function generateApiKey(userId: string) {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/self/api_key"),
    request(undefined, { method: "POST", body: { userId } })
  )
  return checkResponse(response, "generate API key")
}
