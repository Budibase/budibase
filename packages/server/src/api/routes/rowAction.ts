import Joi from "joi"
import { middleware } from "@budibase/backend-core"
import * as rowActionController from "../controllers/rowAction"
import { triggerRowActionAuthorised } from "../../middleware/triggerRowActionAuthorised"
import recaptcha from "../../middleware/recaptcha"
import { builderRoutes, endpointGroupList } from "./endpointGroups"

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

const routes = endpointGroupList.group(recaptcha)

// CRUD endpoints
builderRoutes
  .get("/api/tables/:tableId/actions", rowActionController.find)
  .post(
    "/api/tables/:tableId/actions",
    rowActionValidator(),
    rowActionController.create
  )
  .delete("/api/tables/:tableId/actions/:actionId", rowActionController.remove)
  .post(
    "/api/tables/:tableId/actions/:actionId/permissions",
    rowActionController.setTablePermission
  )
  .delete(
    "/api/tables/:tableId/actions/:actionId/permissions",
    rowActionController.unsetTablePermission
  )
  .post(
    "/api/tables/:tableId/actions/:actionId/permissions/:viewId",
    rowActionController.setViewPermission
  )
  .delete(
    "/api/tables/:tableId/actions/:actionId/permissions/:viewId",
    rowActionController.unsetViewPermission
  )

// Other endpoints
routes.post(
  "/api/tables/:sourceId/actions/:actionId/trigger",
  rowTriggerValidator(),
  triggerRowActionAuthorised("sourceId", "actionId"),
  rowActionController.run
)
