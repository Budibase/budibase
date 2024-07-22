import Router from "@koa/router"
import * as rowActionController from "../controllers/rowAction"
import { authorizedResource } from "../../middleware/authorized"

import { middleware, permissions } from "@budibase/backend-core"
import Joi from "joi"

const { PermissionLevel, PermissionType } = permissions

export function rowActionValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
    }),
    { allowUnknown: true }
  )
}

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
    rowActionValidator(),
    rowActionController.create
  )
  .put(
    "/api/tables/:tableId/actions/:actionId",
    authorizedResource(PermissionType.TABLE, PermissionLevel.READ, "tableId"),
    rowActionValidator(),
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
