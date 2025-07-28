import * as controller from "../controllers/metadata"
import {
  middleware as appInfoMiddleware,
  AppType,
} from "../../middleware/appInfo"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { endpointGroupList } from "./endpointGroups"

const routes = endpointGroupList.group(
  authorized(permissions.BUILDER),
  appInfoMiddleware({ appType: AppType.DEV })
)

routes
  .post("/api/metadata/:type/:entityId", controller.saveMetadata)
  .delete("/api/metadata/:type/:entityId", controller.deleteMetadata)
  .get("/api/metadata/type", controller.getTypes)
  .get("/api/metadata/:type/:entityId", controller.getMetadata)
