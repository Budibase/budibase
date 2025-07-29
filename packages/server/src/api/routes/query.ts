import * as queryController from "../controllers/query"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import {
  bodyResource,
  bodySubResource,
  paramResource,
} from "../../middleware/resourceId"
import recaptcha from "../../middleware/recaptcha"
import {
  generateQueryValidation,
  generateQueryPreviewValidation,
} from "../controllers/query/validation"
import { builderRoutes, endpointGroupList } from "./endpointGroups"

const { PermissionType, PermissionLevel } = permissions

const readRoutes = endpointGroupList.group(
  {
    middleware: authorized(PermissionType.QUERY, PermissionLevel.READ),
    first: false,
  },
  recaptcha
)
const writeRoutes = endpointGroupList.group(
  {
    middleware: authorized(PermissionType.QUERY, PermissionLevel.WRITE),
    first: false,
  },
  recaptcha
)

builderRoutes
  .get("/api/queries", queryController.fetch)
  .post(
    "/api/queries",
    bodySubResource("datasourceId", "_id"),
    generateQueryValidation(),
    queryController.save
  )
  .post("/api/queries/import", queryController.import)
  .post(
    "/api/queries/preview",
    bodyResource("datasourceId"),
    generateQueryPreviewValidation(),
    queryController.preview
  )
  .delete(
    "/api/queries/:queryId/:revId",
    paramResource("queryId"),
    queryController.destroy
  )

writeRoutes
  // DEPRECATED - use new query endpoint for future work
  .post(
    "/api/queries/:queryId",
    paramResource("queryId"),
    queryController.executeV1
  )
  .post(
    "/api/v2/queries/:queryId",
    paramResource("queryId"),
    queryController.executeV2
  )

readRoutes.get(
  "/api/queries/:queryId",
  paramResource("queryId"),
  queryController.find
)
