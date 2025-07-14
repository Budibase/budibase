import * as controller from "../controllers/integration"
import { builderGroup } from "./endpointGroups"

builderGroup
  .get("/api/integrations", controller.fetch)
  .get("/api/integrations/:type", controller.find)
