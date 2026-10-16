import * as rowController from "../controllers/row"
import { authorizedResource } from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { internalSearchValidator } from "./utils/validators"
import recaptcha from "../../middleware/recaptcha"
import { trimViewRowInfoMiddleware } from "../../middleware/trimViewRowInfo"
import { endpointGroupList, publicRoutes } from "./endpointGroups"

const { PermissionType, PermissionLevel } = permissions

const readRoutes = endpointGroupList.group(
  {
    middleware: authorizedResource(
      PermissionType.TABLE,
      PermissionLevel.READ,
      "sourceId"
    ),
    first: false,
  },
  recaptcha
)
const writeRoutes = endpointGroupList.group(
  {
    middleware: authorizedResource(
      PermissionType.TABLE,
      PermissionLevel.WRITE,
      "sourceId"
    ),
    first: false,
  },
  recaptcha
)

readRoutes
  .get("/api/:sourceId/:rowId/enrich", rowController.fetchEnrichedRow)
  .get("/api/:sourceId/rows", rowController.fetch)
  .get("/api/:sourceId/rows/:rowId", rowController.find)
  .post(
    "/api/:sourceId/search",
    internalSearchValidator(),
    rowController.search
  )
  // DEPRECATED - this is an old API, but for backwards compat it needs to be
  // supported still
  .post("/api/search/:sourceId/rows", rowController.search)
  .get(
    "/api/:sourceId/rows/:rowId/attachment/:columnName",
    rowController.downloadAttachment
  )

writeRoutes
  .post("/api/:sourceId/rows", trimViewRowInfoMiddleware, rowController.save)
  .patch("/api/:sourceId/rows", trimViewRowInfoMiddleware, rowController.patch)
  .post("/api/:sourceId/rows/validate", rowController.validate)
  .delete(
    "/api/:sourceId/rows",
    trimViewRowInfoMiddleware,
    rowController.destroy
  )
  .post("/api/:sourceId/rows/exportRows", rowController.exportRows)

publicRoutes.post(
  "/api/v2/views/:viewId/search",
  internalSearchValidator(),
  authorizedResource(PermissionType.VIEW, PermissionLevel.READ, "viewId"),
  rowController.views.searchView
)
