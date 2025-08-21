import * as controller from "../../controllers/global/license"
import { middleware } from "@budibase/backend-core"
import Joi from "joi"
import { loggedInRoutes } from "../endpointGroups"

const activateLicenseKeyValidator = middleware.joiValidator.body(
  Joi.object({
    licenseKey: Joi.string().required(),
  }).required()
)

const activateOfflineLicenseValidator = middleware.joiValidator.body(
  Joi.object({
    offlineLicenseToken: Joi.string().required(),
  }).required()
)

loggedInRoutes
  .post("/api/global/license/refresh", controller.refresh)
  .get("/api/global/license/usage", controller.getQuotaUsage)
  .get("/api/global/install", controller.getInstallInfo)
  // LICENSE KEY
  .post(
    "/api/global/license/key",
    activateLicenseKeyValidator,
    controller.activateLicenseKey
  )
  .get("/api/global/license/key", controller.getLicenseKey)
  .delete("/api/global/license/key", controller.deleteLicenseKey)
  // OFFLINE LICENSE
  .post(
    "/api/global/license/offline",
    activateOfflineLicenseValidator,
    controller.activateOfflineLicenseToken
  )
  .get("/api/global/license/offline", controller.getOfflineLicenseToken)
  .delete("/api/global/license/offline", controller.deleteOfflineLicenseToken)
  .get(
    "/api/global/license/offline/identifier",
    controller.getOfflineLicenseIdentifier
  )
