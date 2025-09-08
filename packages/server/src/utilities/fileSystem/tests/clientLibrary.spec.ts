jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    objectStore: {
      deleteFolder: jest.fn(),
      listAllObjects: jest.fn(),
      retrieveToTmp: jest.fn().mockResolvedValue("/tmp/file"),
      streamUpload: jest.fn(),
      upload: jest.fn(),
      deleteFile: jest.fn(),
      getReadStream: jest.fn(),
      ObjectStoreBuckets: actual.objectStore.ObjectStoreBuckets,
    },
    sdk: {
      applications: {
        getProdAppID: jest.fn((id: string) => id.replace("_dev", "")),
      },
    },
  }
})

jest.mock("fs", () => ({
  createReadStream: jest.fn(),
  promises: {
    readFile: jest.fn(),
  },
}))

jest.mock("../../../environment", () => ({
  isDev: jest.fn(),
  isTest: jest.fn(),
  DEV_USE_CLIENT_FROM_STORAGE: false,
}))

jest.mock("../filesystem", () => ({
  TOP_LEVEL_PATH: "/mock/top/level/path",
}))

import { objectStore } from "@budibase/backend-core"
import fs from "fs"
import { ObjectStoreBuckets } from "../../../constants"
import env from "../../../environment"
import {
  backupClientLibrary,
  revertClientLibrary,
  shouldServeLocally,
  updateClientLibrary,
} from "../clientLibrary"

const mockedObjectStore = objectStore as jest.Mocked<typeof objectStore>
const mockedFs = fs as jest.Mocked<typeof fs>
const mockedEnv = env as jest.Mocked<typeof env>

type ObjectStoreFile = { Key?: string }
type MockedReadFile = jest.MockedFunction<typeof fs.promises.readFile>

