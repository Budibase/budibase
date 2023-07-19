import Router from "@koa/router"
import * as viewController from "../controllers/view"
import * as rowController from "../controllers/row"
import authorized from "../../middleware/authorized"
import { paramResource } from "../../middleware/resourceId"
import { DocumentType, SEPARATOR, permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get(
    `/api/v2/views/:viewId`,
    authorized(permissions.BUILDER),
    viewController.v2.find
  )
  .post(
    "/api/v2/views/:tableId",
    authorized(permissions.BUILDER),
    viewController.v2.create
  )
  .delete(
    `/api/v2/views/:tableId/:viewId`,
    authorized(permissions.BUILDER),
    viewController.v2.remove
  )

router
  .get(
    "/api/views/export",
    authorized(permissions.BUILDER),
    viewController.v1.exportView
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
  .get("/api/views", authorized(permissions.BUILDER), viewController.v1.fetch)
  .delete(
    "/api/views/:viewName",
    paramResource("viewName"),
    authorized(permissions.BUILDER),
    viewController.v1.destroy
  )
  .post("/api/views", authorized(permissions.BUILDER), viewController.v1.save)

export default router
