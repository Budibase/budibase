import { Document } from "../document"

export enum AppBackupTrigger {
  PUBLISH = "publish",
  MANUAL = "manual",
  SCHEDULED = "scheduled",
}

export enum AppBackupEventType {
  EXPORT = "export",
  IMPORT = "import",
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
  eventType: AppBackupEventType
  appId: string
  export?: {
    trigger: AppBackupTrigger
    name?: string
    createdBy?: string
  }
  import?: {
    backupId: string
  }
}

export interface AppBackupMetadata {
  appId: string
  trigger: AppBackupTrigger
  name?: string
  createdBy?: string
  createdAt: string
}
