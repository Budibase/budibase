import * as controller from "../controllers/resource"
import { builderRoutes } from "./endpointGroups"

builderRoutes.post("/api/resources/usage", controller.searchForResourceUsage)
