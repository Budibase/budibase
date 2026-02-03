import { db, queue, utils } from "@budibase/backend-core"
import { utils as testUtils } from "@budibase/backend-core/tests"
import {
  BackupStatus,
  BackupTrigger,
  BackupType,
  WorkspaceBackup,
} from "@budibase/types"
import tk from "timekeeper"
import { default as backups } from "../"
import { DBTestConfiguration, mocks } from "../../../../tests"

jest.mock("../../../db/utils/retention", () => {
  let date = new Date()
  date.setDate(date.getDate() - 30)
  return {
    getOldestRetentionDate: jest.fn().mockReturnValue(date.toISOString()),
  }
})

jest.mock("fs", () => {
  return {
    ...jest.requireActual("fs"),
    createReadStream: jest.fn(),
  }
})

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  const fs = jest.requireActual("fs")
  const { join } = jest.requireActual("path")
  return {
    ...core,
    objectStore: {
      ...core.objectStore,
      upload: jest.fn(),
      streamUpload: jest.fn(),
      deleteFile: jest.fn(),
      getReadStream: jest.fn().mockReturnValue({
        stream: fs.createReadStream(join(__dirname, "index.spec.ts")),
      }),
      retrieveToTmp: jest.fn().mockReturnValue("/path"),
    },
  }
})

const USER_ID = "user_test"

beforeAll(() => testUtils.queue.useRealQueues())

