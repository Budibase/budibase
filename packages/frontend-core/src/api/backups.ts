import {
  ClearBackupErrorRequest,
  ClearBackupErrorResponse,
  CreateWorkspaceBackupResponse,
  DeleteWorkspaceBackupsResponse,
  ImportWorkspaceBackupResponse,
  SearchWorkspaceBackupsRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface BackupEndpoints {
  createManualBackup: (appId: string) => Promise<CreateWorkspaceBackupResponse>
  restoreBackup: (
    appId: string,
    backupId: string,
    name?: string
  ) => Promise<ImportWorkspaceBackupResponse>

  // Missing request or response types
  searchBackups: (
    appId: string,
    opts: SearchWorkspaceBackupsRequest
  ) => Promise<any>
  deleteBackup: (
    appId: string,
    backupId: string
  ) => Promise<{ message: string }>
  deleteBackups: (
    appId: string,
    backupIds: string[]
  ) => Promise<DeleteWorkspaceBackupsResponse>
  clearBackupErrors: (
    appId: string,
    backupId?: string
  ) => Promise<ClearBackupErrorResponse>
}

export const buildBackupEndpoints = (API: BaseAPIClient): BackupEndpoints => ({
  createManualBackup: async appId => {
    return await API.post({
      url: `/api/apps/${appId}/backups`,
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
  deleteBackups: async (appId, backupIds) => {
    return await API.delete({
      url: `/api/apps/${appId}/backups`,
      body: { backupIds },
    })
  },
  restoreBackup: async (appId, backupId, name) => {
    return await API.post({
      url: `/api/apps/${appId}/backups/${backupId}/import`,
      // Name is a legacy thing, but unsure if it is needed for restoring.
      // Leaving this in just in case, but not type casting the body here
      // as we won't normally have it, but it's required in the type.
      body: { name },
    })
  },
  clearBackupErrors: async (appId, backupId) => {
    return await API.delete<ClearBackupErrorRequest, ClearBackupErrorResponse>({
      url: "/api/backups/logs",
      body: { appId, backupId },
    })
  },
})
