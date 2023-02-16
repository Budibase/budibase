import { AppBackupTrigger, AppBackupType } from "../../../documents"

export interface SearchAppBackupsRequest {
  trigger: AppBackupTrigger
  type: AppBackupType
  startDate: string
  endDate: string
  page?: string
}

export interface CreateAppBackupRequest {
  name: string
}

export interface CreateAppBackupResponse {
  backupId: string
  message: string
}

export interface UpdateAppBackupRequest {
  name: string
}
