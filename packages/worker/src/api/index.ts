import Router from "@koa/router"
const compress = require("koa-compress")
import zlib from "zlib"
import { routes } from "./routes"
import { middleware as pro } from "@budibase/pro"
import { auth, middleware } from "@budibase/backend-core"

const PUBLIC_ENDPOINTS = [
  // deprecated single tenant sso callback
  {
    route: "/api/admin/auth/google/callback",
    method: "GET",
  },
  // deprecated single tenant sso callback
  {
    route: "/api/admin/auth/oidc/callback",
    method: "GET",
  },
  {
    // this covers all of the POST auth routes
    route: "/api/global/auth/:tenantId",
    method: "POST",
  },
  {
    // this covers all of the GET auth routes
    route: "/api/global/auth/:tenantId",
    method: "GET",
  },
  {
    // this covers all of the public config routes
    route: "/api/global/configs/public",
    method: "GET",
  },
  {
    route: "/api/global/configs/checklist",
    method: "GET",
  },
  {
    route: "/api/global/users/init",
    method: "POST",
  },
  {
    route: "/api/global/users/invite/accept",
    method: "POST",
  },
  {
    route: "/api/system/environment",
    method: "GET",
  },
  {
    route: "/api/system/status",
    method: "GET",
  },
  // TODO: This should be an internal api
  {
    route: "/api/global/users/tenant/:id",
    method: "GET",
  },
  // TODO: This should be an internal api
  {
    route: "/api/system/restored",
    method: "POST",
  },
  {
    route: "/api/global/users/invite",
    method: "GET",
  },
]

const NO_TENANCY_ENDPOINTS = [
  // system endpoints are not specific to any tenant
  {
    route: "/api/system",
    method: "ALL",
  },
  // tenant is determined in request body
  // used for creating the tenant
  {
    route: "/api/global/users/init",
    method: "POST",
  },
  // deprecated single tenant sso callback
  {
    route: "/api/admin/auth/google/callback",
    method: "GET",
  },
  // deprecated single tenant sso callback
  {
    route: "/api/admin/auth/oidc/callback",
    method: "GET",
  },
  // tenant is determined from code in redis
  {
    route: "/api/global/users/invite/accept",
    method: "POST",
  },
  // global user search - no tenancy
  // :id is user id
  // TODO: this should really be `/api/system/users/:id`
  {
    route: "/api/global/users/tenant/:id",
    method: "GET",
  },
]

// most public endpoints are gets, but some are posts
// add them all to be safe
const NO_CSRF_ENDPOINTS = [...PUBLIC_ENDPOINTS]

const router: Router = new Router()

router
  .use(middleware.errorHandling)
  .use(
    compress({
      threshold: 2048,
      gzip: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      deflate: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      br: false,
    })
  )
  .use("/health", ctx => (ctx.status = 200))
  .use(auth.buildAuthMiddleware(PUBLIC_ENDPOINTS))
  .use(auth.buildTenancyMiddleware(PUBLIC_ENDPOINTS, NO_TENANCY_ENDPOINTS))
  .use(auth.buildCsrfMiddleware({ noCsrfPatterns: NO_CSRF_ENDPOINTS }))
  .use(pro.licensing())
  // for now no public access is allowed to worker (bar health check)
  .use((ctx, next) => {
    if (ctx.publicEndpoint) {
      return next()
    }
    if (
      (!ctx.isAuthenticated || (ctx.user && !ctx.user.budibaseAccess)) &&
      !ctx.internal
    ) {
      ctx.throw(403, "Unauthorized")
    }
    return next()
  })
  .use(middleware.auditLog)

router.get("/health", ctx => (ctx.status = 200))

// authenticated routes
for (let route of routes) {
  router.use(route.routes())
  router.use(route.allowedMethods())
}

export default router
