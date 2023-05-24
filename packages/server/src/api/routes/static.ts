import Router from "@koa/router"
import * as controller from "../controllers/static"
import { budibaseTempDir } from "../../utilities/budibaseDir"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import env from "../../environment"
import { paramResource } from "../../middleware/resourceId"
import { devClientLibPath } from "../../utilities/fileSystem"
const { BUILDER, PermissionType, PermissionLevel } = permissions

const router: Router = new Router()

/* istanbul ignore next */
router.param("file", async (file: any, ctx: any, next: any) => {
  ctx.file = file && file.includes(".") ? file : "index.html"
  if (!ctx.file.startsWith("budibase-client")) {
    return next()
  }
  // test serves from require
  if (env.isTest()) {
    const path = devClientLibPath()
    ctx.devPath = path.split(ctx.file)[0]
  } else if (env.isDev()) {
    // Serving the client library from your local dir in dev
    ctx.devPath = budibaseTempDir()
  }
  return next()
})

// only used in development for retrieving the client library,
// in production the client lib is always stored in the object store.
if (env.isDev()) {
  router.get("/api/assets/client", controller.serveClientLibrary)
}

router
  // TODO: for now this builder endpoint is not authorized/secured, will need to be
  .get("/builder/:file*", controller.serveBuilder)
  .post("/api/attachments/process", authorized(BUILDER), controller.uploadFile)
  .post(
    "/api/attachments/delete",
    authorized(BUILDER),
    controller.deleteObjects
  )
  .post("/api/beta/:feature", controller.toggleBetaUiFeature)
  .post(
    "/api/attachments/:tableId/upload",
    paramResource("tableId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    controller.uploadFile
  )
  .post(
    "/api/attachments/:tableId/delete",
    paramResource("tableId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    controller.deleteObjects
  )
  .get("/app/preview", authorized(BUILDER), controller.serveBuilderPreview)
  .get("/:appId/:path*", controller.serveApp)
  .get("/app/:appUrl/:path*", controller.serveApp)
  .post(
    "/api/attachments/:datasourceId/url",
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    controller.getSignedUploadURL
  )

export default router
