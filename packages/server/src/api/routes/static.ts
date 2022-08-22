import Router from "@koa/router"
import * as controller from "../controllers/static"
import { budibaseTempDir } from "../../utilities/budibaseDir"
import authorized from "../../middleware/authorized"
import {
  BUILDER,
  PermissionTypes,
  PermissionLevels,
} from "@budibase/backend-core/permissions"
import * as env from "../../environment"
import { paramResource } from "../../middleware/resourceId"

const router = new Router()

/* istanbul ignore next */
router.param("file", async (file: any, ctx: any, next: any) => {
  ctx.file = file && file.includes(".") ? file : "index.html"
  if (!ctx.file.startsWith("budibase-client")) {
    return next()
  }
  // test serves from require
  if (env.isTest()) {
    ctx.devPath = require.resolve("@budibase/client").split(ctx.file)[0]
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
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    controller.uploadFile
  )
  .post(
    "/api/attachments/:tableId/delete",
    paramResource("tableId"),
    authorized(PermissionTypes.TABLE, PermissionLevels.WRITE),
    controller.deleteObjects
  )
  .get("/preview", authorized(BUILDER), controller.serveBuilderPreview)
  .get("/:appId/:path*", controller.serveApp)
  .get("/app/:appUrl/:path*", controller.serveApp)
  .post(
    "/api/attachments/:datasourceId/url",
    authorized(PermissionTypes.TABLE, PermissionLevels.READ),
    controller.getSignedUploadURL
  )

export default router
