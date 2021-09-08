const Router = require("@koa/router")
const controller = require("../controllers/metadata")
const {
  middleware: appInfoMiddleware,
  AppType,
} = require("../../middleware/appInfo")

const router = Router()

router
  .post(
    "/api/metadata/:type/:entityId",
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.saveMetadata
  )
  .delete(
    "/api/metadata/:type/:entityId",
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.deleteMetadata
  )
  .get(
    "/api/metadata/type",
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.getTypes
  )
  .get(
    "/api/metadata/:type/:entityId",
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.getMetadata
  )

module.exports = router
