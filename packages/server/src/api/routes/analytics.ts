import * as controller from "../controllers/analytics"
import { publicGroup } from "./endpointGroups"

publicGroup.get("/api/bbtel", controller.isEnabled)
publicGroup.post("/api/bbtel/ping", controller.ping)
