import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { SearchAppBackupsRequest } from "@budibase/types"

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

  async searchBackups(appId: string, opts: SearchAppBackupsRequest) {
    return API.searchBackups(appId, opts)
  }

  async restoreBackup(appId: string, backupId: string, name?: string) {
    return API.restoreBackup(appId, backupId, name)
  }

  async deleteBackup(appId: string, backupId: string) {
    return API.deleteBackup(appId, backupId)
  }

  async createManualBackup(appId: string) {
    return API.createManualBackup(appId)
  }
}

export const backups = new BackupStore()
