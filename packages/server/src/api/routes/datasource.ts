import Router from "@koa/router"
import * as datasourceController from "../controllers/datasource"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import {
  datasourceValidator,
  datasourceQueryValidator,
} from "./utils/validators"

const router: Router = new Router()

router
  .get(
    "/api/datasources",
    authorized(permissions.BUILDER),
    datasourceController.fetch
  )
  .get(
    "/api/datasources/:datasourceId",
    authorized(
      permissions.PermissionType.TABLE,
      permissions.PermissionLevel.READ
    ),
    datasourceController.find
  )
  .put(
    "/api/datasources/:datasourceId",
    authorized(
      permissions.PermissionType.TABLE,
      permissions.PermissionLevel.READ
    ),
    datasourceController.update
  )
  .post(
    "/api/datasources/query",
    authorized(
      permissions.PermissionType.TABLE,
      permissions.PermissionLevel.READ
    ),
    datasourceQueryValidator(),
    datasourceController.query
  )
  .post(
    "/api/datasources/:datasourceId/schema",
    authorized(permissions.BUILDER),
    datasourceController.buildSchemaFromDb
  )
  .post(
    "/api/datasources",
    authorized(permissions.BUILDER),
    datasourceValidator(),
    datasourceController.save
  )
  .delete(
    "/api/datasources/:datasourceId/:revId",
    authorized(permissions.BUILDER),
    datasourceController.destroy
  )

export = router
