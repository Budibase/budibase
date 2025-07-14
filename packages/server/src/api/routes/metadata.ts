import * as controller from "../controllers/metadata"
import {
  middleware as appInfoMiddleware,
  AppType,
} from "../../middleware/appInfo"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { customEndpointGroups } from "./endpointGroups"

const group = customEndpointGroups.group()
group.addGroupMiddleware(authorized(permissions.BUILDER))
group.addGroupMiddleware(appInfoMiddleware({ appType: AppType.DEV }))

group
  .post("/api/metadata/:type/:entityId", controller.saveMetadata)
  .delete("/api/metadata/:type/:entityId", controller.deleteMetadata)
  .get("/api/metadata/type", controller.getTypes)
  .get("/api/metadata/:type/:entityId", controller.getMetadata)
