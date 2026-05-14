import * as controller from "../controllers/automation"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { middleware, permissions } from "@budibase/backend-core"
import { bodyResource, paramResource } from "../../middleware/resourceId"
import {
  middleware as appInfoMiddleware,
  AppType,
} from "../../middleware/appInfo"
import recaptcha from "../../middleware/recaptcha"
import { automationValidator } from "./utils/validators"
import { builderRoutes, endpointGroupList } from "./endpointGroups"
import { EmailTriggerAuthType } from "@budibase/types"
import Joi from "joi"

const optionalString = Joi.string().optional().allow(null).allow("")

const emailTriggerInputsValidator = middleware.joiValidator.body(
  Joi.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
    secure: Joi.boolean().required(),
    username: Joi.string().required(),
    authType: Joi.string()
      .valid(...Object.values(EmailTriggerAuthType))
      .default(EmailTriggerAuthType.PASSWORD),
    password: Joi.when("authType", {
      is: EmailTriggerAuthType.OAUTH2,
      then: optionalString,
      otherwise: Joi.string().required(),
    }),
    oauth2ConfigId: Joi.when("authType", {
      is: EmailTriggerAuthType.OAUTH2,
      then: Joi.string().required(),
      otherwise: optionalString,
    }),
    mailbox: optionalString,
    automationId: optionalString,
  }),
  { allowUnknown: false }
)

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
  .post(
    "/api/automations/email/test-connection",
    appInfoMiddleware({ appType: AppType.DEV }),
    emailTriggerInputsValidator,
    controller.testEmailConnection
  )
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
  .get(
    "/api/automations/:id/test/status",
    appInfoMiddleware({ appType: AppType.DEV }),
    paramResource("id"),
    controller.testStatus
  )
