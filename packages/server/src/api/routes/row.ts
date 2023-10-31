import Router from "@koa/router"
import * as rowController from "../controllers/row"
import authorized, { authorizedResource } from "../../middleware/authorized"
import { paramResource, paramSubResource } from "../../middleware/resourceId"
import { permissions } from "@budibase/backend-core"
import { internalSearchValidator } from "./utils/validators"
import trimViewRowInfo from "../../middleware/trimViewRowInfo"

const { PermissionType, PermissionLevel } = permissions

const router: Router = new Router()

router
  .get(
    "/api/:sourceId/:rowId/enrich",
    paramSubResource("sourceId", "rowId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.fetchEnrichedRow
  )
  .get(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.fetch
  )
  .get(
    "/api/:sourceId/rows/:rowId",
    paramSubResource("sourceId", "rowId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.find
  )
  .post(
    "/api/:sourceId/search",
    internalSearchValidator(),
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.search
  )
  // DEPRECATED - this is an old API, but for backwards compat it needs to be
  // supported still
  .post(
    "/api/search/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.READ),
    rowController.search
  )
  .post(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    trimViewRowInfo,
    rowController.save
  )
  .patch(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    trimViewRowInfo,
    rowController.patch
  )
  .post(
    "/api/:sourceId/rows/validate",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    rowController.validate
  )
  .delete(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    trimViewRowInfo,
    rowController.destroy
  )
  .post(
    "/api/:sourceId/rows/exportRows",
    paramResource("sourceId"),
    authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    rowController.exportRows
  )

router.post(
  "/api/v2/views/:viewId/search",
  authorizedResource(PermissionType.VIEW, PermissionLevel.READ, "viewId"),
  rowController.views.searchView
)

export default router
