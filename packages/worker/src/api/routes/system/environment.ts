import * as controller from "../../controllers/system/environment"
import { publicNoTenancyRoutes } from "../endpointGroups"

publicNoTenancyRoutes.get("/api/system/environment", controller.fetch)
