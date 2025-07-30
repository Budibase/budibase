import Router from "@koa/router"
import * as controller from "../controllers/static"
import recaptcha from "../../middleware/recaptcha"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { addFileManagement } from "../utils"
import { paramResource } from "../../middleware/resourceId"

const { BUILDER, PermissionType, PermissionLevel } = permissions

const router: Router = new Router()

addFileManagement(router)

router
  .get("/api/assets/client", controller.serveClientLibrary)
  .get("/api/apps/:appId/manifest.json", controller.servePwaManifest)
  .post("/api/attachments/process", authorized(BUILDER), controller.uploadFile)
  .post("/api/pwa/process-zip", authorized(BUILDER), controller.processPWAZip)
  .post("/api/beta/:feature", controller.toggleBetaUiFeature)
  .post(
    "/api/attachments/:tableId/upload",
    recaptcha,
    paramResource("tableId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    controller.uploadFile
  )
  .get("/app/preview", authorized(BUILDER), controller.serveBuilderPreview)
  .get("/app/service-worker.js", controller.serveServiceWorker)
  .get("/app/:appUrl/:path*", controller.serveApp)
  .get("/:appId/:path*", controller.serveApp)
  .post(
    "/api/attachments/:datasourceId/url",
    recaptcha,
    controller.getSignedUploadURL
  )

export default router
