import Router from "@koa/router"
import * as controller from "../controllers/automation"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { bodyResource, paramResource } from "../../middleware/resourceId"
import {
  middleware as appInfoMiddleware,
  AppType,
} from "../../middleware/appInfo"
import { automationValidator } from "./utils/validators"

const router: Router = new Router()

router
  .get(
    "/api/automations/trigger/list",
    authorized(permissions.BUILDER),
    controller.getTriggerList
  )
  .get(
    "/api/automations/action/list",
    authorized(permissions.BUILDER),
    controller.getActionList
  )
  .get(
    "/api/automations/definitions/list",
    authorized(permissions.BUILDER),
    controller.getDefinitionList
  )
  .get("/api/automations", authorized(permissions.BUILDER), controller.fetch)
  .get(
    "/api/automations/:id",
    paramResource("id"),
    authorized(permissions.BUILDER),
    controller.find
  )
  .put(
    "/api/automations",
    bodyResource("_id"),
    authorized(permissions.BUILDER),
    automationValidator(false),
    controller.update
  )
  .post(
    "/api/automations",
    authorized(permissions.BUILDER),
    automationValidator(false),
    controller.create
  )
  .post(
    "/api/automations/logs/search",
    authorized(permissions.BUILDER),
    controller.logSearch
  )
  .delete(
    "/api/automations/logs",
    authorized(permissions.BUILDER),
    controller.clearLogError
  )
  .delete(
    "/api/automations/:id/:rev",
    paramResource("id"),
    authorized(permissions.BUILDER),
    controller.destroy
  )
  .post(
    "/api/automations/:id/trigger",
    paramResource("id"),
    authorized(
      permissions.PermissionType.AUTOMATION,
      permissions.PermissionLevel.EXECUTE
    ),
    controller.trigger
  )
  .post(
    "/api/automations/:id/test",
    appInfoMiddleware({ appType: AppType.DEV }),
    paramResource("id"),
    authorized(
      permissions.PermissionType.AUTOMATION,
      permissions.PermissionLevel.EXECUTE
    ),
    controller.test
  )

export default router
