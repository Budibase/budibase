import { BackupTrigger, BackupType } from "../../documents"
import { BaseEvent } from "./event"

export interface WorkspaceBackupRestoreEvent extends BaseEvent {
  appId: string
  restoreId: string
  backupCreatedAt: string
  name: string
}

export interface WorkspaceBackupTriggeredEvent extends BaseEvent {
  backupId: string
  appId: string
  trigger: BackupTrigger
  type: BackupType
  name: string
}
