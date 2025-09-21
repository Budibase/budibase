import { skipMigrationRedirect } from "../../middleware/workspaceMigrations"
import * as deploymentController from "../controllers/deploy"
import * as controller from "../controllers/workspace"
import { builderRoutes, creatorRoutes, publicRoutes } from "./endpointGroups"
import { applicationValidator } from "./utils/validators"

builderRoutes
  .post("/api/applications/:appId/sync", controller.sync)
  .get("/api/applications/:appId", controller.find)
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

creatorRoutes.post(
  "/api/applications",
  applicationValidator(),
  controller.create
)

// Client only endpoints
publicRoutes
  .get("/api/client/applications", controller.fetchClientApps)
  .get("/api/applications/:appId/definition", controller.fetchAppDefinition)
  .get("/api/applications", controller.fetch)
  .get("/api/applications/:appId/appPackage", controller.fetchAppPackage)
