import Router from "@koa/router"
import * as viewController from "../controllers/view"
import * as rowController from "../controllers/row"
import authorized from "../../middleware/authorized"
import { paramResource } from "../../middleware/resourceId"
import { permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get(
    "/api/views/export",
    authorized(permissions.BUILDER),
    viewController.exportView
  )
  .get(
    "/api/views/:viewName",
    paramResource("viewName"),
    authorized(
      permissions.PermissionType.VIEW,
      permissions.PermissionLevel.READ
    ),
    rowController.fetchView
  )
  .get("/api/views", authorized(permissions.BUILDER), viewController.fetch)
  .delete(
    "/api/views/:viewName",
    paramResource("viewName"),
    authorized(permissions.BUILDER),
    viewController.destroy
  )
  .post("/api/views", authorized(permissions.BUILDER), viewController.save)

export = router
