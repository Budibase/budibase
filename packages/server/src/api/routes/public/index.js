const appEndpoints = require("./applications")
const queryEndpoints = require("./queries")
const tableEndpoints = require("./tables")
const rowEndpoints = require("./rows")
const userEndpoints = require("./users")
const Router = require("@koa/router")
const usage = require("../../../middleware/usageQuota")
const authorized = require("../../../middleware/authorized")
const {
  paramResource,
  paramSubResource,
} = require("../../../middleware/resourceId")
const {
  PermissionLevels,
  PermissionTypes,
} = require("@budibase/backend-core/permissions")

const PREFIX = "/api/public/v1"

const publicRouter = new Router({
  prefix: PREFIX,
})

function addMiddleware(endpoints, middleware) {
  if (!Array.isArray(endpoints)) {
    endpoints = [endpoints]
  }
  for (let endpoint of endpoints) {
    endpoint.addMiddleware(middleware)
  }
}

function addToRouter(endpoints) {
  for (let endpoint of endpoints) {
    endpoint.apply(publicRouter)
  }
}

function applyRoutes(endpoints, permType, resource, subResource = null) {
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
//applyRoutes(rowEndpoints, PermissionTypes.TABLE, "tableId", "rowId")

module.exports = publicRouter
