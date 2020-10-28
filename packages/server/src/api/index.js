const Router = require("@koa/router")
const authenticated = require("../middleware/authenticated")
const compress = require("koa-compress")
const zlib = require("zlib")
const { budibaseAppsDir } = require("../utilities/budibaseDir")
const { isDev } = require("../utilities")
const {
  authRoutes,
  pageRoutes,
  userRoutes,
  deployRoutes,
  instanceRoutes,
  applicationRoutes,
  rowRoutes,
  tableRoutes,
  viewRoutes,
  staticRoutes,
  componentRoutes,
  automationRoutes,
  accesslevelRoutes,
  apiKeysRoutes,
  templatesRoutes,
  analyticsRoutes,
  webhookRoutes,
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

router.use(authRoutes.routes())
router.use(authRoutes.allowedMethods())

// authenticated routes
router.use(viewRoutes.routes())
router.use(viewRoutes.allowedMethods())

router.use(tableRoutes.routes())
router.use(tableRoutes.allowedMethods())

router.use(rowRoutes.routes())
router.use(rowRoutes.allowedMethods())

router.use(userRoutes.routes())
router.use(userRoutes.allowedMethods())

router.use(instanceRoutes.routes())
router.use(instanceRoutes.allowedMethods())

router.use(automationRoutes.routes())
router.use(automationRoutes.allowedMethods())

router.use(webhookRoutes.routes())
router.use(webhookRoutes.allowedMethods())

router.use(deployRoutes.routes())
router.use(deployRoutes.allowedMethods())

router.use(templatesRoutes.routes())
router.use(templatesRoutes.allowedMethods())
// end auth routes

router.use(pageRoutes.routes())
router.use(pageRoutes.allowedMethods())

router.use(applicationRoutes.routes())
router.use(applicationRoutes.allowedMethods())

router.use(componentRoutes.routes())
router.use(componentRoutes.allowedMethods())

router.use(accesslevelRoutes.routes())
router.use(accesslevelRoutes.allowedMethods())

router.use(apiKeysRoutes.routes())
router.use(apiKeysRoutes.allowedMethods())

router.use(analyticsRoutes.routes())
router.use(analyticsRoutes.allowedMethods())

router.use(staticRoutes.routes())
router.use(staticRoutes.allowedMethods())

router.redirect("/", "/_builder")

module.exports = router
