import { AppBackup, AppBackupRestoreEvent, Event } from "@budibase/types"
import { publishEvent } from "../events"

export async function appBackupRestored(backup: AppBackup) {
  const properties: AppBackupRestoreEvent = {
    appId: backup.appId,
    backupName: backup.name!,
    backupCreatedAt: backup.timestamp,
  }

  await publishEvent(Event.APP_BACKUP_RESTORED, properties)
}
