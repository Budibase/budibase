import { BaseEvent } from "./event"

export interface AppBackupRevertEvent extends BaseEvent {
  appId: string
  backupName: string
  backupCreatedAt: string
}
