import * as rowController from "../../../controllers/row"
import * as appController from "../../../controllers/application"
import { AppStatus } from "../../../../db/utils"
import { roles, tenancy, context } from "@budibase/backend-core"
import { TENANT_ID } from "../../../../tests/utilities/structures"
import * as env from "../../../../environment"

class Request {
  appId: any
  params: any
  request: any
  body: any

  constructor(appId: any, params: any) {
    this.appId = appId
    this.params = params
    this.request = {}
  }
}

function runRequest(appId: any, controlFunc: any, request?: any) {
  return context.doInAppContext(appId, async () => {
    return controlFunc(request)
  })
}

export const getAllTableRows = async (config: any) => {
  const req = new Request(config.appId, { tableId: config.table._id })
  await runRequest(config.appId, rowController.fetch, req)
  return req.body
}

export const clearAllApps = async (tenantId = TENANT_ID) => {
  await tenancy.doInTenant(tenantId, async () => {
    const req: any = { query: { status: AppStatus.DEV }, user: { tenantId } }
    await appController.fetch(req)
    const apps = req.body
    if (!apps || apps.length <= 0) {
      return
    }
    for (let app of apps) {
      const { appId } = app
      const req = new Request(null, { appId })
      await runRequest(appId, appController.destroy, req)
    }
  })
}

export const clearAllAutomations = async (config: any) => {
  const automations = await config.getAllAutomations()
  for (let auto of automations) {
    await context.doInAppContext(config.appId, async () => {
      await config.deleteAutomation(auto)
    })
  }
}

export const createRequest = (
  request: any,
  method: any,
  url: any,
  body: any
) => {
  let req

  if (method === "POST") req = request.post(url).send(body)
  else if (method === "GET") req = request.get(url)
  else if (method === "DELETE") req = request.delete(url)
  else if (method === "PATCH") req = request.patch(url).send(body)
  else if (method === "PUT") req = request.put(url).send(body)

  return req
}

export const checkBuilderEndpoint = async ({
  config,
  method,
  url,
  body,
}: any) => {
  const headers = await config.login({
    userId: "us_fail",
    builder: false,
    prodApp: true,
  })
  await exports
    .createRequest(config.request, method, url, body)
    .set(headers)
    .expect(403)
}

export const checkPermissionsEndpoint = async ({
  config,
  method,
  url,
  body,
  passRole,
  failRole,
}: any) => {
  const passHeader = await config.login({
    roleId: passRole,
    prodApp: true,
  })

  await exports
    .createRequest(config.request, method, url, body)
    .set(passHeader)
    .expect(200)

  let failHeader
  if (failRole === roles.BUILTIN_ROLE_IDS.PUBLIC) {
    failHeader = config.publicHeaders({ prodApp: true })
  } else {
    failHeader = await config.login({
      roleId: failRole,
      builder: false,
      prodApp: true,
    })
  }

  await exports
    .createRequest(config.request, method, url, body)
    .set(failHeader)
    .expect(403)
}

export const getDB = () => {
  return context.getAppDB()
}

export const testAutomation = async (config: any, automation: any) => {
  return runRequest(automation.appId, async () => {
    return await config.request
      .post(`/api/automations/${automation._id}/test`)
      .send({
        row: {
          name: "Test",
          description: "TEST",
        },
      })
      .set(config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  })
}

export const runInProd = async (func: any) => {
  const nodeEnv = env.NODE_ENV
  const workerId = env.JEST_WORKER_ID
  env._set("NODE_ENV", "PRODUCTION")
  env._set("JEST_WORKER_ID", null)
  await func()
  env._set("NODE_ENV", nodeEnv)
  env._set("JEST_WORKER_ID", workerId)
}
