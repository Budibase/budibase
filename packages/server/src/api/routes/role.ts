import * as controller from "../controllers/role"
import { roleValidator } from "./utils/validators"
import { publicGroup, builderGroup } from "./endpointGroups"

// retrieve a list of the roles a user can access
// needs to be public for public screens
publicGroup.get("/api/roles/accessible", controller.accessible)
builderGroup
  .post("/api/roles", roleValidator(), controller.save)
  .get("/api/roles", controller.fetch)
  .get("/api/roles/:roleId", controller.find)
  .delete("/api/roles/:roleId/:rev", controller.destroy)
