import appEndpoints from "./applications"
import queryEndpoints from "./queries"
import tableEndpoints from "./tables"
import rowEndpoints from "./rows"
import userEndpoints from "./users"
import usage from "../../../middleware/usageQuota"
import authorized from "../../../middleware/authorized"
import { paramResource, paramSubResource } from "../../../middleware/resourceId"
import { CtxFn } from "./utils/Endpoint"
const Router = require("@koa/router")
const {
  PermissionLevels,
  PermissionTypes,
} = require("@budibase/backend-core/permissions")

const PREFIX = "/api/public/v1"

const publicRouter = new Router({
  prefix: PREFIX,
})

function addMiddleware(endpoints: any, middleware: CtxFn) {
  if (!endpoints) {
    return
  }
  if (!Array.isArray(endpoints)) {
    endpoints = [endpoints]
  }
  for (let endpoint of endpoints) {
    endpoint.addMiddleware(middleware)
  }
}

function addToRouter(endpoints: any) {
  if (endpoints) {
    for (let endpoint of endpoints) {
      endpoint.apply(publicRouter)
    }
  }
}

function applyRoutes(
  endpoints: any,
  permType: string,
  resource: string,
  subResource?: string
) {
  const paramMiddleware = subResource
    ? paramSubResource(resource, subResource)
    : paramResource(resource)
  addMiddleware(endpoints.read, paramMiddleware)
  addMiddleware(endpoints.write, paramMiddleware)
  addMiddleware(endpoints.read, authorized(permType, PermissionLevels.READ))
  addMiddleware(endpoints.write, authorized(permType, PermissionLevels.WRITE))
  addMiddleware(endpoints.write, usage)
  addToRouter(endpoints.read)
  addToRouter(endpoints.write)
}

applyRoutes(appEndpoints, PermissionTypes.APP, "appId")
applyRoutes(tableEndpoints, PermissionTypes.TABLE, "tableId")
applyRoutes(userEndpoints, PermissionTypes.USER, "userId")
applyRoutes(queryEndpoints, PermissionTypes.QUERY, "queryId")
// needs to be applied last for routing purposes, don't override other endpoints
applyRoutes(rowEndpoints, PermissionTypes.TABLE, "tableId", "rowId")

module.exports = publicRouter
