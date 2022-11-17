import {
  AppBackup,
  AppBackupRestoreEvent,
  AppBackupTriggeredEvent,
  AppBackupTrigger,
  AppBackupType,
  Event,
} from "@budibase/types"
import { publishEvent } from "../events"

export async function appBackupRestored(backup: AppBackup) {
  const properties: AppBackupRestoreEvent = {
    appId: backup.appId,
    backupCreatedAt: backup.timestamp,
  }

  await publishEvent(Event.APP_BACKUP_RESTORED, properties)
}

export async function appBackupTriggered(
  appId: string,
  type: AppBackupType,
  trigger: AppBackupTrigger
) {
  const properties: AppBackupTriggeredEvent = {
    appId: appId,
    type,
    trigger,
  }
  await publishEvent(Event.APP_BACKUP_TRIGGERED, properties)
}
