import { BaseEvent } from "./event"
import { AppBackupTrigger } from "../../documents/app"

export interface AppBackupRestoreEvent extends BaseEvent {
  appId: string
  backupName: string
  backupCreatedAt: string
}

export interface AppBackupTriggeredEvent extends BaseEvent {
  appId: string
  trigger: AppBackupTrigger
  backupName?: string
}
