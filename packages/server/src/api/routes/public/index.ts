import appEndpoints from "./applications"
import metricEndpoints from "./metrics"
import queryEndpoints from "./queries"
import tableEndpoints from "./tables"
import rowEndpoints from "./rows"
import userEndpoints from "./users"
import authorized from "../../../middleware/authorized"
import publicApi from "../../../middleware/publicApi"
import { paramResource, paramSubResource } from "../../../middleware/resourceId"
import { PermissionType, PermissionLevel } from "@budibase/types"
import { CtxFn } from "./utils/Endpoint"
import mapperMiddleware from "./middleware/mapper"
import env from "../../../environment"
// below imports don't have declaration files
const Router = require("@koa/router")
const { RateLimit, Stores } = require("koa2-ratelimit")
import { middleware, redis } from "@budibase/backend-core"

const PREFIX = "/api/public/v1"
// allow a lot more requests when in test
const DEFAULT_API_REQ_LIMIT_PER_SEC = env.isTest() ? 100 : 10

function getApiLimitPerSecond(): number {
  if (!env.API_REQ_LIMIT_PER_SEC) {
    return DEFAULT_API_REQ_LIMIT_PER_SEC
  }
  return parseInt(env.API_REQ_LIMIT_PER_SEC)
}

let rateLimitStore: any = null
if (!env.isTest()) {
  const REDIS_OPTS = redis.utils.getRedisOptions()
  let options
  if (REDIS_OPTS.redisProtocolUrl) {
    // fully qualified redis URL
    options = {
      url: REDIS_OPTS.redisProtocolUrl,
    }
  } else {
    options = {
      socket: {
        host: REDIS_OPTS.host,
        port: REDIS_OPTS.port,
      },
    }

    if (REDIS_OPTS.opts?.password || REDIS_OPTS.opts.redisOptions?.password) {
      // @ts-ignore
      options.password =
        REDIS_OPTS.opts.password || REDIS_OPTS.opts.redisOptions.password
    }

    if (!env.REDIS_CLUSTERED) {
      // @ts-ignore
      // Can't set direct redis db in clustered env
      options.database = 1
    }
  }
  rateLimitStore = new Stores.Redis(options)
  RateLimit.defaultOptions({
    store: rateLimitStore,
  })
}
// rate limiting, allows for 2 requests per second
const limiter = RateLimit.middleware({
  interval: { sec: 1 },
  // per ip, per interval
  max: getApiLimitPerSecond(),
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

function applyAdminRoutes(endpoints: any) {
  addMiddleware(endpoints.read, middleware.builderOrAdmin)
  addMiddleware(endpoints.write, middleware.builderOrAdmin)
  addToRouter(endpoints.read)
  addToRouter(endpoints.write)
}

function applyRoutes(
  endpoints: any,
  permType: PermissionType,
  resource: string,
  subResource?: string
) {
  const paramMiddleware = subResource
    ? paramSubResource(resource, subResource)
    : paramResource(resource)
  const publicApiMiddleware = publicApi({
    requiresAppId:
      permType !== PermissionType.APP && permType !== PermissionType.USER,
  })
  addMiddleware(endpoints.read, publicApiMiddleware)
  addMiddleware(endpoints.write, publicApiMiddleware)
  // add the parameter capture middleware
  addMiddleware(endpoints.read, paramMiddleware)
  addMiddleware(endpoints.write, paramMiddleware)
  // add the authorization middleware, using the correct perm type
  addMiddleware(endpoints.read, authorized(permType, PermissionLevel.READ))
  addMiddleware(endpoints.write, authorized(permType, PermissionLevel.WRITE))
  // add the output mapper middleware
  addMiddleware(endpoints.read, mapperMiddleware, { output: true })
  addMiddleware(endpoints.write, mapperMiddleware, { output: true })
  addToRouter(endpoints.read)
  addToRouter(endpoints.write)
}

applyAdminRoutes(metricEndpoints)
applyRoutes(appEndpoints, PermissionType.APP, "appId")
applyRoutes(tableEndpoints, PermissionType.TABLE, "tableId")
applyRoutes(userEndpoints, PermissionType.USER, "userId")
applyRoutes(queryEndpoints, PermissionType.QUERY, "queryId")
// needs to be applied last for routing purposes, don't override other endpoints
applyRoutes(rowEndpoints, PermissionType.TABLE, "tableId", "rowId")

export default publicRouter

export const shutdown = () => {
  if (rateLimitStore) {
    rateLimitStore.client.disconnect()
    rateLimitStore = null
  }
}
