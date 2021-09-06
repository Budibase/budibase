const Router = require("@koa/router")
const { buildAuthMiddleware, auditLog, buildTenancyMiddleware } =
  require("@budibase/auth").auth
const currentApp = require("../middleware/currentapp")
const compress = require("koa-compress")
const zlib = require("zlib")
const { mainRoutes, staticRoutes } = require("./routes")
const pkg = require("../../package.json")
const env = require("../environment")

const router = new Router()

const NO_TENANCY_ENDPOINTS = [
  {
    route: "/api/analytics",
    method: "GET",
  },
  {
    route: "/builder",
    method: "GET",
  },
  // when using this locally there can be pass through, need
  // to allow all pass through endpoints to go without tenancy
  {
    route: "/api/global",
    method: "ALL",
  },
  {
    route: "/api/system",
    method: "ALL",
  },
]

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
  .use(async (ctx, next) => {
    ctx.config = {
      jwtSecret: env.JWT_SECRET,
      useAppRootPath: true,
    }
    await next()
  })
  .use("/health", ctx => (ctx.status = 200))
  .use("/version", ctx => (ctx.body = pkg.version))
  .use(
    buildAuthMiddleware(null, {
      publicAllowed: true,
    })
  )
  // nothing in the server should allow query string tenants
  .use(buildTenancyMiddleware(null, NO_TENANCY_ENDPOINTS))
  .use(currentApp)
  .use(auditLog)

// error handling middleware
router.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || err.statusCode || 500
    ctx.body = {
      message: err.message,
      status: ctx.status,
      validationErrors: err.validation,
    }
    if (env.NODE_ENV !== "jest") {
      ctx.log.error(err)
      console.trace(err)
    }
  }
})

router.get("/health", ctx => (ctx.status = 200))

// authenticated routes
for (let route of mainRoutes) {
  router.use(route.routes())
  router.use(route.allowedMethods())
}

// WARNING - static routes will catch everything else after them this must be last
router.use(staticRoutes.routes())
router.use(staticRoutes.allowedMethods())

// add a redirect for when hitting server directly
router.redirect("/", "/builder")

module.exports = router
