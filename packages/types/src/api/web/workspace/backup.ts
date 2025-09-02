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

export interface ImportAppBackupResponse {
  restoreId: string
  message: string
}

export interface ClearBackupErrorRequest {
  appId: string
  backupId?: string
}

export interface ClearBackupErrorResponse {
  message: string
}

export interface DeleteAppBackupResult {
  backupId: string
  success: boolean
  error?: string
}

export interface DeleteAppBackupsRequest {
  backupIds: string[]
}

export interface DeleteAppBackupsResponse {
  message: string
  results: DeleteAppBackupResult[]
  successCount: number
  failureCount: number
}