describe("clientLibrary", () => {
  const testAppId = "app_123"
  const testAppIdDev = "app_dev_123"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("backupClientLibrary", () => {
    it("should backup entire app folder to /.bak folder", async () => {
      const mockFiles: ObjectStoreFile[] = [
        { Key: "app_123/manifest.json" },
        { Key: "app_123/budibase-client.js" },
        { Key: "app_123/_dependencies/some-lib.js" },
        { Key: "app_123/custom-file.json" },
      ]

      mockedObjectStore.listAllObjects.mockReturnValue(mockFiles as any)

      await backupClientLibrary(testAppId)

      expect(mockedObjectStore.deleteFolder).toHaveBeenCalledWith(
        ObjectStoreBuckets.APPS,
        "app_123/.bak"
      )

      expect(mockedObjectStore.upload).toHaveBeenCalledTimes(4)
      expect(mockedObjectStore.upload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/.bak/manifest.json",
        path: "/tmp/file",
      })
      expect(mockedObjectStore.upload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/.bak/budibase-client.js",
        path: "/tmp/file",
      })
      expect(mockedObjectStore.upload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/.bak/_dependencies/some-lib.js",
        path: "/tmp/file",
      })
      expect(mockedObjectStore.upload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/.bak/custom-file.json",
        path: "/tmp/file",
      })
    })

    it("should skip .bak files during backup", async () => {
      const mockFiles: ObjectStoreFile[] = [
        { Key: "app_123/manifest.json" },
        { Key: "app_123/.bak/old-file.js" },
        { Key: "app_123/file.js.bak" },
      ]

      mockedObjectStore.listAllObjects.mockReturnValue(mockFiles as any)

      await backupClientLibrary(testAppId)

      expect(mockedObjectStore.upload).toHaveBeenCalledTimes(1)
      expect(mockedObjectStore.upload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/.bak/manifest.json",
        path: "/tmp/file",
      })
    })

    it("should handle dev app IDs correctly", async () => {
      const mockFiles: ObjectStoreFile[] = [{ Key: "app_123/manifest.json" }]
      mockedObjectStore.listAllObjects.mockReturnValue(mockFiles as any)

      await backupClientLibrary(testAppIdDev)

      expect(mockedObjectStore.listAllObjects).toHaveBeenCalledWith(
        ObjectStoreBuckets.APPS,
        testAppId // should be converted to prod ID
      )
    })

    it("should continue if backup folder delete fails", async () => {
      const mockFiles: ObjectStoreFile[] = [{ Key: "app_123/manifest.json" }]
      mockedObjectStore.listAllObjects.mockReturnValue(mockFiles as any)
      mockedObjectStore.deleteFolder.mockRejectedValue(new Error("Not found"))

      await expect(backupClientLibrary(testAppId)).resolves.not.toThrow()
      expect(mockedObjectStore.upload).toHaveBeenCalledTimes(1)
    })
  })

  describe("updateClientLibrary", () => {
    beforeEach(() => {
      mockedFs.createReadStream.mockReturnValue("stream" as any)
      ;(mockedFs.promises.readFile as MockedReadFile).mockResolvedValue(
        '{"version": "1.0.0"}' as any
      )
    })

    it.each([
      ["dev", true],
      ["production", false],
    ])("should upload manifest and client in %s mode", async (_, isDev) => {
      mockedEnv.isDev.mockReturnValue(isDev)

      const result = await updateClientLibrary(testAppId)

      expect(mockedObjectStore.streamUpload).toHaveBeenCalledTimes(2)
      expect(mockedObjectStore.streamUpload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/manifest.json",
        stream: "stream",
      })
      expect(mockedObjectStore.streamUpload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/budibase-client.js",
        stream: "stream",
      })
      expect(result).toEqual({ version: "1.0.0" })
    })
  })

  describe("revertClientLibrary", () => {
    const manifestContent = '{"version": "0.9.0"}'

    beforeEach(() => {
      ;(mockedFs.promises.readFile as MockedReadFile).mockResolvedValue(
        manifestContent as any
      )
    })

    it("should restore from .bak folder structure", async () => {
      const mockBackupFiles: ObjectStoreFile[] = [
        { Key: "app_123/.bak/manifest.json" },
        { Key: "app_123/.bak/budibase-client.js" },
        { Key: "app_123/.bak/_dependencies/lib.js" },
      ]
      const mockCurrentFiles: ObjectStoreFile[] = [
        { Key: "app_123/manifest.json" },
        { Key: "app_123/budibase-client.js" },
        { Key: "app_123/_dependencies/lib.js" },
        { Key: "app_123/extra-file.js" }, // This should be deleted
      ]

      mockedObjectStore.listAllObjects
        .mockReturnValueOnce(mockBackupFiles as any) // First call for backup files
        .mockReturnValueOnce(mockCurrentFiles as any) // Second call for cleanup

      const result = await revertClientLibrary(testAppId)

      expect(mockedObjectStore.upload).toHaveBeenCalledTimes(3)
      ;["manifest.json", "budibase-client.js", "manifest.json"].forEach(
        fileName => {
          expect(mockedObjectStore.upload).toHaveBeenCalledWith({
            bucket: ObjectStoreBuckets.APPS,
            filename: `app_123/${fileName}`,
            path: "/tmp/file",
          })
        }
      )

      expect(mockedObjectStore.deleteFile).toHaveBeenCalledTimes(1)
      expect(mockedObjectStore.deleteFile).toHaveBeenCalledWith(
        ObjectStoreBuckets.APPS,
        "app_123/extra-file.js"
      )

      expect(result).toEqual({ version: "0.9.0" })
    })

    it("should fallback to old .bak files if no .bak folder exists", async () => {
      const mockOldBackupFiles: ObjectStoreFile[] = [
        { Key: "app_123/manifest.json" },
        { Key: "app_123/manifest.json.bak" },
        { Key: "app_123/budibase-client.js" },
        { Key: "app_123/budibase-client.js.bak" },
      ]

      mockedObjectStore.getReadStream.mockReturnValueOnce("stream1" as any)
      mockedObjectStore.getReadStream.mockReturnValueOnce("stream2" as any)

      mockedObjectStore.listAllObjects
        .mockReturnValueOnce([] as any) // No .bak folder
        .mockReturnValueOnce(mockOldBackupFiles as any) // Old .bak files

      const result = await revertClientLibrary(testAppId)

      expect(mockedObjectStore.streamUpload).toHaveBeenCalledTimes(2)
      expect(mockedObjectStore.streamUpload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/budibase-client.js",
        stream: "stream1",
      })
      expect(mockedObjectStore.streamUpload).toHaveBeenCalledWith({
        bucket: ObjectStoreBuckets.APPS,
        filename: "app_123/manifest.json",
        stream: "stream2",
      })

      expect(result).toEqual({ version: "0.9.0" })
    })

    it("should throw error if no backup found", async () => {
      mockedObjectStore.listAllObjects
        .mockReturnValueOnce([] as any) // No .bak folder
        .mockReturnValueOnce([] as any) // No old .bak files

      await expect(revertClientLibrary(testAppId)).rejects.toThrow(
        "No backup found for app app_123"
      )
    })

    it("should throw error if manifest not found in backup", async () => {
      const mockBackupFiles: ObjectStoreFile[] = [
        { Key: "app_123/.bak/budibase-client.js" },
      ]

      mockedObjectStore.listAllObjects.mockReturnValueOnce(
        mockBackupFiles as any
      )

      await expect(revertClientLibrary(testAppId)).rejects.toThrow(
        "No manifest found in backup for app app_123"
      )
    })

    it("should handle dev app IDs correctly", async () => {
      const mockBackupFiles: ObjectStoreFile[] = [
        { Key: "app_123/.bak/manifest.json" },
      ]

      mockedObjectStore.listAllObjects.mockReturnValueOnce(
        mockBackupFiles as any
      )

      await revertClientLibrary(testAppIdDev)

      expect(mockedObjectStore.listAllObjects).toHaveBeenCalledWith(
        ObjectStoreBuckets.APPS,
        "app_123/.bak" // should use prod ID
      )
    })
  })

  describe("shouldServeLocally", () => {
    beforeEach(() => {
      mockedEnv.isDev.mockReturnValue(false)
      mockedEnv.isTest.mockReturnValue(false)
      ;(mockedEnv as any).DEV_USE_CLIENT_FROM_STORAGE = false
    })

    it("should serve locally in dev mode", () => {
      mockedEnv.isDev.mockReturnValue(true)
      expect(shouldServeLocally()).toBe(true)
    })

    it("should not serve locally in dev mode if DEV_USE_CLIENT_FROM_STORAGE is true", () => {
      mockedEnv.isDev.mockReturnValue(true)
      ;(mockedEnv as any).DEV_USE_CLIENT_FROM_STORAGE = true
      expect(shouldServeLocally()).toBe(false)
    })

    it("should serve locally in test mode", () => {
      mockedEnv.isTest.mockReturnValue(true)
      expect(shouldServeLocally()).toBe(true)
    })

    it("should not serve locally in production", () => {
      expect(shouldServeLocally()).toBe(false)
    })
  })
})
