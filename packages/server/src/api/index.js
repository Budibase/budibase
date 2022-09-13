const Router = require("@koa/router")
const {
  buildAuthMiddleware,
  auditLog,
  buildTenancyMiddleware,
} = require("@budibase/backend-core/auth")
const { errors } = require("@budibase/backend-core")
const currentApp = require("../middleware/currentapp")
const compress = require("koa-compress")
const zlib = require("zlib")
const { mainRoutes, staticRoutes, publicRoutes } = require("./routes")
const pkg = require("../../package.json")
const env = require("../environment")
const { middleware: pro } = require("@budibase/pro")
const { shutdown } = require("./routes/public")

const router = new Router()

router.get("/health", ctx => (ctx.status = 200))
router.get("/version", ctx => (ctx.body = pkg.version))

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
  // re-direct before any middlewares occur
  .redirect("/", "/builder")
  .use(
    buildAuthMiddleware(null, {
      publicAllowed: true,
    })
  )
  // nothing in the server should allow query string tenants
  // the server can be public anywhere, so nowhere should throw errors
  // if the tenancy has not been set, it'll have to be discovered at application layer
  .use(
    buildTenancyMiddleware(null, null, {
      noTenancyRequired: true,
    })
  )
  .use(pro.licensing())
  .use(currentApp)
  .use(auditLog)

// error handling middleware
router.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || err.statusCode || 500
    const error = errors.getPublicError(err)
    ctx.body = {
      message: err.message,
      status: ctx.status,
      validationErrors: err.validation,
      error,
    }
    ctx.log.error(err)
    // unauthorised errors don't provide a useful trace
    if (!env.isTest()) {
      console.trace(err)
    }
  }
})

// authenticated routes
for (let route of mainRoutes) {
  router.use(route.routes())
  router.use(route.allowedMethods())
}

router.use(publicRoutes.routes())
router.use(publicRoutes.allowedMethods())

// WARNING - static routes will catch everything else after them this must be last
router.use(staticRoutes.routes())
router.use(staticRoutes.allowedMethods())

module.exports.router = router
module.exports.shutdown = shutdown
