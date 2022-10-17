import { AppBackup, AppBackupRevertEvent, Event } from "@budibase/types"
import { publishEvent } from "../events"

export async function appBackupRestored(backup: AppBackup) {
  const properties: AppBackupRevertEvent = {
    appId: backup.appId,
    backupName: backup.name,
    backupCreatedAt: backup.createdAt,
  }

  await publishEvent(Event.APP_BACKUP_RESTORED, properties)
}
