import {
  AppBackup,
  AppBackupRestoreEvent,
  AppBackupTriggeredEvent,
  AppBackupTrigger,
  AppBackupType,
  Event,
} from "@budibase/types"
import { publishEvent } from "../events"

async function appBackupRestored(backup: AppBackup) {
  const properties: AppBackupRestoreEvent = {
    appId: backup.appId,
    restoreId: backup._id!,
    backupCreatedAt: backup.timestamp,
    name: backup.name as string,
  }

  await publishEvent(Event.APP_BACKUP_RESTORED, properties)
}

async function appBackupTriggered(
  appId: string,
  backupId: string,
  type: AppBackupType,
  trigger: AppBackupTrigger,
  name: string
) {
  const properties: AppBackupTriggeredEvent = {
    appId: appId,
    backupId,
    type,
    trigger,
    name,
  }
  await publishEvent(Event.APP_BACKUP_TRIGGERED, properties)
}

export default {
  appBackupRestored,
  appBackupTriggered,
}
