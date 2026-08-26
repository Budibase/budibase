import * as controller from "../controllers/features"
import { debugUIEnabled } from "../../middleware/debugUIEnabled"
import { publicRoutes } from "./endpointGroups"

publicRoutes.patch("/api/features", debugUIEnabled, controller.override)
