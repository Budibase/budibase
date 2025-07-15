import * as controller from "../controllers/backup"
import ensureTenantAppOwnership from "../../middleware/ensureTenantAppOwnership"
import { builderRoutes } from "./endpointGroups"

builderRoutes
  .post(
    "/api/backups/export",
    ensureTenantAppOwnership,
    controller.exportAppDump
  )
  .delete("/api/backups/logs", controller.clearBackupError)
