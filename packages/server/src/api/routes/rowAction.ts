import Router from "@koa/router"
import Joi from "joi"
import { middleware, permissions } from "@budibase/backend-core"
import * as rowActionController from "../controllers/rowAction"
import authorized, { authorizedResource } from "../../middleware/authorized"

const { PermissionLevel, PermissionType, BUILDER } = permissions

function rowActionValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
    }),
    { allowUnknown: true }
  )
}

function rowTriggerValidator() {
  return middleware.joiValidator.body(
    Joi.object({
      rowId: Joi.string().required(),
    }),
    { allowUnknown: false }
  )
}

const router: Router = new Router()

// CRUD endpoints
router
  .get(
    "/api/tables/:tableId/actions",
    authorized(BUILDER),
    rowActionController.find
  )
  .post(
    "/api/tables/:tableId/actions",
    authorized(BUILDER),
    rowActionValidator(),
    rowActionController.create
  )
  .put(
    "/api/tables/:tableId/actions/:actionId",
    authorized(BUILDER),
    rowActionValidator(),
    rowActionController.update
  )
  .delete(
    "/api/tables/:tableId/actions/:actionId",
    authorized(BUILDER),
    rowActionController.remove
  )
  .post(
    "/api/tables/:tableId/actions/:actionId/permissions/:viewId",
    authorized(BUILDER),
    rowActionController.setViewPermission
  )
  .delete(
    "/api/tables/:tableId/actions/:actionId/permissions/:viewId",
    authorized(BUILDER),
    rowActionController.unsetViewPermission
  )

  // Other endpoints
  .post(
    "/api/tables/:tableId/actions/:actionId/trigger",
    rowTriggerValidator(),
    authorizedResource(PermissionType.TABLE, PermissionLevel.READ, "tableId"),
    rowActionController.run
  )

export default router
