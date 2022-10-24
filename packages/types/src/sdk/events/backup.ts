import { BaseEvent } from "./event"

export interface AppBackupRestoreEvent extends BaseEvent {
  appId: string
  backupName: string
  backupCreatedAt: string
}