describe("backups", () => {
  const config = new DBTestConfiguration()

  async function waitForQueue() {
    await testUtils.queue.processMessages(
      backups.getBackupQueue().getBullQueue()
    )
  }

  const advanceTimeAround = async (fn: any) => {
    const period = Math.ceil(Math.random() * 10)
    await utils.timeout(period)
    const result = await fn()
    await utils.timeout(period)
    return result
  }

  async function storeBackup(
    opts: {
      workspaceId?: string
      type?: BackupType
      trigger?: BackupTrigger
    } = {}
  ) {
    return advanceTimeAround(async () => {
      if (!opts.workspaceId) {
        opts.workspaceId = config.workspaceId
      }
      if (!opts.type) {
        opts.type = BackupType.BACKUP
      }
      if (!opts.trigger) {
        opts.trigger = BackupTrigger.PUBLISH
      }
      const { id } = await backups.storeAppBackupMetadata(
        {
          appId: opts.workspaceId,
          trigger: opts.trigger,
          type: opts.type,
          status: BackupStatus.STARTED,
          name: "test name",
          createdBy: USER_ID,
          timestamp: new Date().toISOString(),
        },
        { filename: "test.tar.gz" }
      )

      return id
    })
  }

  const createBackup = async (
    opts: { workspaceId?: string; skipWait?: boolean } = {}
  ): Promise<WorkspaceBackup> => {
    return advanceTimeAround(async () => {
      if (!opts.workspaceId) {
        opts.workspaceId = config.workspaceId
      }

      let backupId = await backups.triggerAppBackup(
        opts.workspaceId,
        BackupTrigger.MANUAL,
        { createdBy: USER_ID, name: "test" }
      )

      if (!opts?.skipWait) {
        await waitForQueue()
      }

      return backups.getAppBackup(backupId!)
    })
  }

  const createRestore = async (
    workspaceId?: string
  ): Promise<WorkspaceBackup> => {
    return advanceTimeAround(async () => {
      if (!workspaceId) {
        workspaceId = config.workspaceId
      }

      // create backup and wait for processing
      const backup = await createBackup({ workspaceId })
      await waitForQueue()

      // create restore
      const response = await backups.triggerAppRestore(
        workspaceId,
        backup._id,
        "backup restore",
        USER_ID
      )
      const restore = await backups.getAppBackup(response!.restoreId)
      expect(restore).toBeDefined()
      expect(restore.status).toEqual(BackupStatus.PENDING)
      // wait for processing
      await waitForQueue()
      // return processed result
      return backups.getAppBackup(response!.restoreId)
    })
  }

  // Disable date mocking
  tk.reset()

  const exportAppFn = jest.fn(),
    importAppFn = jest.fn(),
    statsFn = jest.fn()

  beforeAll(async () => {
    mocks.licenses.useBackups()
    await backups.init({
      processing: {
        exportAppFn,
        importAppFn,
        statsFn,
      },
    })
  })

  beforeEach(() => {
    exportAppFn.mockReset().mockReturnValue("/path")
    importAppFn.mockReset().mockImplementation()
    statsFn.mockReset().mockImplementation()

    mocks.licenses.useBackups()
    config.newTenant()
  })

  afterAll(async () => {
    await queue.shutdown()
  })

  it("should check its enabled", async () => {
    const state = await backups.isEnabled()
    expect(state).toEqual(true)
  })

  it("should check its disabled", async () => {
    mocks.licenses.useCloudFree()
    const state = await backups.isEnabled()
    expect(state).toEqual(false)
  })

  it("should trigger a backup", async () => {
    await config.doInTenant(async () => {
      const backup = await createBackup()

      expect(backup).toBeDefined()
      expect(backup.status).toEqual(BackupStatus.COMPLETE)
      await waitForQueue()
      expect(backup._id).toBeDefined()
      expect(exportAppFn).toHaveBeenCalledTimes(1)
    })
  })

  it("should trigger a restore", async () => {
    await config.doInTenant(async () => {
      const restore = await createRestore()
      const processedRestore = await backups.getAppBackup(restore._id)

      expect(processedRestore._id).toBeDefined()
      expect(exportAppFn).toHaveBeenCalledTimes(2)
      expect(importAppFn).toHaveBeenCalledTimes(1)
    })
  })

  it("should not delete dev workspace when import fails", async () => {
    await config.doInTenant(async () => {
      const devWorkspaceId = db.getDevWorkspaceID(config.workspaceId)

      // Create "dev" workspace
      const devDb = db.getDB(devWorkspaceId)
      await devDb.put({ _id: "test", type: "app" })

      const backup = await createBackup()
      await waitForQueue()

      importAppFn.mockRejectedValue(new Error("Import failed"))
      // Trigger restore which should fail
      const response = await backups.triggerAppRestore(
        config.workspaceId,
        backup._id,
        "backup restore",
        USER_ID
      )
      await waitForQueue()

      // Verify restore failed
      const processedRestore = await backups.getAppBackup(response!.restoreId)
      expect(processedRestore.status).toEqual(BackupStatus.FAILED)
      expect(importAppFn).toHaveBeenCalledTimes(1)

      // Verify dev workspace database is not deleted
      expect(await db.getDB(devWorkspaceId).allDocs({})).toEqual({
        offset: 0,
        rows: [
          {
            id: "test",
            key: "test",
            value: { rev: expect.any(String) },
          },
        ],
        total_rows: 1,
      })
    })
  })

  it("should be able to download a backup", async () => {
    await config.doInTenant(async () => {
      const backup = await createBackup()
      const output = await backups.getBackupDownloadStream(backup._id)

      expect(output.metadata).toBeDefined()
      expect(output.metadata).toEqual(
        expect.objectContaining({
          appId: config.workspaceId,
          trigger: BackupTrigger.MANUAL,
          status: BackupStatus.COMPLETE,
          createdBy: USER_ID,
          name: "test",
        })
      )
      expect(output.stream).toBeDefined()
    })
  })

  it("should be able to store metadata about a backup", async () => {
    await config.doInTenant(async () => {
      const id = await storeBackup()
      expect(id).toBeDefined()
      const metadata = await backups.getAppBackup(id)
      expect(metadata.filename).toEqual("test.tar.gz")
    })
  })

  it("should be able to update backup status", async () => {
    await config.doInTenant(async () => {
      const backup = await createBackup()
      const before = await backups.getAppBackup(backup._id)
      // @ts-ignore
      await backups.updateBackupStatus(before._id, BackupStatus.FAILED)
      const metadata = await backups.getAppBackup(backup._id)
      expect(metadata.status).toEqual(BackupStatus.FAILED)
    })
  })

  it("should be able to update restore status", async () => {
    await config.doInTenant(async () => {
      const restore = await createRestore()
      await backups.updateRestoreStatus(
        restore._id,
        restore._rev!,
        BackupStatus.FAILED
      )
      const updated = await backups.getAppBackup(restore._id)
      expect(updated.status).toEqual(BackupStatus.FAILED)
    })
  })

  it("should be able to get a single workspace backup", async () => {
    await config.doInTenant(async () => {
      let backup = await createBackup()
      expect(backup).toBeDefined()
      backup = await backups.getAppBackup(backup._id)
      expect(backup.status).toEqual(BackupStatus.COMPLETE)
      expect(backup.name).toEqual("test")
    })
  })

  it("should be able to update an workspace backup", async () => {
    await config.doInTenant(async () => {
      const backup = await createBackup()
      await backups.updateAppBackup(backup._id, "new name")
      const updated = await backups.getAppBackup(backup._id)
      expect(updated.name).toEqual("new name")
    })
  })

  it("should be able to delete a backup", async () => {
    await config.doInTenant(async () => {
      const backup = await createBackup()
      await backups.deleteAppBackup(backup._id)
      let cantFind = false
      try {
        await backups.getAppBackup(backup._id)
      } catch (err: any) {
        if (err.status === 404) {
          cantFind = true
        }
      }
      expect(cantFind).toEqual(true)
    })
  })

  describe("backup search", () => {
    const startDate = new Date().toISOString()
    let now = new Date()
    now.setDate(now.getDate() + 5)
    const endDate = now.toISOString()

    beforeEach(() => {
      mocks.licenses.useBackups()
    })

    it("should be able to fetch a list of backups when empty", async () => {
      await config.doInTenant(async () => {
        const workspaceId = "app_searchEmpty"
        const response = await backups.fetchAppBackups(workspaceId, {
          startDate,
          endDate,
        })
        expect(response.data.length).toEqual(0)
        expect(response.hasNextPage).toEqual(false)
      })
    })

    it("should be able to search by type and trigger", async () => {
      await config.doInTenant(async () => {
        const workspaceId = "app_searchByTypeAndTrigger"
        // the search hit
        await storeBackup({
          workspaceId,
          trigger: BackupTrigger.MANUAL,
          type: BackupType.RESTORE,
        })
        // decoys
        await storeBackup({
          workspaceId,
          trigger: BackupTrigger.MANUAL,
          type: BackupType.BACKUP,
        })
        await storeBackup({
          workspaceId: "app_other",
          trigger: BackupTrigger.MANUAL,
          type: BackupType.RESTORE,
        })

        const response = await backups.fetchAppBackups(workspaceId, {
          startDate,
          endDate,
          trigger: BackupTrigger.MANUAL,
          type: BackupType.RESTORE,
        })
        expect(response.data.length).toEqual(1)
      })
    })

    it("should be able to search by page", async () => {
      const workspaceId = "app_searchPagination"
      await config.doInTenant(async () => {
        for (let count = 0; count < 10; count++) {
          await storeBackup({ workspaceId })
        }
        // now fetch first page
        const opts = {
          startDate,
          endDate,
          limit: 8,
          paginate: true,
        }
        const resp1 = await backups.fetchAppBackups(workspaceId, opts)
        expect(resp1.data.length).toEqual(8)
        expect(resp1.hasNextPage).toEqual(true)
        const resp2 = await backups.fetchAppBackups(workspaceId, {
          ...opts,
          page: resp1.nextPage,
        })
        expect(resp2.data.length).toEqual(2)
        expect(resp2.hasNextPage).toEqual(false)
      })
    })
  })
})
