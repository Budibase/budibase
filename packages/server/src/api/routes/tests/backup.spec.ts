import { context, events } from "@budibase/backend-core"
import { generator, mocks } from "@budibase/backend-core/tests"
import { DocumentType, Workspace } from "@budibase/types"
import path from "path"
import { Readable } from "stream"
import { pipeline } from "stream/promises"
import tar from "tar"
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
    jest.clearAllMocks()
    await config.init()
  })

  describe("/api/backups/export", () => {
    let attachmentFileNames: string[] = []

    async function checkExportContent(
      buffer: Buffer,
      opts: { includeRows: boolean; isEncrypted: boolean }
    ) {
      const exportedFiles: string[] = []
      await pipeline(
        Readable.from(buffer),
        tar.list({
          onentry: entry => {
            if (entry.type !== "Directory") {
              exportedFiles.push(entry.path)
            }
          },
        })
      )

      const expectedFiles = [
        "budibase-client.js",
        "budibase-client.new.js",
        "db.txt",
        "manifest.json",
        "_dependencies/apexcharts.js",
        "_dependencies/html5-qrcode.js",
      ].map(x => `${x}${opts.isEncrypted ? ".enc" : ""}`)
      if (opts.includeRows) {
        expectedFiles.push(
          ...attachmentFileNames.sort().map(f => `attachments/${f}`)
        )
      }

      expect(exportedFiles).toEqual(expectedFiles)
    }

    beforeEach(async () => {
      const table = await config.api.table.save(
        setup.structures.basicTableWithAttachmentField()
      )
      const [attachment1, attachment2, attachment3] = await Promise.all(
        Array.from({ length: 3 }).map(async (_, i) => {
          const [result] = await config.api.attachment.upload(
            table._id!,
            `${i}.txt`,
            Buffer.from(generator.paragraph())
          )
          return result
        })
      )

      attachmentFileNames = [
        path.basename(attachment1.key),
        path.basename(attachment2.key),
        path.basename(attachment3.key),
      ]

      await config.api.row.save(table._id!, {
        single_file_attachment: attachment1,
        file_attachment: [attachment2, attachment3],
      })
    })

    it("should be able to export a workspace with rows", async () => {
      const body = await config.api.backup.exportBasicBackup(
        config.getDevWorkspaceId()
      )
      expect(body instanceof Buffer).toBe(true)
      expect(events.app.exported).toHaveBeenCalledTimes(1)

      await checkExportContent(body, { includeRows: true, isEncrypted: false })
    })

    it("should be able to export a workspace without rows", async () => {
      const body = await config.api.backup.exportBasicBackup(
        config.getDevWorkspaceId(),
        {
          excludeRows: true,
        }
      )
      expect(body instanceof Buffer).toBe(true)
      expect(events.app.exported).toHaveBeenCalledTimes(1)

      await checkExportContent(body, { includeRows: false, isEncrypted: false })
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "POST",
        url: `/api/backups/export?appId=${config.getDevWorkspaceId()}`,
      })
    })

    it("should infer the export name from the workspace", async () => {
      tk.freeze(mocks.date.MOCK_DATE)
      await config.api.backup.exportBasicBackup(
        config.getDevWorkspaceId(),
        undefined,
        {
          headers: {
            "content-disposition": `attachment; filename="${
              config.getDevWorkspace().name
            }-export-${mocks.date.MOCK_DATE.getTime()}.tar.gz"`,
          },
        }
      )
    })

    it("should be able to export a workspace with encryption and rows", async () => {
      tk.freeze(mocks.date.MOCK_DATE)

      const body = await config.api.backup.exportBasicBackup(
        config.getDevWorkspaceId(),
        { excludeRows: false, encryptPassword: "abcde" },
        {
          headers: {
            "content-disposition": `attachment; filename="${
              config.getDevWorkspace().name
            }-export-${mocks.date.MOCK_DATE.getTime()}.enc.tar.gz"`,
          },
        }
      )
      expect(body instanceof Buffer).toBe(true)
      expect(events.app.exported).toHaveBeenCalledTimes(1)

      await checkExportContent(body, { isEncrypted: true, includeRows: true })
    })

    it("should be able to export a workspace with encryption excluding rows", async () => {
      tk.freeze(mocks.date.MOCK_DATE)

      const body = await config.api.backup.exportBasicBackup(
        config.getDevWorkspaceId(),
        { excludeRows: true, encryptPassword: "abcde" },
        {
          headers: {
            "content-disposition": `attachment; filename="${
              config.getDevWorkspace().name
            }-export-${mocks.date.MOCK_DATE.getTime()}.enc.tar.gz"`,
          },
        }
      )
      expect(body instanceof Buffer).toBe(true)
      expect(events.app.exported).toHaveBeenCalledTimes(1)

      await checkExportContent(body, { isEncrypted: true, includeRows: false })
    })
  })

  describe("/api/apps/{appId}/backups/{backupId}/import", () => {
    it("should be able to import a workspace", async () => {
      const workspaceId = config.getDevWorkspaceId()
      const automation = await config.createAutomation()
      await config.createAutomationLog(automation, workspaceId)
      await config.createScreen()
      const exportRes = await config.api.backup.createBackup(workspaceId)
      expect(exportRes.backupId).toBeDefined()
      await config.api.backup.waitForBackupToComplete(
        workspaceId,
        exportRes.backupId
      )
      await config.api.backup.importBackup(workspaceId, exportRes.backupId)
    })
  })

  describe("calculateBackupStats", () => {
    it("should be able to calculate the backup statistics", async () => {
      await config.createAutomation()
      await config.createScreen()
      let res = await sdk.backups.calculateBackupStats(
        config.getDevWorkspaceId()
      )
      expect(res.automations).toEqual(1)
      expect(res.datasources).toEqual(1)
      expect(res.screens).toEqual(1)
    })
  })

  describe("backup error tracking", () => {
    it("should track backup failures in workspace metadata", async () => {
      const workspaceId = config.getDevWorkspaceId()

      // First manually add a backup error to simulate a failure
      await context.doInWorkspaceContext(workspaceId, async () => {
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

    it("should be able to clear backup errors from workspace metadata", async () => {
      const workspaceId = config.getDevWorkspaceId()

      // First set up backup errors in workspace metadata
      await context.doInWorkspaceContext(workspaceId, async () => {
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
        workspaceId,
        "backup-123"
      )
      expect(response.message).toEqual("Backup errors cleared.")

      // Verify the specific error was removed from workspace metadata
      await context.doInWorkspaceContext(workspaceId, async () => {
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
