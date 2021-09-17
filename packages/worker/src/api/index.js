const Router = require("@koa/router")
const compress = require("koa-compress")
const zlib = require("zlib")
const { routes } = require("./routes")
const { buildAuthMiddleware, auditLog, buildTenancyMiddleware } =
  require("@budibase/auth").auth

const PUBLIC_ENDPOINTS = [
  // old deprecated endpoints kept for backwards compat
  {
    route: "/api/admin/auth/google/callback",
    method: "GET",
  },
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
    // TODO: Add an provisioning API key to this endpoint in the cloud
    route: "/api/global/users/init",
    method: "POST",
  },
  {
    route: "/api/global/users/invite/accept",
    method: "POST",
  },
  {
    route: "api/system/environment",
    method: "GET",
  },
  {
    route: "/api/global/users/tenant/:id",
    method: "GET",
  },
]

const NO_TENANCY_ENDPOINTS = [
  ...PUBLIC_ENDPOINTS,
  {
    route: "/api/system",
    method: "ALL",
  },
  {
    route: "/api/global/users/self",
    method: "GET",
  },
]

const router = new Router()
router
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
  .use(buildAuthMiddleware(PUBLIC_ENDPOINTS))
  .use(buildTenancyMiddleware(PUBLIC_ENDPOINTS, NO_TENANCY_ENDPOINTS))
  // for now no public access is allowed to worker (bar health check)
  .use((ctx, next) => {
    if (ctx.publicEndpoint) {
      return next()
    }
    if (!ctx.isAuthenticated || !ctx.user.budibaseAccess) {
      ctx.throw(403, "Unauthorized - no public worker access")
    }
    return next()
  })
  .use(auditLog)

// error handling middleware
router.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.log.error(err)
    ctx.status = err.status || err.statusCode || 500
    ctx.body = {
      message: err.message,
      status: ctx.status,
    }
  }
})

router.get("/health", ctx => (ctx.status = 200))

// authenticated routes
for (let route of routes) {
  router.use(route.routes())
  router.use(route.allowedMethods())
}

module.exports = router
