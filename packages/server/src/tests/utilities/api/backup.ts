import {
  CreateAppBackupResponse,
  ImportAppBackupResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export class BackupAPI extends TestAPI {
  exportBasicBackup = async (appId: string, expectations?: Expectations) => {
    const exp = {
      ...expectations,
      headers: {
        ...expectations?.headers,
        "Content-Type": "application/gzip",
      },
    }
    return await this._post<Buffer>(`/api/backups/export`, {
      query: { appId },
      expectations: exp,
    })
  }

  createBackup = async (appId: string, expectations?: Expectations) => {
    return await this._post<CreateAppBackupResponse>(
      `/api/apps/${appId}/backups`,
      { expectations }
    )
  }

  waitForBackupToComplete = async (appId: string, backupId: string) => {
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const response = await this._requestRaw(
        "get",
        `/api/apps/${appId}/backups/${backupId}/file`
      )
      if (response.status === 200) {
        return
      }
    }
    throw new Error("Backup did not complete")
  }

  importBackup = async (
    appId: string,
    backupId: string,
    expectations?: Expectations
  ): Promise<ImportAppBackupResponse> => {
    return await this._post<ImportAppBackupResponse>(
      `/api/apps/${appId}/backups/${backupId}/import`,
      { expectations }
    )
  }
}
