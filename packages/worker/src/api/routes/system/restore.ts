import * as controller from "../../controllers/system/restore"
import { loggedInRoutes } from "../endpointGroups"

loggedInRoutes.post("/api/system/restored", controller.systemRestored)
