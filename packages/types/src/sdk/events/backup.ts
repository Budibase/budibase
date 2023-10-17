import { BaseEvent } from "./event"
import { AppBackupTrigger, AppBackupType } from "../../documents"

export interface AppBackupRestoreEvent extends BaseEvent {
  appId: string
  restoreId: string
  backupCreatedAt: string
  name: string
}

export interface AppBackupTriggeredEvent extends BaseEvent {
  backupId: string
  appId: string
  trigger: AppBackupTrigger
  type: AppBackupType
  name: string
}
