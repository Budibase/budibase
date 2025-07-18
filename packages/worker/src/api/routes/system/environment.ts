import * as controller from "../../controllers/system/environment"
import { loggedInRoutes } from "../endpointGroups"

loggedInRoutes.get("/api/system/environment", controller.fetch)
