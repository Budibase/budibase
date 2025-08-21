import * as controller from "../controllers/role"
import { roleValidator } from "./utils/validators"
import { publicRoutes, builderRoutes } from "./endpointGroups"

// retrieve a list of the roles a user can access
// needs to be public for public screens
publicRoutes.get("/api/roles/accessible", controller.accessible)
builderRoutes
  .post("/api/roles", roleValidator(), controller.save)
  .get("/api/roles", controller.fetch)
  .get("/api/roles/:roleId", controller.find)
  .delete("/api/roles/:roleId/:rev", controller.destroy)
