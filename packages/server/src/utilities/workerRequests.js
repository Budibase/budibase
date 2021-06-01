const fetch = require("node-fetch")
const env = require("../environment")
const { checkSlashesInUrl } = require("./index")
const { BUILTIN_ROLE_IDS } = require("@budibase/auth/roles")
const { getDeployedAppID } = require("@budibase/auth/db")
const { getGlobalIDFromUserMetadataID } = require("../db/utils")

function getAppRole(appId, user) {
  if (!user.roles) {
    return user
  }
  // always use the deployed app
  user.roleId = user.roles[getDeployedAppID(appId)]
  if (!user.roleId) {
    user.roleId = BUILTIN_ROLE_IDS.PUBLIC
  }
  delete user.roles
  return user
}

function request(ctx, request) {
  if (!request.headers) {
    request.headers = {}
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

exports.sendSmtpEmail = async (to, from, subject, contents) => {
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/admin/email/send`),
    request(null, {
      method: "POST",
      headers: {
        "x-budibase-api-key": env.INTERNAL_API_KEY,
      },
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

exports.deleteGlobalUser = async (ctx, globalId) => {
  const endpoint = `/api/admin/users/${globalId}`
  const reqCfg = { method: "DELETE" }
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    request(ctx, reqCfg)
  )
  return response.json()
}

exports.getGlobalUsers = async (ctx, appId = null, globalId = null) => {
  const endpoint = globalId
    ? `/api/admin/users/${globalId}`
    : `/api/admin/users`
  const reqCfg = { method: "GET" }
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    request(ctx, reqCfg)
  )
  let users = await response.json()
  if (!appId) {
    return users
  }
  if (Array.isArray(users)) {
    users = users.map(user => getAppRole(appId, user))
  } else {
    users = getAppRole(appId, users)
  }
  return users
}

exports.getGlobalSelf = async (ctx, appId = null) => {
  const endpoint = `/api/admin/users/self`
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    request(ctx, { method: "GET" })
  )
  if (response.status !== 200) {
    ctx.throw(400, "Unable to get self globally.")
  }
  let json = await response.json()
  if (appId) {
    json = getAppRole(appId, json)
  }
  return json
}

exports.addAppRoleToUser = async (ctx, appId, roleId, userId = null) => {
  let user,
    endpoint,
    body = {}
  if (!userId) {
    user = await exports.getGlobalSelf(ctx)
    endpoint = `/api/admin/users/self`
  } else {
    userId = getGlobalIDFromUserMetadataID(userId)
    user = await exports.getGlobalUsers(ctx, appId, userId)
    body._id = userId
    endpoint = `/api/admin/users`
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

exports.removeAppFromUserRoles = async appId => {
  const deployedAppId = getDeployedAppID(appId)
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + `/api/admin/roles/${deployedAppId}`),
    request(null, {
      method: "DELETE",
      headers: {
        "x-budibase-api-key": env.INTERNAL_API_KEY,
      }
    })
  )
  if (response.status !== 200) {
    throw "Unable to remove app role"
  }
  return response.json()
}

