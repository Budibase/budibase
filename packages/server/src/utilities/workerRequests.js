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
        "x-budibase-api-key": env.INTERNAL_KEY,
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

  const json = await response.json()
  if (json.status !== 200 && response.status !== 200) {
    throw "Unable to send email."
  }
  return json
}

exports.getDeployedApps = async ctx => {
  if (!env.SELF_HOSTED) {
    throw "Can only check apps for self hosted environments"
  }
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

exports.saveGlobalUser = async (ctx, appId, body) => {
  const globalUser = body._id
    ? await exports.getGlobalUsers(ctx, appId, body._id)
    : {}
  const roles = globalUser.roles || {}
  if (body.roleId) {
    roles[appId] = body.roleId
  }
  const endpoint = `/api/admin/users`
  const reqCfg = {
    method: "POST",
    body: {
      ...globalUser,
      password: body.password || undefined,
      status: body.status,
      email: body.email,
      roles,
      builder: {
        global: true,
      },
    },
  }

  const response = await fetch(
    checkSlashesInUrl(env.WORKER_URL + endpoint),
    request(ctx, reqCfg)
  )
  const json = await response.json()
  if (json.status !== 200 && response.status !== 200) {
    ctx.throw(400, "Unable to save global user.")
  }
  delete body.password
  delete body.roles
  delete body.builder
  // TODO: for now these have been left in as they are
  // TODO: pretty important to keeping relationships working
  // TODO: however if user metadata is changed this should be removed
  // delete body.email
  // delete body.roleId
  // delete body.status
  return {
    ...body,
    _id: json._id,
  }
}
