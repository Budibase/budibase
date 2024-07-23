import Router from "@koa/router"
import Joi from "joi"
import { middleware, permissions } from "@budibase/backend-core"
import * as rowActionController from "../controllers/rowAction"
import { authorizedResource } from "../../middleware/authorized"

import {
  middleware as appInfoMiddleware,
  AppType,
} from "../../middleware/appInfo"

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
    "/api/tables/:tableId/actions/:actionId/trigger",
    appInfoMiddleware({ appType: AppType.PROD }),
    authorizedResource(PermissionType.TABLE, PermissionLevel.READ, "tableId"),
    rowActionController.run
  )

export default router
