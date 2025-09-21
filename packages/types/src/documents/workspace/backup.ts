import { User } from "../../"
import { Document } from "../document"

export enum BackupType {
  BACKUP = "backup",
  RESTORE = "restore",
}

export enum BackupStatus {
  STARTED = "started",
  PENDING = "pending",
  COMPLETE = "complete",
  FAILED = "failed",
}

export enum BackupTrigger {
  PUBLISH = "publish",
  MANUAL = "manual",
  SCHEDULED = "scheduled",
  RESTORING = "restoring",
}

export interface WorkspaceBackupContents {
  datasources: string[]
  screens: string[]
  automations: string[]
}

export interface WorkspaceBackupMetadata {
  appId: string
  trigger?: BackupTrigger
  type: BackupType
  status: BackupStatus
  name?: string
  createdBy?: string | User
  timestamp: string
  finishedAt?: string
  startedAt?: string
  contents?: WorkspaceBackupContents
}

export interface WorkspaceBackup extends Document, WorkspaceBackupMetadata {
  _id: string
  filename?: string
}

export type BackupFetchOpts = {
  trigger?: BackupTrigger
  type?: BackupType
  limit?: number
  page?: string
  paginate?: boolean
  startDate?: string
  endDate?: string
}

export interface WorkspaceBackupQueueData {
  appId: string
  docId: string
  docRev: string
  export?: {
    trigger: BackupTrigger
    name?: string
    createdBy?: string
  }
  import?: {
    backupId: string
    nameForBackup: string
    createdBy?: string
  }
}

export interface DevRevertQueueData {
  appId: string
  userId?: string
}
