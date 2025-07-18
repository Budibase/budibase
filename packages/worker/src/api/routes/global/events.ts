import * as controller from "../../controllers/global/events"
import { loggedInRoutes } from "../endpointGroups"

loggedInRoutes.post("/api/global/event/publish", controller.publish)
