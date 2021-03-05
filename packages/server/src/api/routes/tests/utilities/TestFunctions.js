const rowController = require("../../../controllers/row")
const appController = require("../../../controllers/application")

function Request(appId, params) {
  this.user = { appId }
  this.params = params
}

exports.getAllTableRows = async config => {
  const req = new Request(config.appId, { tableId: config.table._id })
  await rowController.fetchTableRows(req)
  return req.body
}

exports.clearAllApps = async () => {
  const req = {}
  await appController.fetch(req)
  const apps = req.body
  if (!apps || apps.length <= 0) {
    return
  }
  for (let app of apps) {
    const appId = app._id
    await appController.delete(new Request(null, { appId }))
  }
}

exports.clearAllAutomations = async config => {
  const automations = await config.getAllAutomations()
  for (let auto of automations) {
    await config.deleteAutomation(auto)
  }
}

exports.createRequest = (request, method, url, body) => {
  let req

  if (method === "POST") req = request.post(url).send(body)
  else if (method === "GET") req = request.get(url)
  else if (method === "DELETE") req = request.delete(url)
  else if (method === "PATCH") req = request.patch(url).send(body)
  else if (method === "PUT") req = request.put(url).send(body)

  return req
}

exports.checkBuilderEndpoint = async ({ config, method, url, body }) => {
  const headers = await config.login()
  await exports
    .createRequest(config.request, method, url, body)
    .set(headers)
    .expect(403)
}

exports.checkPermissionsEndpoint = async ({
  config,
  method,
  url,
  body,
  passRole,
  failRole,
}) => {
  const password = "PASSWORD"
  await config.createUser("passUser@budibase.com", password, passRole)
  const passHeader = await config.login("passUser@budibase.com", password)

  await exports
    .createRequest(config.request, method, url, body)
    .set(passHeader)
    .expect(200)

  await config.createUser("failUser@budibase.com", password, failRole)
  const failHeader = await config.login("failUser@budibase.com", password)

  await exports
    .createRequest(config.request, method, url, body)
    .set(failHeader)
    .expect(403)
}
