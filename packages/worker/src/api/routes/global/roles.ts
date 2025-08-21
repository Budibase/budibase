import * as controller from "../../controllers/global/roles"
import { builderOrAdminRoutes } from "../endpointGroups"

builderOrAdminRoutes
  .get("/api/global/roles", controller.fetch)
  .get("/api/global/roles/:appId", controller.find)
  .delete("/api/global/roles/:appId", controller.removeAppRole)
