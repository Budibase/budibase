import Router from "@koa/router"
import Joi from "joi"
import { auth } from "@budibase/backend-core"
import { BackupTrigger, BackupType } from "@budibase/types"
import * as backups from "../../controllers/apps/backups"

const router: Router = new Router()

function validateBackupSearch() {
  return auth.joiValidator.body(
    Joi.object({
      trigger: Joi.string().valid(...Object.values(BackupTrigger)),
      type: Joi.string().valid(...Object.values(BackupType)),
      startDate: Joi.date(),
      endDate: Joi.date(),
      page: Joi.string(),
    })
  )
}

router
  .post("/api/apps/:appId/backups", auth.builderOrAdmin, backups.manualBackup)
  .post(
    "/api/apps/:appId/backups/search",
    auth.builderOrAdmin,
    validateBackupSearch(),
    backups.fetchBackups
  )
  .get(
    "/api/apps/:appId/backups/:backupId/file",
    auth.builderOrAdmin,
    backups.downloadBackup
  )
  .patch(
    "/api/apps/:appId/backups/:backupId",
    auth.builderOrAdmin,
    backups.updateBackup
  )
  .delete(
    "/api/apps/:appId/backups/:backupId",
    auth.builderOrAdmin,
    backups.deleteBackup
  )
  .delete(
    "/api/apps/:appId/backups",
    auth.builderOrAdmin,
    backups.deleteBackups
  )
  .post(
    "/api/apps/:appId/backups/:backupId/import",
    auth.builderOrAdmin,
    backups.importBackup
  )

export default router
