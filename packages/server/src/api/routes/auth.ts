import * as controller from "../controllers/auth"
import { publicGroup } from "./endpointGroups"

publicGroup.get("/api/self", controller.fetchSelf)
