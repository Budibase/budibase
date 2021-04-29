const Router = require("@koa/router")
const controller = require("../controllers/static")
const { budibaseTempDir } = require("../../utilities/budibaseDir")
const authorized = require("../../middleware/authorized")
const {
  BUILDER,
  PermissionTypes,
  PermissionLevels,
} = require("../../utilities/security/permissions")
const usage = require("../../middleware/usageQuota")
const env = require("../../environment")

const router = Router()

/* istanbul ignore next */
router.param("file", async (file, ctx, next) => {
  ctx.file = file && file.includes(".") ? file : "index.html"
  if (!ctx.file.startsWith("budibase-client")) {
    return next()
  }
  // test serves from require
  if (env.isTest()) {
    ctx.devPath = require.resolve("@budibase/client").split(ctx.file)[0]
  } else if (env.isDev()) {
    // Serving the client library from your local dir in dev
    ctx.devPath = budibaseTempDir()
  }
  return next()
})

// only used in development for retrieving the client library,
// in production the client lib is always stored in the object store.
if (env.isDev()) {
  router.get("/api/assets/client", controller.serveClientLibrary)
}

router
  // TODO: for now this builder endpoint is not authorized/secured, will need to be
  .get("/builder/:file*", controller.serveBuilder)
  .post("/api/attachments/process", authorized(BUILDER), controller.uploadFile)
  .post(
    "/api/attachments/upload",
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    usage,
    controller.uploadFile
  )
  .get("/componentlibrary", controller.serveComponentLibrary)
  // TODO: this likely needs to be secured in some way
  .get("/:appId/:path*", controller.serveApp)

module.exports = router
