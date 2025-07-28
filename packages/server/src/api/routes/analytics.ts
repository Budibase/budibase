import * as controller from "../controllers/analytics"
import { publicRoutes } from "./endpointGroups"

publicRoutes.get("/api/bbtel", controller.isEnabled)
publicRoutes.post("/api/bbtel/ping", controller.ping)
