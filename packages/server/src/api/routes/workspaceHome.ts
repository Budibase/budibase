import * as controller from "../controllers/workspaceHome"
import { builderRoutes } from "./endpointGroups"

builderRoutes.get("/api/workspace/home/metrics", controller.metrics)
builderRoutes.get("/api/workspace/home/chats", controller.chats)
