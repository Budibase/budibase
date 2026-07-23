import * as controller from "../../controllers/system/tenants"
import { adminNoTenancyRoutes } from "../endpointGroups"

adminNoTenancyRoutes.delete("/api/system/tenants/:tenantId", controller.destroy)
adminNoTenancyRoutes.put("/api/system/tenants/:tenantId/lock", controller.lock)
adminNoTenancyRoutes.put(
  "/api/system/tenants/:tenantId/activation",
  controller.activation
)
