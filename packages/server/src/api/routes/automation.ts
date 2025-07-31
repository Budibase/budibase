import * as controller from "../controllers/automation"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { bodyResource, paramResource } from "../../middleware/resourceId"
import {
  middleware as appInfoMiddleware,
  AppType,
} from "../../middleware/appInfo"
import recaptcha from "../../middleware/recaptcha"
import { automationValidator } from "./utils/validators"
import { builderRoutes, endpointGroupList } from "./endpointGroups"

const authorizedRoutes = endpointGroupList.group(
  {
    middleware: authorized(
      permissions.PermissionType.AUTOMATION,
      permissions.PermissionLevel.EXECUTE
    ),
    first: false,
  },
  recaptcha
)

builderRoutes
  .get("/api/automations/trigger/list", controller.getTriggerList)
  .get("/api/automations/action/list", controller.getActionList)
  .get("/api/automations/definitions/list", controller.getDefinitionList)
  .get("/api/automations", controller.fetch)
  .get("/api/automations/:id", paramResource("id"), controller.find)
  .put(
    "/api/automations",
    bodyResource("_id"),
    automationValidator(false),
    controller.update
  )
  .post("/api/automations", automationValidator(false), controller.create)
  .post("/api/automations/logs/search", controller.logSearch)
  .delete("/api/automations/logs", controller.clearLogError)
  .delete("/api/automations/:id/:rev", paramResource("id"), controller.destroy)

authorizedRoutes
  .post("/api/automations/:id/trigger", paramResource("id"), controller.trigger)
  .post(
    "/api/automations/:id/test",
    appInfoMiddleware({ appType: AppType.DEV }),
    paramResource("id"),
    controller.test
  )
