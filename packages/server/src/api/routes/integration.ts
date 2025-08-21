import * as controller from "../controllers/integration"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .get("/api/integrations", controller.fetch)
  .get("/api/integrations/:type", controller.find)
