import { Document } from "../document"

export enum ScheduleType {
  WORKSPACE_BACKUP = "app_backup",
}

export enum ScheduleRepeatPeriod {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export interface Schedule extends Document {
  type: ScheduleType
  name: string
  startDate: string
  repeat: ScheduleRepeatPeriod
  metadata: ScheduleMetadata
}

export type ScheduleMetadata = WorkspaceBackupScheduleMetadata

export interface WorkspaceBackupScheduleMetadata {
  apps: string[]
}
