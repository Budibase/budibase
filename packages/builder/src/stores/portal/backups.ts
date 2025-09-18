import { API } from "@/api"
import { SearchWorkspaceBackupsRequest } from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface BackupState {
  selectedBackup?: string
}

export class BackupStore extends BudiStore<BackupState> {
  constructor() {
    super({})
  }

  selectBackup(backupId: string) {
    this.update(state => {
      state.selectedBackup = backupId
      return state
    })
  }

  async searchBackups(appId: string, opts: SearchWorkspaceBackupsRequest) {
    return API.searchBackups(appId, opts)
  }

  async restoreBackup(appId: string, backupId: string, name?: string) {
    return API.restoreBackup(appId, backupId, name)
  }

  async deleteBackup(appId: string, backupId: string) {
    return API.deleteBackup(appId, backupId)
  }

  async deleteBackups(appId: string, backupIds: string[]) {
    return API.deleteBackups(appId, backupIds)
  }

  async createManualBackup(appId: string) {
    return API.createManualBackup(appId)
  }

  async clearBackupErrors(appId: string, backupId?: string) {
    return API.clearBackupErrors(appId, backupId)
  }
}

export const backups = new BackupStore()
