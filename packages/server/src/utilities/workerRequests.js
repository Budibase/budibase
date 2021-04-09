const fetch = require("node-fetch")
const env = require("../environment")
const { checkSlashesInUrl } = require("./index")
const { BUILTIN_ROLE_IDS } = require("./security/roles")

function getAppRole(appId, user) {
  if (!user.roles) {
    return user
  }
  user.roleId = user.roles[appId]
  if (!user.roleId) {
    user.roleId = BUILTIN_ROLE_IDS.PUBLIC
  }
  delete user.roles
  return user
}

function prepRequest(ctx, request) {
  if (!request.headers) {
    request.headers = {}
  }
  if (request.body) {
    request.headers["Content-Type"] = "application/json"
    request.body =
      typeof request.body === "object"
        ? JSON.stringify(request.body)
        : request.body
  }
  if (ctx.headers) {
    request.headers.cookie = ctx.headers.cookie
  }
  return request
}

exports.getDeployedApps = async ctx => {
  if (!env.SELF_HOSTED) {
    throw "Can only check apps for self hosted environments"
  }
  try {
    const response = await fetch(
      checkSlashesInUrl(env.WORKER_URL + `/api/apps`),
      prepRequest(ctx, {
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

exports.deleteGlobalUser = async (ctx, email) => {
  const endpoint = `/api/admin/users/${email}`
  const reqCfg = { method: "DELETE" }
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    prepRequest(ctx, reqCfg)
  )
  return response.json()
}

exports.getGlobalUsers = async (ctx, appId, email = null) => {
  const endpoint = email ? `/api/admin/users/${email}` : `/api/admin/users`
  const reqCfg = { method: "GET" }
  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    prepRequest(ctx, reqCfg)
  )
  let users = await response.json()
  if (Array.isArray(users)) {
    users = users.map(user => getAppRole(appId, user))
  } else {
    users = getAppRole(appId, users)
  }
  return users
}

exports.saveGlobalUser = async (ctx, appId, email, body) => {
  const globalUser = await exports.getGlobalUsers(ctx, appId, email)
  const roles = globalUser.roles || {}
  if (body.roleId) {
    roles[appId] = body.roleId
  }
  const endpoint = `/api/admin/users`
  const reqCfg = {
    method: "POST",
    body: {
      ...globalUser,
      email,
      password: body.password,
      status: body.status,
      roles,
    },
  }

  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    prepRequest(ctx, reqCfg)
  )
  const json = await response.json()
  if (json.status !== 200 && response.status !== 200) {
    ctx.throw(400, "Unable to save global user.")
  }
  delete body.email
  delete body.password
  delete body.roleId
  delete body.status
  return body
}
