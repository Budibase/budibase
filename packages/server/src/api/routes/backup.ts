import * as controller from "../controllers/backup"
import ensureTenantAppOwnership from "../../middleware/ensureTenantAppOwnership"
import { builderGroup } from "./endpointGroups"

builderGroup
  .post(
    "/api/backups/export",
    ensureTenantAppOwnership,
    controller.exportAppDump
  )
  .delete("/api/backups/logs", controller.clearBackupError)
