import * as controller from "../controllers/features"
import { publicRoutes } from "./endpointGroups"

publicRoutes.patch("/api/features", controller.override)
