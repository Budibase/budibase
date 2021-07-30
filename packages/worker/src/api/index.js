const Router = require("@koa/router")
const compress = require("koa-compress")
const zlib = require("zlib")
const { routes } = require("./routes")
const { buildAuthMiddleware, auditLog } = require("@budibase/auth").auth
const { requestTenancy, sessionTenancy } =
  require("@budibase/auth").tenancy.middleware

const NO_TENANCY_ENDPOINTS = [
  {
    route: "/api/global",
    method: "ALL",
  },
  {
    route: "/api/admin/users/self",
    method: "GET",
  },
]

const PUBLIC_ENDPOINTS = [
  {
    // this covers all of the auth routes
    route: "/api/admin/auth",
    method: "ALL",
  },
  {
    // this covers all of the public config routes
    route: "/api/admin/configs/public",
    method: "GET",
  },
  {
    route: "/api/global/flags",
    method: "GET",
  },
  {
    route: "/api/admin/configs/checklist",
    method: "GET",
  },
  {
    route: "/api/admin/users/init",
    method: "POST",
  },
  {
    route: "/api/admin/users/invite/accept",
    method: "POST",
  },
]

const postAuth = (ctx, next) => {
  // for now no public access is allowed to worker (bar health check)
  if (!ctx.isAuthenticated) {
    ctx.throw(403, "Unauthorized - no public worker access")
  }

  return next()
}

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
  .use(requestTenancy(NO_TENANCY_ENDPOINTS))
  .use(buildAuthMiddleware(PUBLIC_ENDPOINTS))
  .use(postAuth)
  .use(sessionTenancy([...NO_TENANCY_ENDPOINTS, ...PUBLIC_ENDPOINTS]))
  // for now no public access is allowed to worker (bar health check)
  .use((ctx, next) => {
    if (!ctx.isAuthenticated && !ctx.publicEndpoint) {
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
