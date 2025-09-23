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

export const isAppBackupMetadata = (
  type: ScheduleType,
  metadata: ScheduleMetadata
): metadata is WorkspaceBackupScheduleMetadata => {
  return type === ScheduleType.WORKSPACE_BACKUP
}

export interface WorkspaceBackupScheduleMetadata {
  apps: string[]
}
