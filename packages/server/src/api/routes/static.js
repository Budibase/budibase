const Router = require("@koa/router")
const controller = require("../controllers/static")
const { budibaseTempDir } = require("../../utilities/budibaseDir")
const env = require("../../environment")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("../../utilities/security/permissions")
const usage = require("../../middleware/usageQuota")

const router = Router()

/* istanbul ignore next */
router.param("file", async (file, ctx, next) => {
  ctx.file = file && file.includes(".") ? file : "index.html"

  // Serving the client library from your local dir in dev
  if (env.isDev() && ctx.file.startsWith("budibase-client")) {
    ctx.devPath = budibaseTempDir()
  }

  await next()
})

router
  // TODO: for now this _builder endpoint is not authorized/secured, will need to be
  .get("/_builder/:file*", controller.serveBuilder)
  .post("/api/attachments/process", authorized(BUILDER), controller.uploadFile)
  .post("/api/attachments/upload", usage, controller.uploadFile)
  .get("/componentlibrary", controller.serveComponentLibrary)
  .get("/assets/:file*", controller.serveAppAsset)
  .get("/attachments/:file*", controller.serveAttachment)
  .get("/:appId/:path*", controller.serveApp)

module.exports = router
