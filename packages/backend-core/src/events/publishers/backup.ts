import {
  AppBackup,
  AppBackupRestoreEvent,
  AppBackupTriggeredEvent,
  Event,
} from "@budibase/types"
import { publishEvent } from "../events"

export async function appBackupRestored(backup: AppBackup) {
  const properties: AppBackupRestoreEvent = {
    appId: backup.appId,
    backupName: backup.name!,
    backupCreatedAt: backup.timestamp,
  }

  await publishEvent(Event.APP_BACKUP_RESTORED, properties)
}

export async function appBackupTriggered(appId: string, name?: string) {
  const properties: AppBackupTriggeredEvent = {
    appId: appId,
    backupName: name,
    backupCreatedAt: new Date().toISOString(),
  }
  await publishEvent(Event.APP_BACKUP_TRIGGERED, properties)
}
