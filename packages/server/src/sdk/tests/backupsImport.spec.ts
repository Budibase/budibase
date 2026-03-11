import {
  type DeleteObjectsCommandOutput,
  type _Object as S3Object,
} from "@aws-sdk/client-s3"
import { objectStore } from "@budibase/backend-core"
import {
  type AllDocsResponse,
  type Database,
  type Document,
  type RowValue,
} from "@budibase/types"
import fs from "fs/promises"
import os from "os"
import path from "path"
import { type Dirent } from "fs"
import { DB_EXPORT_FILE } from "../workspace/backups/constants"
import { importApp } from "../workspace/backups/imports"

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")

  return {
    ...core,
    objectStore: {
      ...core.objectStore,
      uploadDirectory: jest.fn(),
      upload: jest.fn(),
      deleteFiles: jest.fn(),
      listAllObjects: jest.fn().mockReturnValue((async function* () {})()),
    },
  }
})

async function* emptyObjectList(): AsyncGenerator<S3Object> {}

type ImportAppDatabase = Pick<
  Database,
  "name" | "load" | "allDocs" | "bulkDocs"
>

const emptyAllDocs: Database["allDocs"] = async function <
  T extends Document | RowValue,
>() {
  return {
    offset: 0,
    total_rows: 0,
    rows: [],
  } as AllDocsResponse<T>
}

function createDatabaseMock(overrides: {
  name: string
  load: Database["load"]
  allDocs?: Database["allDocs"]
  bulkDocs?: Database["bulkDocs"]
}): ImportAppDatabase {
  return {
    name: overrides.name,
    load: overrides.load,
    allDocs: overrides.allDocs ?? emptyAllDocs,
    bulkDocs: overrides.bulkDocs ?? (async () => []),
  }
}

describe("importApp", () => {
  const mockedObjectStore = jest.mocked(objectStore)
  let tmpPath: string

  beforeEach(async () => {
    jest.clearAllMocks()
    mockedObjectStore.listAllObjects.mockReturnValue(emptyObjectList())

    tmpPath = await fs.mkdtemp(path.join(os.tmpdir(), "bb-backup-import-"))
    await fs.writeFile(path.join(tmpPath, DB_EXPORT_FILE), "[]")
    await fs.mkdir(path.join(tmpPath, "attachments"))
    await fs.writeFile(
      path.join(tmpPath, "attachments", "example.txt"),
      "attachment"
    )
  })

  afterEach(async () => {
    await fs.rm(tmpPath, { recursive: true, force: true })
  })

  it("should not mutate object store when database load fails", async () => {
    const db = createDatabaseMock({
      name: "app_dev_test",
      load: async () => {
        throw new Error("load failed")
      },
    })

    await expect(
      importApp(
        "app_dev_test",
        db as Database,
        {
          file: {
            path: tmpPath,
            type: "text/plain",
          },
        },
        {
          updateAttachmentColumns: false,
        }
      )
    ).rejects.toThrow("load failed")

    expect(mockedObjectStore.uploadDirectory).not.toHaveBeenCalled()
    expect(mockedObjectStore.upload).not.toHaveBeenCalled()
    expect(mockedObjectStore.deleteFiles).not.toHaveBeenCalled()
  })

  it("should sync object store after the database import succeeds", async () => {
    const callOrder: string[] = []
    const db = createDatabaseMock({
      name: "app_dev_test",
      load: async () => {
        callOrder.push("load")
        return { ok: true }
      },
    })

    mockedObjectStore.uploadDirectory.mockImplementation(async () => {
      callOrder.push("uploadDirectory")
      return [] as Dirent[]
    })
    mockedObjectStore.deleteFiles.mockImplementation(async () => {
      callOrder.push("deleteFiles")
      return {} as DeleteObjectsCommandOutput
    })
    mockedObjectStore.listAllObjects.mockReturnValue(
      (async function* () {
        yield { Key: "app_test/attachments/stale.txt" }
      })()
    )

    await importApp(
      "app_dev_test",
      db as Database,
      {
        file: {
          path: tmpPath,
          type: "text/plain",
        },
      },
      {
        updateAttachmentColumns: false,
      }
    )

    expect(callOrder[0]).toBe("load")
    expect(callOrder).toEqual(["load", "uploadDirectory", "deleteFiles"])
  })
})
