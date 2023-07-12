import Router from "@koa/router"
import * as viewController from "../controllers/view"
import * as rowController from "../controllers/row"
import authorized from "../../middleware/authorized"
import { paramResource } from "../../middleware/resourceId"
import { DocumentType, SEPARATOR, permissions } from "@budibase/backend-core"

const router: Router = new Router()

router
  .get(
    "/api/views/v2",
    authorized(permissions.BUILDER),
    viewController.v2.fetch
  )
  .get(
    `/api/views/v2/:tableId`,
    authorized(permissions.BUILDER),
    viewController.v2.findByTable
  )
  .get(
    `/api/views/v2/:tableId/:viewId`,
    authorized(permissions.BUILDER),
    viewController.v2.find
  )
  .post(
    "/api/views/v2",
    authorized(permissions.BUILDER),
    viewController.v2.save
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
