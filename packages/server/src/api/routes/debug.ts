import * as controller from "../controllers/debug"
import { builderRoutes } from "./endpointGroups"

builderRoutes.get("/api/debug/diagnostics", controller.systemDebugInfo)
