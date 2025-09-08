import { permissions } from "@budibase/backend-core"
import Router from "@koa/router"
import { devAppIdPath } from "../../constants/paths"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import recaptcha from "../../middleware/recaptcha"
import { paramResource } from "../../middleware/resourceId"
import * as controller from "../controllers/static"
import { addFileManagement } from "../utils"

const { BUILDER, PermissionType, PermissionLevel } = permissions

const router: Router = new Router()

addFileManagement(router)

router
  .get("/apple-touch-icon.png", async ctx => {
    ctx.redirect("/builder/bblogo.png")
  })
  .get("/api/assets/client", controller.serveClientLibrary)
  .get("/api/apps/:appId/manifest.json", controller.servePwaManifest)
  .post("/api/attachments/process", authorized(BUILDER), controller.uploadFile)
  .post("/api/pwa/process-zip", authorized(BUILDER), controller.processPWAZip)
  .post(
    "/api/attachments/:tableId/upload",
    recaptcha,
    paramResource("tableId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    controller.uploadFile
  )
  .get(
    `/app/:appId/preview`,
    authorized(BUILDER),
    controller.serveBuilderPreview
  )
  .get("/app/service-worker.js", controller.serveServiceWorker)
  .get("/app/:appUrl/:path*", controller.serveApp)
  .get(`/${devAppIdPath}/:path*`, controller.serveApp)
  .post(
    "/api/attachments/:datasourceId/url",
    recaptcha,
    controller.getSignedUploadURL
  )

export default router
