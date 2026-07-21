import * as controller from "../../controllers/system/restore"
import { publicNoTenancyRoutes } from "../endpointGroups"

publicNoTenancyRoutes.post("/api/system/restored", controller.systemRestored)
