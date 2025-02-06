import {
  CreateAppBackupResponse,
  ImportAppBackupResponse,
  SearchAppBackupsRequest,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface BackupEndpoints {
  createManualBackup: (appId: string) => Promise<CreateAppBackupResponse>
  restoreBackup: (
    appId: string,
    backupId: string,
    name?: string
  ) => Promise<ImportAppBackupResponse>

  // Missing request or response types
  searchBackups: (appId: string, opts: SearchAppBackupsRequest) => Promise<any>
  deleteBackup: (
    appId: string,
    backupId: string
  ) => Promise<{ message: string }>
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
  restoreBackup: async (appId, backupId, name) => {
    return await API.post({
      url: `/api/apps/${appId}/backups/${backupId}/import`,
      // Name is a legacy thing, but unsure if it is needed for restoring.
      // Leaving this in just in case, but not type casting the body here
      // as we won't normally have it, but it's required in the type.
      body: { name },
    })
  },
})
