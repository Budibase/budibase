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

const rowGenerators: [
  string,
  FieldType.ATTACHMENT_SINGLE | FieldType.ATTACHMENTS,
  (fileKey?: string) => Row
][] = [
  [
    "row with a attachment list column",
    FieldType.ATTACHMENTS,
    function rowWithAttachments(fileKey: string = FILE_NAME): Row {
      return {
        attach: [
          {
            size: 1,
            extension: "jpg",
            key: fileKey,
          },
        ],
      }
    },
  ],
  [
    "row with a single attachment column",
    FieldType.ATTACHMENT_SINGLE,
    function rowWithAttachments(fileKey: string = FILE_NAME): Row {
      return {
        attach: {
          size: 1,
          extension: "jpg",
          key: fileKey,
        },
      }
    },
  ],
]

describe.each(rowGenerators)(
  "attachment cleanup",
  (_, attachmentFieldType, rowGenerator) => {
    function tableGenerator(): Table {
      return {
        name: "table",
        sourceId: DEFAULT_BB_DATASOURCE_ID,
        sourceType: TableSourceType.INTERNAL,
        type: "table",
        schema: {
          attach: {
            name: "attach",
            type: attachmentFieldType,
            constraints: {},
          },
        },
      }
    }

    beforeEach(() => {
      mockedDeleteFiles.mockClear()
    })

    it("should be able to cleanup a table update", async () => {
      const originalTable = tableGenerator()
      delete originalTable.schema["attach"]
      await AttachmentCleanup.tableUpdate(originalTable, [rowGenerator()], {
        oldTable: tableGenerator(),
      })
      expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
    })

    it("should be able to cleanup a table deletion", async () => {
      await AttachmentCleanup.tableDelete(tableGenerator(), [rowGenerator()])
      expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
    })

    it("should handle table column renaming", async () => {
      const updatedTable = tableGenerator()
      updatedTable.schema.attach2 = updatedTable.schema.attach
      delete updatedTable.schema.attach
      await AttachmentCleanup.tableUpdate(updatedTable, [rowGenerator()], {
        oldTable: tableGenerator(),
        rename: { old: "attach", updated: "attach2" },
      })
      expect(mockedDeleteFiles).not.toHaveBeenCalled()
    })

    it("shouldn't cleanup if no table changes", async () => {
      await AttachmentCleanup.tableUpdate(tableGenerator(), [rowGenerator()], {
        oldTable: tableGenerator(),
      })
      expect(mockedDeleteFiles).not.toHaveBeenCalled()
    })

    it("should handle row updates", async () => {
      const updatedRow = rowGenerator()
      delete updatedRow.attach
      await AttachmentCleanup.rowUpdate(tableGenerator(), {
        row: updatedRow,
        oldRow: rowGenerator(),
      })
      expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
    })

    it("should handle row deletion", async () => {
      await AttachmentCleanup.rowDelete(tableGenerator(), [rowGenerator()])
      expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
    })

    it("should handle row deletion and not throw when attachments are undefined", async () => {
      await AttachmentCleanup.rowDelete(tableGenerator(), [
        {
          multipleAttachments: undefined,
        },
      ])
    })

    it("shouldn't cleanup attachments if row not updated", async () => {
      await AttachmentCleanup.rowUpdate(tableGenerator(), {
        row: rowGenerator(),
        oldRow: rowGenerator(),
      })
      expect(mockedDeleteFiles).not.toHaveBeenCalled()
    })

    it("should be able to cleanup a column and not throw when attachments are undefined", async () => {
      const originalTable = tableGenerator()
      delete originalTable.schema["attach"]
      await AttachmentCleanup.tableUpdate(
        originalTable,
        [rowGenerator("file 1"), { attach: undefined }, rowGenerator("file 2")],
        {
          oldTable: tableGenerator(),
        }
      )
      expect(mockedDeleteFiles).toHaveBeenCalledTimes(1)
      expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [
        "file 1",
        "file 2",
      ])
    })

    it("should be able to cleanup a column and not throw when ALL attachments are undefined", async () => {
      const originalTable = tableGenerator()
      delete originalTable.schema["attach"]
      await AttachmentCleanup.tableUpdate(
        originalTable,
        [{}, { attach: undefined }],
        {
          oldTable: tableGenerator(),
        }
      )
      expect(mockedDeleteFiles).not.toHaveBeenCalled()
    })
  }
)
