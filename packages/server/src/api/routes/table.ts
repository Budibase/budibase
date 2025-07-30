import * as tableController from "../controllers/table"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { paramResource, bodyResource } from "../../middleware/resourceId"
import { permissions } from "@budibase/backend-core"
import { tableValidator } from "./utils/validators"
import recaptcha from "../../middleware/recaptcha"
import { builderRoutes, endpointGroupList } from "./endpointGroups"

const { PermissionLevel, PermissionType } = permissions

const routes = endpointGroupList.group(
  {
    middleware: authorized(PermissionType.TABLE, PermissionLevel.READ, {
      schema: true,
    }),
    first: false,
  },
  recaptcha
)

routes.get(
  "/api/tables/:tableId",
  paramResource("tableId"),
  tableController.find
)

builderRoutes
  .get("/api/tables", tableController.fetch)
  .post(
    "/api/tables",
    // allows control over updating a table
    bodyResource("_id"),
    tableValidator(),
    tableController.save
  )
  .post("/api/convert/csvToJson", tableController.csvToJson)
  .post(
    "/api/tables/validateNewTableImport",
    tableController.validateNewTableImport
  )
  .post(
    "/api/tables/validateExistingTableImport",
    tableController.validateExistingTableImport
  )
  .delete(
    "/api/tables/:tableId/:revId",
    paramResource("tableId"),
    tableController.destroy
  )
  .post(
    "/api/tables/:tableId/import",
    paramResource("tableId"),
    tableController.bulkImport
  )

  .post(
    "/api/tables/:tableId/migrate",
    paramResource("tableId"),
    tableController.migrate
  )
  .post(
    "/api/tables/:tableId/duplicate",
    paramResource("tableId"),
    tableController.duplicate
  )
