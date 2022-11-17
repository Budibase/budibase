import {
  AppBackup,
  AppBackupRestoreEvent,
  AppBackupTriggeredEvent,
  AppBackupTrigger,
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

export async function appBackupTriggered(
  appId: string,
  trigger: AppBackupTrigger,
  name?: string
) {
  const properties: AppBackupTriggeredEvent = {
    appId: appId,
    backupName: name,
    trigger,
  }
  await publishEvent(Event.APP_BACKUP_TRIGGERED, properties)
}
