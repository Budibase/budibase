import { BaseEvent } from "./event"
import { AppBackupTrigger, AppBackupType } from "../../documents"

export interface AppBackupRestoreEvent extends BaseEvent {
  appId: string
  backupCreatedAt: string
}

export interface AppBackupTriggeredEvent extends BaseEvent {
  appId: string
  trigger: AppBackupTrigger
  type: AppBackupType
}
