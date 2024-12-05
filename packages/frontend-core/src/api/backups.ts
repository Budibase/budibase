import {
  CreateAppBackupRequest,
  CreateAppBackupResponse,
  ImportAppBackupResponse,
  SearchAppBackupsRequest,
  UpdateAppBackupRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface BackupEndpoints {
  createManualBackup: (
    appId: string,
    name?: string
  ) => Promise<CreateAppBackupResponse>
  restoreBackup: (
    appId: string,
    backupId: string,
    name: string
  ) => Promise<ImportAppBackupResponse>

  // Missing request or response types
  searchBackups: (appId: string, opts: SearchAppBackupsRequest) => Promise<any>
  updateBackup: (appId: string, backupId: string, name: string) => Promise<any>
  deleteBackup: (
    appId: string,
    backupId: string
  ) => Promise<{ message: string }>
}

export const buildBackupEndpoints = (API: BaseAPIClient): BackupEndpoints => ({
  createManualBackup: async (appId, name) => {
    return await API.post<CreateAppBackupRequest, CreateAppBackupResponse>({
      url: `/api/apps/${appId}/backups`,
      body: name
        ? {
            name,
          }
        : undefined,
    })
  },
  searchBackups: async (appId, opts) => {
    return await API.post({
      url: `/api/apps/${appId}/backups/search`,
      body: opts,
    })
  },
  deleteBackup: async (appId, backupId) => {
    return await API.delete({
      url: `/api/apps/${appId}/backups/${backupId}`,
    })
  },
  updateBackup: async (appId, backupId, name) => {
    return await API.patch<UpdateAppBackupRequest, any>({
      url: `/api/apps/${appId}/backups/${backupId}`,
      body: { name },
    })
  },
  restoreBackup: async (appId, backupId, name) => {
    return await API.post({
      url: `/api/apps/${appId}/backups/${backupId}/import`,
      body: { name },
    })
  },
})
