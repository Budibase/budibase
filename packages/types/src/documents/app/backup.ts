import { Document } from "../document"

export enum AppBackupTrigger {
  PUBLISH = "publish",
  MANUAL = "manual",
  SCHEDULED = "scheduled",
}

export interface AppBackup extends Document {
  trigger: AppBackupTrigger
  name: string
  createdAt: string
  createdBy?: string
  filename: string
  appId: string
  userId?: string
  contents?: {
    datasources: string[]
    screens: string[]
    automations: string[]
  }
}

export type AppBackupFetchOpts = {
  trigger?: AppBackupTrigger
  limit?: number
  page?: string
  paginate?: boolean
  startDate?: string
  endDate?: string
}

export interface AppBackupQueueData {
  trigger: AppBackupTrigger
  createdBy?: string
  name?: string
  appId: string
}

export interface AppBackupMetadata extends AppBackupQueueData {
  createdAt: string
}
