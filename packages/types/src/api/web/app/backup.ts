import { AppBackupTrigger } from "../../../documents"

export interface SearchAppBackupsRequest {
  trigger: AppBackupTrigger
  startDate: string
  endDate: string
}

export interface CreateAppBackupRequest {
  name: string
}

export interface UpdateAppBackupRequest {
  name: string
}
