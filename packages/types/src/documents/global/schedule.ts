import { Document } from "../document"

export enum ScheduleType {
  APP_BACKUP = "app_backup",
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

export type ScheduleMetadata = AppBackupScheduleMetadata

export const isAppBackupMetadata = (
  type: ScheduleType,
  metadata: ScheduleMetadata
): metadata is AppBackupScheduleMetadata => {
  return type === ScheduleType.APP_BACKUP
}

export interface AppBackupScheduleMetadata {
  apps: string[]
}
