import * as controller from "../../controllers/system/logs"
import { adminNoTenancyRoutes } from "../endpointGroups"
import env from "../../../environment"

if (env.SELF_HOSTED) {
  adminNoTenancyRoutes.get("/api/system/logs", controller.getLogs)
}
