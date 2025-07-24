import * as controller from "../../controllers/system/accounts"
import { internalRoutes } from "../endpointGroups"

internalRoutes
  .put("/api/system/accounts/:accountId/metadata", controller.save)
  .delete("/api/system/accounts/:accountId/metadata", controller.destroy)
