import { Document } from "../document"

export enum AppBackupTrigger {
  PUBLISH = "publish",
  MANUAL = "manual",
  SCHEDULED = "scheduled",
}

export interface AppBackupContents {
  datasources: string[]
  screens: string[]
  automations: string[]
}

export interface AppBackup extends Document {
  trigger: AppBackupTrigger
  name: string
  date: string
  userId: string
  contents: AppBackupContents
}
