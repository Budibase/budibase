import * as controller from "../controllers/auth"
import { publicRoutes } from "./endpointGroups"

publicRoutes.get("/api/self", controller.fetchSelf)
