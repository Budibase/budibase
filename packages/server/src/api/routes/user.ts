import * as controller from "../controllers/user"
import { authorizedMiddleware as authorized } from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import recaptcha from "../../middleware/recaptcha"
import { endpointGroupList } from "./endpointGroups"

const { PermissionType, PermissionLevel } = permissions

const readRoutes = endpointGroupList.group(
  {
    middleware: authorized(PermissionType.USER, PermissionLevel.READ),
    first: false,
  },
  recaptcha
)
const writeRoutes = endpointGroupList.group(
  {
    middleware: authorized(PermissionType.USER, PermissionLevel.WRITE),
    first: false,
  },
  recaptcha
)

readRoutes
  .get("/api/users/metadata", controller.fetchMetadata)
  .get("/api/users/metadata/:id", controller.findMetadata)
  .get("/api/users/flags", controller.getFlags)
writeRoutes
  .put("/api/users/metadata", controller.updateMetadata)
  .post("/api/users/metadata/self", controller.updateSelfMetadata)
  .delete("/api/users/metadata/:id", controller.destroyMetadata)
  .post("/api/users/flags", controller.setFlag)
