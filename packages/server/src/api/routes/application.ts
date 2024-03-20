import Router from "@koa/router"
import * as controller from "../controllers/application"
import * as deploymentController from "../controllers/deploy"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { applicationValidator } from "./utils/validators"

const router: Router = new Router()

router
  .post(
    "/api/applications/:appId/sync",
    authorized(permissions.BUILDER),
    controller.sync
  )
  .post(
    "/api/applications",
    authorized(permissions.CREATOR),
    applicationValidator(),
    controller.create
  )
  .get("/api/applications/:appId/definition", controller.fetchAppDefinition)
  .get("/api/applications", controller.fetch)
  .get("/api/applications/:appId/appPackage", controller.fetchAppPackage)
  .put(
    "/api/applications/:appId",
    authorized(permissions.BUILDER),
    applicationValidator({ isCreate: false }),
    controller.update
  )
  .post(
    "/api/applications/:appId/client/update",
    authorized(permissions.BUILDER),
    controller.updateClient
  )
  .post(
    "/api/applications/:appId/client/revert",
    authorized(permissions.BUILDER),
    controller.revertClient
  )
  .post(
    "/api/applications/:appId/sample",
    authorized(permissions.BUILDER),
    controller.addSampleData
  )
  .post(
    "/api/applications/:appId/publish",
    authorized(permissions.BUILDER),
    deploymentController.publishApp
  )
  .post(
    "/api/applications/:appId/unpublish",
    authorized(permissions.BUILDER),
    controller.unpublish
  )
  .delete(
    "/api/applications/:appId",
    authorized(permissions.BUILDER),
    controller.destroy
  )
  .post(
    "/api/applications/:appId/duplicate",
    authorized(permissions.BUILDER),
    controller.duplicateApp
  )
  .post(
    "/api/applications/:appId/import",
    authorized(permissions.BUILDER),
    controller.importToApp
  )
  .post(
    "/api/applications/:appId/setRevertableVersion",
    authorized(permissions.BUILDER),
    controller.setRevertableVersion
  )

export default router
