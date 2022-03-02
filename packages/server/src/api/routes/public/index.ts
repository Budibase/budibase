import appEndpoints from "./applications"
import queryEndpoints from "./queries"
import tableEndpoints from "./tables"
import rowEndpoints from "./rows"
import userEndpoints from "./users"
import usage from "../../../middleware/usageQuota"
import authorized from "../../../middleware/authorized"
import { paramResource, paramSubResource } from "../../../middleware/resourceId"
import { CtxFn } from "./utils/Endpoint"
import mapperMiddleware from "./middleware/mapper"
import env from "../../../environment"
// below imports don't have declaration files
const Router = require("@koa/router")
const RateLimit = require("koa2-ratelimit").RateLimit
const Stores = require("koa2-ratelimit").Stores
const {
  PermissionLevels,
  PermissionTypes,
} = require("@budibase/backend-core/permissions")
const { getRedisOptions } = require("@budibase/backend-core/redis").utils

const PREFIX = "/api/public/v1"
const DEFAULT_API_LIMITING = 120

if (!env.isTest()) {
  const REDIS_OPTS = getRedisOptions()
  RateLimit.defaultOptions({
    store: new Stores.Redis({
      socket: {
        host: REDIS_OPTS.host,
        port: REDIS_OPTS.port,
      },
      password: REDIS_OPTS.opts.password,
      database: 1,
    }),
  })
}
// rate limiting, allows for 2 requests per second
const limiter = RateLimit.middleware({
  interval: { min: 1 },
  // per ip, per interval
  max: env.API_RATE_LIMITING || DEFAULT_API_LIMITING,
})

const publicRouter = new Router({
  prefix: PREFIX,
})

publicRouter.use(limiter)

function addMiddleware(
  endpoints: any,
  middleware: CtxFn,
  opts: { output: boolean } = { output: false }
) {
  if (!endpoints) {
    return
  }
  if (!Array.isArray(endpoints)) {
    endpoints = [endpoints]
  }
  for (let endpoint of endpoints) {
    if (opts?.output) {
      endpoint.addOutputMiddleware(middleware)
    } else {
      endpoint.addMiddleware(middleware)
    }
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
  // add the parameter capture middleware
  addMiddleware(endpoints.read, paramMiddleware)
  addMiddleware(endpoints.write, paramMiddleware)
  // add the authorization middleware, using the correct perm type
  addMiddleware(endpoints.read, authorized(permType, PermissionLevels.READ))
  addMiddleware(endpoints.write, authorized(permType, PermissionLevels.WRITE))
  // add the usage quota middleware
  addMiddleware(endpoints.write, usage)
  // add the output mapper middleware
  addMiddleware(endpoints.read, mapperMiddleware, { output: true })
  addMiddleware(endpoints.write, mapperMiddleware, { output: true })
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
