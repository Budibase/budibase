import * as controller from "../controllers/backup"
import { ensureTenantAppOwnershipMiddleware } from "../../middleware/ensureTenantAppOwnership"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .post(
    "/api/backups/export",
    ensureTenantAppOwnershipMiddleware,
    controller.exportAppDump
  )
  .delete("/api/backups/logs", controller.clearBackupError)
