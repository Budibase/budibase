import * as controller from "../../controllers/system/tenants"
import { adminRoutes } from "../endpointGroups"

adminRoutes.delete("/api/system/tenants/:tenantId", controller.destroy)
adminRoutes.put("/api/system/tenants/:tenantId/lock", controller.lock)
