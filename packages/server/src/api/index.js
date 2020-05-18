const Router = require("@koa/router")
const authenticated = require("../middleware/authenticated")
const compress = require("koa-compress")
const zlib = require("zlib")
const { budibaseAppsDir } = require("../utilities/budibaseDir")
const {
  authRoutes,
  pageRoutes,
  userRoutes,
  recordRoutes,
  instanceRoutes,
  clientRoutes,
  applicationRoutes,
  modelRoutes,
  viewRoutes,
  staticRoutes,
  componentRoutes,
} = require("./routes")

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
    }
    ctx.isDev = env.NODE_ENV !== "production" && env.NODE_ENV !== "jest"
    await next()
  })
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

router.use(authRoutes.routes())
router.use(authRoutes.allowedMethods())

// authenticated routes
router.use(viewRoutes.routes())
router.use(viewRoutes.allowedMethods())

router.use(modelRoutes.routes())
router.use(modelRoutes.allowedMethods())

router.use(userRoutes.routes())
router.use(userRoutes.allowedMethods())

router.use(recordRoutes.routes())
router.use(recordRoutes.allowedMethods())

router.use(instanceRoutes.routes())
router.use(instanceRoutes.allowedMethods())
// end auth routes

router.use(pageRoutes.routes())
router.use(pageRoutes.allowedMethods())

router.use(applicationRoutes.routes())
router.use(applicationRoutes.allowedMethods())

router.use(componentRoutes.routes())
router.use(componentRoutes.allowedMethods())

router.use(clientRoutes.routes())
router.use(clientRoutes.allowedMethods())

router.use(staticRoutes.routes())
router.use(staticRoutes.allowedMethods())

router.redirect("/", "/_builder")

module.exports = router
