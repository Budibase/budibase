import {
  CreateAppBackupResponse,
  ImportAppBackupResponse,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class BackupAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  exportBasicBackup = async (appId: string) => {
    const result = await this.request
      .post(`/api/backups/export?appId=${appId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /application\/gzip/)
      .expect(200)
    return {
      body: result.body as Buffer,
      headers: result.headers,
    }
  }

  createBackup = async (appId: string) => {
    const result = await this.request
      .post(`/api/apps/${appId}/backups`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return result.body as CreateAppBackupResponse
  }

  waitForBackupToComplete = async (appId: string, backupId: string) => {
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const result = await this.request
        .get(`/api/apps/${appId}/backups/${backupId}/file`)
        .set(this.config.defaultHeaders())
      if (result.status === 200) {
        return
      }
    }
    throw new Error("Backup did not complete")
  }

  importBackup = async (
    appId: string,
    backupId: string
  ): Promise<ImportAppBackupResponse> => {
    const result = await this.request
      .post(`/api/apps/${appId}/backups/${backupId}/import`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return result.body as ImportAppBackupResponse
  }
}
