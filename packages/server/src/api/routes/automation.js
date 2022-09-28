const Router = require("@koa/router")
const controller = require("../controllers/automation")
const authorized = require("../../middleware/authorized")
const {
  BUILDER,
  PermissionLevels,
  PermissionTypes,
} = require("@budibase/backend-core/permissions")
const { bodyResource, paramResource } = require("../../middleware/resourceId")
const {
  middleware: appInfoMiddleware,
  AppType,
} = require("../../middleware/appInfo")
const { automationValidator } = require("./utils/validators")

const router = new Router()

router
  .get(
    "/api/automations/trigger/list",
    authorized(BUILDER),
    controller.getTriggerList
  )
  .get(
    "/api/automations/action/list",
    authorized(BUILDER),
    controller.getActionList
  )
  .get(
    "/api/automations/definitions/list",
    authorized(BUILDER),
    controller.getDefinitionList
  )
  .get("/api/automations", authorized(BUILDER), controller.fetch)
  .get(
    "/api/automations/:id",
    paramResource("id"),
    authorized(BUILDER),
    controller.find
  )
  .put(
    "/api/automations",
    bodyResource("_id"),
    authorized(BUILDER),
    automationValidator(true),
    controller.update
  )
  .post(
    "/api/automations",
    authorized(BUILDER),
    automationValidator(false),
    controller.create
  )
  .post(
    "/api/automations/logs/search",
    authorized(BUILDER),
    controller.logSearch
  )
  .delete(
    "/api/automations/logs",
    authorized(BUILDER),
    controller.clearLogError
  )
  .delete(
    "/api/automations/:id/:rev",
    paramResource("id"),
    authorized(BUILDER),
    controller.destroy
  )
  .post(
    "/api/automations/:id/trigger",
    appInfoMiddleware({ appType: AppType.PROD }),
    paramResource("id"),
    authorized(PermissionTypes.AUTOMATION, PermissionLevels.EXECUTE),
    controller.trigger
  )
  .post(
    "/api/automations/:id/test",
    appInfoMiddleware({ appType: AppType.DEV }),
    paramResource("id"),
    authorized(PermissionTypes.AUTOMATION, PermissionLevels.EXECUTE),
    controller.test
  )

module.exports = router
