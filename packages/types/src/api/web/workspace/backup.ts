import { BackupTrigger, BackupType } from "../../../documents"

export interface SearchWorkspaceBackupsRequest {
  trigger: BackupTrigger
  type: BackupType
  startDate: string
  endDate: string
  page?: string
}

export interface CreateWorkspaceBackupRequest {
  name: string
}

export interface CreateWorkspaceBackupResponse {
  backupId: string
  message: string
}

export interface UpdateWorkspaceBackupRequest {
  name: string
}

export interface ImportWorkspaceBackupRequest {
  name: string
}
export interface ImportWorkspaceBackupResponse {
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

export interface DeleteWorkspaceBackupResult {
  backupId: string
  success: boolean
  error?: string
}

export interface DeleteWorkspaceBackupsRequest {
  backupIds: string[]
}

export interface DeleteWorkspaceBackupsResponse {
  message: string
  results: DeleteWorkspaceBackupResult[]
  successCount: number
  failureCount: number
}
