import Router from "@koa/router"
import * as rowActionController from "../controllers/rowAction"
import { authorizedResource } from "../../middleware/authorized"

import { permissions } from "@budibase/backend-core"

const { PermissionLevel, PermissionType } = permissions

const router: Router = new Router()

// CRUD endpoints
router
  .get(
    "/api/tables/:tableId/actions",
    authorizedResource(PermissionType.TABLE, PermissionLevel.READ, "tableId"),
    rowActionController.find
  )
  .post(
    "/api/tables/:tableId/actions",
    authorizedResource(PermissionType.TABLE, PermissionLevel.READ, "tableId"),
    rowActionController.create
  )
  .put(
    "/api/tables/:tableId/actions/:actionId",
    authorizedResource(PermissionType.TABLE, PermissionLevel.READ, "tableId"),
    rowActionController.update
  )
  .delete(
    "/api/tables/:tableId/actions/:actionId",
    authorizedResource(PermissionType.TABLE, PermissionLevel.READ, "tableId"),
    rowActionController.remove
  )

  // Other endpoints
  .post(
    "/api/tables/:tableId/actions/:actionId/run",
    authorizedResource(PermissionType.TABLE, PermissionLevel.READ, "tableId"),
    rowActionController.run
  )

export default router
