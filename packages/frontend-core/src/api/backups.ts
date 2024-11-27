import { PutResponse } from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface BackupEndpoints {
  createManualBackup: (
    appId: string
  ) => Promise<{ backupId: string; message: string }>
  deleteBackup: (
    appId: string,
    backupId: string
  ) => Promise<{ message: string }>
  updateBackup: (
    appId: string,
    backupId: string,
    name: string
  ) => Promise<PutResponse>
  restoreBackup: (
    appId: string,
    backupId: string,
    name: string
  ) => Promise<{ restoreId: string; message: string }>

  // Missing request or response types
  searchBackups: (opts: any) => Promise<any>
}

export const buildBackupEndpoints = (API: BaseAPIClient): BackupEndpoints => ({
  searchBackups: async ({ appId, trigger, type, page, startDate, endDate }) => {
    const opts: any = {}
    if (page) {
      opts.page = page
    }
    if (trigger && type) {
      opts.trigger = trigger.toLowerCase()
      opts.type = type.toLowerCase()
    }
    if (startDate && endDate) {
      opts.startDate = startDate
      opts.endDate = endDate
    }
    return await API.post({
      url: `/api/apps/${appId}/backups/search`,
      body: opts,
    })
  },
  createManualBackup: async appId => {
    return await API.post({
      url: `/api/apps/${appId}/backups`,
    })
  },
  deleteBackup: async (appId, backupId) => {
    return await API.delete({
      url: `/api/apps/${appId}/backups/${backupId}`,
    })
  },
  updateBackup: async (appId, backupId, name) => {
    return await API.patch({
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
