import * as controller from "../../controllers/system/status"
import { publicNoTenancyRoutes } from "../endpointGroups"

publicNoTenancyRoutes.get("/api/system/status", controller.fetch)
