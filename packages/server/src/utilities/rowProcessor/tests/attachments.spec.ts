import { AttachmentCleanup } from "../attachments"
import { FieldType, Table, Row, TableSourceType } from "@budibase/types"
import { DEFAULT_BB_DATASOURCE_ID } from "../../../constants"
import { objectStore } from "@budibase/backend-core"

const BUCKET = "prod-budi-app-assets"
const FILE_NAME = "file/thing.jpg"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    objectStore: {
      deleteFiles: jest.fn(),
      ObjectStoreBuckets: actual.objectStore.ObjectStoreBuckets,
    },
    db: {
      isProdAppID: () => jest.fn(() => false),
      dbExists: () => jest.fn(() => false),
    },
  }
})

const mockedDeleteFiles = objectStore.deleteFiles as jest.MockedFunction<
  typeof objectStore.deleteFiles
>

function table(): Table {
  return {
    name: "table",
    sourceId: DEFAULT_BB_DATASOURCE_ID,
    sourceType: TableSourceType.INTERNAL,
    type: "table",
    schema: {
      attach: {
        name: "attach",
        type: FieldType.ATTACHMENT,
        constraints: {},
      },
    },
  }
}

function row(fileKey: string = FILE_NAME): Row {
  return {
    attach: [
      {
        size: 1,
        extension: "jpg",
        key: fileKey,
      },
    ],
  }
}

describe("attachment cleanup", () => {
  beforeEach(() => {
    mockedDeleteFiles.mockClear()
  })

  it("should be able to cleanup a table update", async () => {
    const originalTable = table()
    delete originalTable.schema["attach"]
    await AttachmentCleanup.tableUpdate(originalTable, [row()], {
      oldTable: table(),
    })
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
  })

  it("should be able to cleanup a table deletion", async () => {
    await AttachmentCleanup.tableDelete(table(), [row()])
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
  })

  it("should handle table column renaming", async () => {
    const updatedTable = table()
    updatedTable.schema.attach2 = updatedTable.schema.attach
    delete updatedTable.schema.attach
    await AttachmentCleanup.tableUpdate(updatedTable, [row()], {
      oldTable: table(),
      rename: { old: "attach", updated: "attach2" },
    })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("shouldn't cleanup if no table changes", async () => {
    await AttachmentCleanup.tableUpdate(table(), [row()], { oldTable: table() })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("should handle row updates", async () => {
    const updatedRow = row()
    delete updatedRow.attach
    await AttachmentCleanup.rowUpdate(table(), {
      row: updatedRow,
      oldRow: row(),
    })
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
  })

  it("should handle row deletion", async () => {
    await AttachmentCleanup.rowDelete(table(), [row()])
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
  })

  it("should handle row deletion and not throw when attachments are undefined", async () => {
    await AttachmentCleanup.rowDelete(table(), [
      {
        attach: undefined,
      },
    ])
  })

  it("shouldn't cleanup attachments if row not updated", async () => {
    await AttachmentCleanup.rowUpdate(table(), { row: row(), oldRow: row() })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("should be able to cleanup a column and not throw when attachments are undefined", async () => {
    const originalTable = table()
    delete originalTable.schema["attach"]
    await AttachmentCleanup.tableUpdate(
      originalTable,
      [row("file 1"), { attach: undefined }, row("file 2")],
      {
        oldTable: table(),
      }
    )
    expect(mockedDeleteFiles).toHaveBeenCalledTimes(1)
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, ["file 1", "file 2"])
  })

  it("should be able to cleanup a column and not throw when ALL attachments are undefined", async () => {
    const originalTable = table()
    delete originalTable.schema["attach"]
    await AttachmentCleanup.tableUpdate(
      originalTable,
      [{}, { attach: undefined }],
      {
        oldTable: table(),
      }
    )
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })
})
