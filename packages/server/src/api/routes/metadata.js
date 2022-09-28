const Router = require("@koa/router")
const controller = require("../controllers/metadata")
const {
  middleware: appInfoMiddleware,
  AppType,
} = require("../../middleware/appInfo")
const authorized = require("../../middleware/authorized")
const { BUILDER } = require("@budibase/backend-core/permissions")

const router = new Router()

router
  .post(
    "/api/metadata/:type/:entityId",
    authorized(BUILDER),
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.saveMetadata
  )
  .delete(
    "/api/metadata/:type/:entityId",
    authorized(BUILDER),
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.deleteMetadata
  )
  .get(
    "/api/metadata/type",
    authorized(BUILDER),
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.getTypes
  )
  .get(
    "/api/metadata/:type/:entityId",
    authorized(BUILDER),
    appInfoMiddleware({ appType: AppType.DEV }),
    controller.getMetadata
  )

module.exports = router
