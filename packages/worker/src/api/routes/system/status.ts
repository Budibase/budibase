import * as controller from "../../controllers/system/status"
import { loggedInRoutes } from "../endpointGroups"

loggedInRoutes.get("/api/system/status", controller.fetch)
