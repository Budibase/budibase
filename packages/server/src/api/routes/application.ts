import Router from "@koa/router"
import * as controller from "../controllers/application"
import * as deploymentController from "../controllers/deploy"
import authorized from "../../middleware/authorized"
import { BUILDER } from "@budibase/backend-core/permissions"
import { applicationValidator } from "./utils/validators"

const router = new Router()

router
  .post("/api/applications/:appId/sync", authorized(BUILDER), controller.sync)
  .post(
    "/api/applications",
    authorized(BUILDER),
    applicationValidator(),
    controller.create
  )
  .get("/api/applications/:appId/definition", controller.fetchAppDefinition)
  .get("/api/applications", controller.fetch)
  .get("/api/applications/:appId/appPackage", controller.fetchAppPackage)
  .put(
    "/api/applications/:appId",
    authorized(BUILDER),
    applicationValidator({ isCreate: false }),
    controller.update
  )
  .post(
    "/api/applications/:appId/client/update",
    authorized(BUILDER),
    controller.updateClient
  )
  .post(
    "/api/applications/:appId/client/revert",
    authorized(BUILDER),
    controller.revertClient
  )
  .post(
    "/api/applications/:appId/publish",
    authorized(BUILDER),
    deploymentController.publishApp
  )
  .post(
    "/api/applications/:appId/unpublish",
    authorized(BUILDER),
    controller.unpublish
  )
  .delete("/api/applications/:appId", authorized(BUILDER), controller.destroy)

export default router
