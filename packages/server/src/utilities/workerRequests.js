const fetch = require("node-fetch")
const env = require("../environment")
const { checkSlashesInUrl } = require("./index")
const { getDeployedAppID } = require("@budibase/auth/db")
const { updateAppRole, getGlobalUser } = require("./global")
const { Headers } = require("@budibase/auth/constants")
const { getTenantId, isTenantIdSet } = require("@budibase/auth/tenancy")

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
    request.headers.cookie = ctx.headers.cookie
  }
  return request
}

exports.request = request

// have to pass in the tenant ID as this could be coming from an automation
exports.sendSmtpEmail = async (to, from, subject, contents) => {
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
      },
    })
  )

  if (response.status !== 200) {
    throw "Unable to send email."
  }
  return response.json()
}

exports.getDeployedApps = async ctx => {
  try {
    const response = await fetch(
      checkSlashesInUrl(env.WORKER_URL + `/api/apps`),
      request(ctx, {
        method: "GET",
      })
    )
    const json = await response.json()
    const apps = {}
    for (let [key, value] of Object.entries(json)) {
      if (value.url) {
        value.url = value.url.toLowerCase()
        apps[key] = value
      }
    }
    return apps
  } catch (err) {
    // error, cannot determine deployed apps, don't stop app creation - sort this later
    return {}
  }
}

exports.getGlobalSelf = async (ctx, appId = null) => {
  const endpoint = `/api/global/users/self`
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    // we don't want to use API key when getting self
    request(ctx, { method: "GET" })
  )
  if (response.status !== 200) {
    ctx.throw(400, "Unable to get self globally.")
  }
  let json = await response.json()
  if (appId) {
    json = updateAppRole(appId, json)
  }
  return json
}

exports.addAppRoleToUser = async (ctx, appId, roleId, userId = null) => {
  let user,
    endpoint,
    body = {}
  if (!userId) {
    user = await exports.getGlobalSelf(ctx)
    endpoint = `/api/global/users/self`
  } else {
    user = await getGlobalUser(appId, userId)
    body._id = userId
    endpoint = `/api/global/users`
  }
  body = {
    ...body,
    roles: {
      ...user.roles,
      [getDeployedAppID(appId)]: roleId,
    },
  }
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    request(ctx, {
      method: "POST",
      body,
    })
  )
  if (response.status !== 200) {
    ctx.throw(400, "Unable to save self globally.")
  }
  return response.json()
}

exports.removeAppFromUserRoles = async (ctx, appId) => {
  const deployedAppId = getDeployedAppID(appId)
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/global/roles/${deployedAppId}`),
    request(ctx, {
      method: "DELETE",
    })
  )
  if (response.status !== 200) {
    throw "Unable to remove app role"
  }
  return response.json()
}
