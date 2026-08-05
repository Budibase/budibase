import * as controller from "../../controllers/system/accounts"
import { internalNoTenancyRoutes } from "../endpointGroups"

internalNoTenancyRoutes
  .put("/api/system/accounts/:accountId/metadata", controller.save)
  .delete("/api/system/accounts/:accountId/metadata", controller.destroy)
