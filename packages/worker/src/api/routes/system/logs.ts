import * as controller from "../../controllers/system/logs"
import { adminRoutes } from "../endpointGroups"
import env from "../../../environment"

if (env.SELF_HOSTED) {
  adminRoutes.get("/api/system/logs", controller.getLogs)
}
