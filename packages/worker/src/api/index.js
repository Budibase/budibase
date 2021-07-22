const Router = require("@koa/router")
const compress = require("koa-compress")
const zlib = require("zlib")
const { routes } = require("./routes")
const { buildAuthMiddleware, auditLog } = require("@budibase/auth").auth

const PUBLIC_ENDPOINTS = [
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
    route: "api/global/tenants/enabled",
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
  // for now no public access is allowed to worker (bar health check)
  .use((ctx, next) => {
    if (!ctx.isAuthenticated) {
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
