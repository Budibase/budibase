import Router from "@koa/router"
import * as controller from "../controllers/application"
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
    authorized(permissions.BUILDER),
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
  .delete(
    "/api/applications/:appId",
    authorized(permissions.BUILDER),
    controller.destroy
  )

export = router
