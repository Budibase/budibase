const fetch = require("node-fetch")
const env = require("../environment")
const { checkSlashesInUrl } = require("./index")
const { getProdAppID } = require("@budibase/backend-core/db")
const { updateAppRole } = require("./global")
const { Headers } = require("@budibase/backend-core/constants")
const { getTenantId, isTenantIdSet } = require("@budibase/backend-core/tenancy")

function request(ctx, request) {
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
  return request
}

async function checkResponse(response, errorMsg, { ctx } = {}) {
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

exports.request = request

// have to pass in the tenant ID as this could be coming from an automation
exports.sendSmtpEmail = async (
  to,
  from,
  subject,
  contents,
  cc,
  bcc,
  automation
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
        cc,
        bcc,
        purpose: "custom",
        automation,
      },
    })
  )
  return checkResponse(response, "send email")
}

exports.getGlobalSelf = async (ctx, appId = null) => {
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

exports.removeAppFromUserRoles = async (ctx, appId) => {
  const prodAppId = getProdAppID(appId)
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/global/roles/${prodAppId}`),
    request(ctx, {
      method: "DELETE",
    })
  )
  return checkResponse(response, "remove app role")
}

exports.allGlobalUsers = async ctx => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users"),
    // we don't want to use API key when getting self
    request(ctx, { method: "GET" })
  )
  return checkResponse(response, "get users", { ctx })
}

exports.saveGlobalUser = async ctx => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users"),
    // we don't want to use API key when getting self
    request(ctx, { method: "POST", body: ctx.request.body })
  )
  return checkResponse(response, "save user", { ctx })
}

exports.deleteGlobalUser = async ctx => {
  const response = await fetch(
    checkSlashesInUrl(
      env.WORKER_URL + `/api/global/users/${ctx.params.userId}`
    ),
    // we don't want to use API key when getting self
    request(ctx, { method: "DELETE" })
  )
  return checkResponse(response, "delete user", { ctx, body: ctx.request.body })
}

exports.readGlobalUser = async ctx => {
  const response = await fetch(
    checkSlashesInUrl(
      env.WORKER_URL + `/api/global/users/${ctx.params.userId}`
    ),
    // we don't want to use API key when getting self
    request(ctx, { method: "GET" })
  )
  return checkResponse(response, "get user", { ctx })
}

exports.createAdminUser = async (email, password, tenantId) => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/users/init"),
    request(null, { method: "POST", body: { email, password, tenantId } })
  )
  return checkResponse(response, "create admin user")
}

exports.getChecklist = async () => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/configs/checklist"),
    request(null, { method: "GET" })
  )
  return checkResponse(response, "get checklist")
}

exports.generateApiKey = async userId => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + "/api/global/self/api_key"),
    request(null, { method: "POST", body: { userId } })
  )
  return checkResponse(response, "generate API key")
}
