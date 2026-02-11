import * as controller from "../controllers/workspaceHome"
import { builderRoutes } from "./endpointGroups"

builderRoutes.get("/api/workspace/home/metrics", controller.metrics)
