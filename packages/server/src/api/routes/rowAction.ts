import Router from "@koa/router"
import Joi from "joi"
import { middleware, permissions } from "@budibase/backend-core"
import * as rowActionController from "../controllers/rowAction"
import authorized from "../../middleware/authorized"
import { triggerRowActionAuthorised } from "../../middleware/triggerRowActionAuthorised"

const { BUILDER } = permissions

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
  .delete(
    "/api/tables/:tableId/actions/:actionId",
    authorized(BUILDER),
    rowActionController.remove
  )
  .post(
    "/api/tables/:tableId/actions/:actionId/permissions",
    authorized(BUILDER),
    rowActionController.setTablePermission
  )
  .delete(
    "/api/tables/:tableId/actions/:actionId/permissions",
    authorized(BUILDER),
    rowActionController.unsetTablePermission
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
    "/api/tables/:sourceId/actions/:actionId/trigger",
    rowTriggerValidator(),
    triggerRowActionAuthorised("sourceId", "actionId"),
    rowActionController.run
  )

export default router
