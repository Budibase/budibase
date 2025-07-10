import Router from "@koa/router"
import * as controller from "../controllers/application"
import * as deploymentController from "../controllers/deploy"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { applicationValidator } from "./utils/validators"
import { skipMigrationRedirect } from "../../middleware/appMigrations"
import { EndpointGroup } from "../utils"

const builderGroup = new EndpointGroup()
const creatorGroup = new EndpointGroup()
const clientGroup = new EndpointGroup()

builderGroup.addGroupMiddleware(authorized(permissions.BUILDER))
creatorGroup.addGroupMiddleware(authorized(permissions.CREATOR))

builderGroup
  .post("/api/applications/:appId/sync", controller.sync)
  .put(
    "/api/applications/:appId",
    applicationValidator({ isCreate: false }),
    controller.update
  )
  .post("/api/applications/:appId/client/update", controller.updateClient)
  .post("/api/applications/:appId/client/revert", controller.revertClient)
  .post("/api/applications/:appId/sample", controller.addSampleData)
  .post("/api/applications/:appId/publish", deploymentController.publishApp)
  .post("/api/applications/:appId/unpublish", controller.unpublish)
  .delete("/api/applications/:appId", skipMigrationRedirect, controller.destroy)
  .post("/api/applications/:appId/duplicate", controller.duplicateApp)
  .post("/api/applications/:appId/import", controller.importToApp)

creatorGroup.post(
  "/api/applications",
  applicationValidator(),
  controller.create
)

// Client only endpoints
clientGroup
  .get("/api/client/applications", controller.fetchClientApps)
  .get("/api/applications/:appId/definition", controller.fetchAppDefinition)
  .get("/api/applications", controller.fetch)
  .get("/api/applications/:appId/appPackage", controller.fetchAppPackage)

const router: Router = builderGroup.apply(
  creatorGroup.apply(clientGroup.apply())
)

export default router
