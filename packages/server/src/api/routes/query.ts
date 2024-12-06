import Router from "@koa/router"
import * as queryController from "../controllers/query"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import {
  bodyResource,
  bodySubResource,
  paramResource,
} from "../../middleware/resourceId"
import {
  generateQueryValidation,
  generateQueryPreviewValidation,
} from "../controllers/query/validation"

const { BUILDER, PermissionType, PermissionLevel } = permissions

const router: Router = new Router()

router
  .get("/api/queries", authorized(BUILDER), queryController.fetch)
  .post(
    "/api/queries",
    bodySubResource("datasourceId", "_id"),
    authorized(BUILDER),
    generateQueryValidation(),
    queryController.save
  )
  .post("/api/queries/import", authorized(BUILDER), queryController.import)
  .post(
    "/api/queries/preview",
    bodyResource("datasourceId"),
    authorized(BUILDER),
    generateQueryPreviewValidation(),
    queryController.preview
  )
  .get(
    "/api/queries/:queryId",
    paramResource("queryId"),
    authorized(PermissionType.QUERY, PermissionLevel.READ),
    queryController.find
  )
  // DEPRECATED - use new query endpoint for future work
  .post(
    "/api/queries/:queryId",
    paramResource("queryId"),
    authorized(PermissionType.QUERY, PermissionLevel.WRITE),
    queryController.executeV1
  )
  .delete(
    "/api/queries/:queryId/:revId",
    paramResource("queryId"),
    authorized(BUILDER),
    queryController.destroy
  )
  .post(
    "/api/v2/queries/:queryId",
    paramResource("queryId"),
    authorized(PermissionType.QUERY, PermissionLevel.WRITE),
    queryController.executeV2
  )

export default router
