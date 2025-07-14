import * as controller from "../controllers/user"
import authorized from "../../middleware/authorized"
import { permissions } from "@budibase/backend-core"
import { customEndpointGroups } from "./endpointGroups"

const { PermissionType, PermissionLevel } = permissions

const readGroup = customEndpointGroups.group({
  middleware: authorized(PermissionType.USER, PermissionLevel.READ),
  start: false,
})
const writeGroup = customEndpointGroups.group({
  middleware: authorized(PermissionType.USER, PermissionLevel.WRITE),
  start: false,
})

readGroup
  .get("/api/users/metadata", controller.fetchMetadata)
  .get("/api/users/metadata/:id", controller.findMetadata)
  .get("/api/users/flags", controller.getFlags)
writeGroup
  .put("/api/users/metadata", controller.updateMetadata)
  .post("/api/users/metadata/self", controller.updateSelfMetadata)
  .delete("/api/users/metadata/:id", controller.destroyMetadata)
  .post("/api/users/flags", controller.setFlag)
