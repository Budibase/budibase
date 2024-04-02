import Router from "@koa/router"
import * as tableController from "../controllers/table"
import authorized from "../../middleware/authorized"
import { paramResource, bodyResource } from "../../middleware/resourceId"
import { permissions } from "@budibase/backend-core"
import { tableValidator } from "./utils/validators"

const { BUILDER, PermissionLevel, PermissionType } = permissions

const router: Router = new Router()

router
  .get("/api/tables", authorized(BUILDER), tableController.fetch)
  .get(
    "/api/tables/:tableId",
    paramResource("tableId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ, { schema: true }),
    tableController.find
  )
  .post(
    "/api/tables",
    // allows control over updating a table
    bodyResource("_id"),
    authorized(BUILDER),
    tableValidator(),
    tableController.save
  )
  .post(
    "/api/convert/csvToJson",
    authorized(BUILDER),
    tableController.csvToJson
  )
  .post(
    "/api/tables/validateNewTableImport",
    authorized(BUILDER),
    tableController.validateNewTableImport
  )
  .post(
    "/api/tables/validateExistingTableImport",
    authorized(BUILDER),
    tableController.validateExistingTableImport
  )
  .delete(
    "/api/tables/:tableId/:revId",
    paramResource("tableId"),
    authorized(BUILDER),
    tableController.destroy
  )
  .post(
    "/api/tables/:tableId/import",
    paramResource("tableId"),
    authorized(BUILDER),
    tableController.bulkImport
  )

  .post(
    "/api/tables/:tableId/migrate",
    paramResource("tableId"),
    authorized(BUILDER),
    tableController.migrate
  )

export default router
