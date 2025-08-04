import * as rowController from "../controllers/row"
import {
  authorizedMiddleware as authorized,
  authorizedResource,
} from "../../middleware/authorized"
import { paramResource, paramSubResource } from "../../middleware/resourceId"
import { permissions } from "@budibase/backend-core"
import { internalSearchValidator } from "./utils/validators"
import recaptcha from "../../middleware/recaptcha"
import { trimViewRowInfoMiddleware } from "../../middleware/trimViewRowInfo"
import { validateBody } from "../../middleware/zod-validator"
import { searchRowRequestValidator } from "@budibase/types"
import { endpointGroupList, publicRoutes } from "./endpointGroups"

const { PermissionType, PermissionLevel } = permissions

const readRoutes = endpointGroupList.group(
  {
    middleware: authorized(PermissionType.TABLE, PermissionLevel.READ),
    first: false,
  },
  recaptcha
)
const writeRoutes = endpointGroupList.group(
  {
    middleware: authorized(PermissionType.TABLE, PermissionLevel.WRITE),
    first: false,
  },
  recaptcha
)

readRoutes
  .get(
    "/api/:sourceId/:rowId/enrich",
    paramSubResource("sourceId", "rowId"),
    rowController.fetchEnrichedRow
  )
  .get("/api/:sourceId/rows", paramResource("sourceId"), rowController.fetch)
  .get(
    "/api/:sourceId/rows/:rowId",
    paramSubResource("sourceId", "rowId"),
    rowController.find
  )
  .post(
    "/api/:sourceId/search",
    internalSearchValidator(),
    validateBody(searchRowRequestValidator),
    paramResource("sourceId"),
    rowController.search
  )
  // DEPRECATED - this is an old API, but for backwards compat it needs to be
  // supported still
  .post(
    "/api/search/:sourceId/rows",
    paramResource("sourceId"),
    rowController.search
  )
  .get(
    "/api/:sourceId/rows/:rowId/attachment/:columnName",
    paramSubResource("sourceId", "rowId"),
    rowController.downloadAttachment
  )

writeRoutes
  .post(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    trimViewRowInfoMiddleware,
    rowController.save
  )
  .patch(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    trimViewRowInfoMiddleware,
    rowController.patch
  )
  .post(
    "/api/:sourceId/rows/validate",
    paramResource("sourceId"),
    rowController.validate
  )
  .delete(
    "/api/:sourceId/rows",
    paramResource("sourceId"),
    trimViewRowInfoMiddleware,
    rowController.destroy
  )
  .post(
    "/api/:sourceId/rows/exportRows",
    paramResource("sourceId"),
    rowController.exportRows
  )

publicRoutes.post(
  "/api/v2/views/:viewId/search",
  internalSearchValidator(),
  validateBody(searchRowRequestValidator),
  authorizedResource(PermissionType.VIEW, PermissionLevel.READ, "viewId"),
  rowController.views.searchView
)
