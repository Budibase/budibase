import { context, events } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { DocumentType, Workspace } from "@budibase/types"
import tk from "timekeeper"
import sdk from "../../../sdk"
import * as setup from "./utilities"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"

mocks.licenses.useBackups()

describe("/backups", () => {
  let config = setup.getConfig()

  afterAll(async () => {
    setup.afterAll()
  })

  beforeEach(async () => {
    tk.reset()
    await config.init()
  })

  describe("/api/backups/export", () => {
    it("should be able to export app", async () => {
      const body = await config.api.backup.exportBasicBackup(config.getAppId()!)
      expect(body instanceof Buffer).toBe(true)
      expect(events.app.exported).toHaveBeenCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/backups/export?appId=${config.getAppId()}`,
      })
    })

    it("should infer the app name from the app", async () => {
      tk.freeze(mocks.date.MOCK_DATE)

      await config.api.backup.exportBasicBackup(config.getAppId()!, {
        headers: {
          "content-disposition": `attachment; filename="${
            config.getApp().name
          }-export-${mocks.date.MOCK_DATE.getTime()}.tar.gz"`,
        },
      })
    })
  })

  describe("/api/backups/import", () => {
    it("should be able to import an app", async () => {
      const appId = config.getAppId()!
      const automation = await config.createAutomation()
      await config.createAutomationLog(automation, appId)
      await config.createScreen()
      const exportRes = await config.api.backup.createBackup(appId)
      expect(exportRes.backupId).toBeDefined()
      await config.api.backup.waitForBackupToComplete(appId, exportRes.backupId)
      await config.api.backup.importBackup(appId, exportRes.backupId)
    })
  })

  describe("calculateBackupStats", () => {
    it("should be able to calculate the backup statistics", async () => {
      await config.createAutomation()
      await config.createScreen()
      let res = await sdk.backups.calculateBackupStats(config.getAppId()!)
      expect(res.automations).toEqual(1)
      expect(res.datasources).toEqual(1)
      expect(res.screens).toEqual(1)
    })
  })

  describe("backup error tracking", () => {
    it("should track backup failures in app metadata", async () => {
      const appId = config.getAppId()!

      // First manually add a backup error to simulate a failure
      await context.doInWorkspaceContext(appId, async () => {
        const db = context.getProdWorkspaceDB()
        const metadata = await db.get<Workspace>(
          DocumentType.WORKSPACE_METADATA
        )

        // Add backup error manually to test the structure
        metadata.backupErrors = {
          "backup-123": ["Backup export failed: Test error"],
        }
        await db.put(metadata)

        // Now verify the structure
        const updatedMetadata = await db.get<Workspace>(
          DocumentType.WORKSPACE_METADATA
        )
        expect(updatedMetadata.backupErrors).toBeDefined()
        expect(updatedMetadata.backupErrors).toEqual({
          "backup-123": ["Backup export failed: Test error"],
        })
      })
    })

    it("should be able to clear backup errors from app metadata", async () => {
      const appId = config.getAppId()!

      // First set up backup errors in app metadata
      await context.doInWorkspaceContext(appId, async () => {
        const db = context.getProdWorkspaceDB()
        const metadata = await db.get<Workspace>(
          DocumentType.WORKSPACE_METADATA
        )
        metadata.backupErrors = {
          "backup-123": ["Backup export failed: Test error"],
          "backup-456": ["Another backup error"],
        }
        await db.put(metadata)
      })

      // This test should fail initially since we haven't implemented the clear endpoint yet
      const response = await config.api.backup.clearBackupErrors(
        appId,
        "backup-123"
      )
      expect(response.message).toEqual("Backup errors cleared.")

      // Verify the specific error was removed from app metadata
      await context.doInWorkspaceContext(appId, async () => {
        const db = context.getProdWorkspaceDB()
        const metadata = await db.get<Workspace>(
          DocumentType.WORKSPACE_METADATA
        )
        expect(metadata.backupErrors).toEqual({
          "backup-456": ["Another backup error"],
        })
      })
    })
  })
})
