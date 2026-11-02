import sdk from "../../sdk"
import { resourceNameValidator } from "./utils/validators"
import * as viewController from "../controllers/view"
import * as rowController from "../controllers/row"
import recaptcha from "../../middleware/recaptcha"
import {
  authorizedMiddleware as authorized,
  authorizedResource,
} from "../../middleware/authorized"
import { paramResource } from "../../middleware/resourceId"
import { permissions } from "@budibase/backend-core"
import { builderRoutes, publicRoutes } from "./endpointGroups"

publicRoutes.get(
  "/api/v2/views/:viewId",
  recaptcha,
  authorizedResource(
    permissions.PermissionType.VIEW,
    permissions.PermissionLevel.READ,
    "viewId"
  ),
  viewController.v2.get
)
publicRoutes.get(
  "/api/views/:viewName",
  recaptcha,
  paramResource("viewName"),
  authorized(
    permissions.PermissionType.TABLE,
    permissions.PermissionLevel.READ
  ),
  rowController.fetchLegacyView
)

builderRoutes
  .get("/api/v2/views", viewController.v2.fetch)
  .post(
    "/api/v2/views",
    resourceNameValidator({ isCreate: true }),
    viewController.v2.create
  )
  .put(
    `/api/v2/views/:viewId`,
    resourceNameValidator({
      getExistingName: async ctx =>
        (await sdk.views.get(ctx.params.viewId)).name,
    }),
    viewController.v2.update
  )
  .delete(`/api/v2/views/:viewId`, viewController.v2.remove)
  .get("/api/views/export", viewController.v1.exportView)
  .get("/api/views", viewController.v1.fetch)
  .delete(
    "/api/views/:viewName",
    paramResource("viewName"),
    viewController.v1.destroy
  )
  .post(
    "/api/views",
    resourceNameValidator({
      getExistingName: async ctx => {
        const { tableId, originalName } = ctx.request.body
        if (!tableId || !originalName) return undefined
        return (await sdk.tables.getTable(tableId)).views?.[originalName]?.name
      },
    }),
    viewController.v1.save
  )
