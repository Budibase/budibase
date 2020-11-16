const Router = require("@koa/router")
const authenticated = require("../middleware/authenticated")
const compress = require("koa-compress")
const zlib = require("zlib")
const { budibaseAppsDir } = require("../utilities/budibaseDir")
const { isDev } = require("../utilities")
const {mainRoutes, authRoutes, staticRoutes} = require("./routes")

const router = new Router()
const env = require("../environment")

router
  .use(
    compress({
      threshold: 2048,
      gzip: {
        flush: zlib.Z_SYNC_FLUSH,
      },
      deflate: {
        flush: zlib.Z_SYNC_FLUSH,
      },
      br: false,
    })
  )
  .use(async (ctx, next) => {
    ctx.config = {
      latestPackagesFolder: budibaseAppsDir(),
      jwtSecret: env.JWT_SECRET,
      useAppRootPath: true,
    }
    ctx.isDev = isDev()
    await next()
  })
  .use("/health", ctx => (ctx.status = 200))
  .use(authenticated)

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

router.use(authRoutes.routes())
router.use(authRoutes.allowedMethods())

// authenticated routes
for (let route of mainRoutes) {
  router.use(route.routes())
  router.use(route.allowedMethods())
}

// WARNING - static routes will catch everything else after them this must be last
router.use(staticRoutes.routes())
router.use(staticRoutes.allowedMethods())

router.redirect("/", "/_builder")

module.exports = router
