import { context, db, objectStore } from "@budibase/backend-core"
import { FieldType, Row, Table, TableSourceType } from "@budibase/types"
import * as uuid from "uuid"
import { DEFAULT_BB_DATASOURCE_ID } from "../../../constants"
import { AttachmentCleanup } from "../attachments"

const BUCKET = "prod-budi-app-assets"
const FILE_NAME = "file/thing.jpg"
const DEV_WORKSPACEID = "abc_dev_123"
const PROD_WORKSPACEID = "abc_123"
const TABLE_ID = "table_123"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getAppId: jest.fn(),
    },
    objectStore: {
      deleteFiles: jest.fn(),
      ObjectStoreBuckets: actual.objectStore.ObjectStoreBuckets,
    },
    db: {
      isProdWorkspaceID: jest.fn(),
      getProdWorkspaceID: jest.fn(),
      dbExists: jest.fn(),
      getDB: jest.fn(),
    },
  }
})

const mockedDeleteFiles = objectStore.deleteFiles as jest.MockedFunction<
  typeof objectStore.deleteFiles
>

let mockProdDb: { get: jest.Mock }

const rowGenerators: [
  string,
  (
    | FieldType.ATTACHMENT_SINGLE
    | FieldType.ATTACHMENTS
    | FieldType.SIGNATURE_SINGLE
  ),
  string,
  (fileKey?: string, overrides?: Partial<Row>) => Row,
][] = [
  [
    "row with a attachment list column",
    FieldType.ATTACHMENTS,
    "attach",
    function rowWithAttachments(
      fileKey: string = FILE_NAME,
      overrides: Partial<Row> = {}
    ): Row {
      const base: Row = {
        _id: overrides._id || `row_${uuid.v4()}`,
        tableId: overrides.tableId || TABLE_ID,
        attach: [
          {
            size: 1,
            extension: "jpg",
            key: fileKey,
          },
        ],
      }
      return {
        ...base,
        ...overrides,
      }
    },
  ],
  [
    "row with a single attachment column",
    FieldType.ATTACHMENT_SINGLE,
    "attach",
    function rowWithAttachments(
      fileKey: string = FILE_NAME,
      overrides: Partial<Row> = {}
    ): Row {
      const base: Row = {
        _id: overrides._id || `row_${uuid.v4()}`,
        tableId: overrides.tableId || TABLE_ID,
        attach: {
          size: 1,
          extension: "jpg",
          key: fileKey,
        },
      }
      return {
        ...base,
        ...overrides,
      }
    },
  ],
  [
    "row with a single signature column",
    FieldType.SIGNATURE_SINGLE,
    "signature",
    function rowWithSignature(
      _fileKey?: string,
      overrides: Partial<Row> = {}
    ): Row {
      const base: Row = {
        _id: overrides._id || `row_${uuid.v4()}`,
        tableId: overrides.tableId || TABLE_ID,
        signature: {
          size: 1,
          extension: "png",
          key: `${uuid.v4()}.png`,
        },
      }
      return {
        ...base,
        ...overrides,
      }
    },
  ],
]

describe.each(rowGenerators)(
  "attachment cleanup",
  (_, attachmentFieldType, colKey, rowGenerator) => {
    function tableGenerator(): Table {
      return {
        _id: TABLE_ID,
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
          signature: {
            name: "signature",
            type: FieldType.SIGNATURE_SINGLE,
            constraints: {},
          },
        },
      }
    }

    const getRowKeys = (row: any, col: string) => {
      return Array.isArray(row[col])
        ? row[col].map((entry: any) => entry.key)
        : [row[col]?.key]
    }

    beforeEach(() => {
      mockedDeleteFiles.mockClear()
      jest.resetAllMocks()

      jest.spyOn(context, "getWorkspaceId").mockReturnValue(DEV_WORKSPACEID)
      jest.spyOn(db, "isProdWorkspaceID").mockReturnValue(false)
      jest.spyOn(db, "getProdWorkspaceID").mockReturnValue(PROD_WORKSPACEID)
      jest.spyOn(db, "dbExists").mockReturnValue(Promise.resolve(false))
      mockProdDb = {
        get: jest.fn().mockRejectedValue({ status: 404 }),
      }
      ;(db.getDB as jest.Mock).mockReturnValue(mockProdDb)
    })

    // Ignore calls to prune attachments when app is in production.
    it(`${attachmentFieldType} - should not attempt to delete attachments/signatures if production rows still reference them`, async () => {
      jest.spyOn(db, "dbExists").mockReturnValue(Promise.resolve(true))
      const originalTable = tableGenerator()
      delete originalTable.schema[colKey]
      const targetRow = rowGenerator()
      mockProdDb.get.mockResolvedValueOnce({
        _id: targetRow._id,
        tableId: targetRow.tableId,
        [colKey]: targetRow[colKey],
      })
      await AttachmentCleanup.tableUpdate(originalTable, [targetRow], {
        oldTable: tableGenerator(),
      })
      expect(mockedDeleteFiles).not.toHaveBeenCalled()
    })

    it(`${attachmentFieldType} - should cleanup attachments if production rows no longer reference them`, async () => {
      jest.spyOn(db, "dbExists").mockReturnValue(Promise.resolve(true))
      const updatedTable = tableGenerator()
      delete updatedTable.schema[colKey]
      const targetRow = rowGenerator()
      mockProdDb.get.mockResolvedValueOnce({
        _id: targetRow._id,
        tableId: targetRow.tableId,
      })

      await AttachmentCleanup.tableUpdate(updatedTable, [targetRow], {
        oldTable: tableGenerator(),
      })

      expect(mockedDeleteFiles).toHaveBeenCalledWith(
        BUCKET,
        getRowKeys(targetRow, colKey)
      )
    })

    it(`${attachmentFieldType} - should be able to cleanup a table update`, async () => {
      const originalTable = tableGenerator()
      delete originalTable.schema[colKey]
      const targetRow = rowGenerator()

      await AttachmentCleanup.tableUpdate(originalTable, [targetRow], {
        oldTable: tableGenerator(),
      })

      expect(mockedDeleteFiles).toHaveBeenCalledWith(
        BUCKET,
        getRowKeys(targetRow, colKey)
      )
    })

    it(`${attachmentFieldType} - should be able to cleanup a table deletion`, async () => {
      const targetRow = rowGenerator()
      await AttachmentCleanup.tableDelete(tableGenerator(), [targetRow])
      expect(mockedDeleteFiles).toHaveBeenCalledWith(
        BUCKET,
        getRowKeys(targetRow, colKey)
      )
    })

    it(`${attachmentFieldType} - should handle table column renaming`, async () => {
      const updatedTable = tableGenerator()
      updatedTable.schema.col2 = updatedTable.schema[colKey]
      delete updatedTable.schema.attach
      await AttachmentCleanup.tableUpdate(updatedTable, [rowGenerator()], {
        oldTable: tableGenerator(),
        rename: { old: colKey, updated: "col2" },
      })
      expect(mockedDeleteFiles).not.toHaveBeenCalled()
    })

    it(`${attachmentFieldType} - shouldn't cleanup if no table changes`, async () => {
      await AttachmentCleanup.tableUpdate(tableGenerator(), [rowGenerator()], {
        oldTable: tableGenerator(),
      })
      expect(mockedDeleteFiles).not.toHaveBeenCalled()
    })

    it(`${attachmentFieldType} - should handle row updates`, async () => {
      const updatedRow = rowGenerator()
      delete updatedRow[colKey]

      const targetRow = rowGenerator()
      await AttachmentCleanup.rowUpdate(tableGenerator(), {
        row: updatedRow,
        oldRow: targetRow,
      })

      expect(mockedDeleteFiles).toHaveBeenCalledWith(
        BUCKET,
        getRowKeys(targetRow, colKey)
      )
    })

    it(`${attachmentFieldType} - should handle row deletion`, async () => {
      const targetRow = rowGenerator()
      await AttachmentCleanup.rowDelete(tableGenerator(), [targetRow])
      expect(mockedDeleteFiles).toHaveBeenCalledWith(
        BUCKET,
        getRowKeys(targetRow, colKey)
      )
    })

    it(`${attachmentFieldType} - should handle row deletion, prune signature`, async () => {
      const targetRow = rowGenerator()
      await AttachmentCleanup.rowDelete(tableGenerator(), [targetRow])
      expect(mockedDeleteFiles).toHaveBeenCalledWith(
        BUCKET,
        getRowKeys(targetRow, colKey)
      )
    })

    it(`${attachmentFieldType} - should handle row deletion and not throw when attachments are undefined`, async () => {
      await AttachmentCleanup.rowDelete(tableGenerator(), [
        {
          [colKey]: undefined,
        },
      ])
    })

    it(`${attachmentFieldType} - shouldn't cleanup attachments if row not updated`, async () => {
      const targetRow = rowGenerator()
      await AttachmentCleanup.rowUpdate(tableGenerator(), {
        row: targetRow,
        oldRow: targetRow,
      })
      expect(mockedDeleteFiles).not.toHaveBeenCalled()
    })

    it(`${attachmentFieldType} - should be able to cleanup a column and not throw when attachments are undefined`, async () => {
      const originalTable = tableGenerator()
      delete originalTable.schema[colKey]
      const row1 = rowGenerator("file 1")
      const row2 = rowGenerator("file 2")
      await AttachmentCleanup.tableUpdate(
        originalTable,
        [row1, { [colKey]: undefined }, row2],
        {
          oldTable: tableGenerator(),
        }
      )
      const expectedKeys = [row1, row2].reduce((acc: string[], row) => {
        acc = [...acc, ...getRowKeys(row, colKey)]
        return acc
      }, [])
      expect(mockedDeleteFiles).toHaveBeenCalledTimes(1)
      expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, expectedKeys)
    })

    it(`${attachmentFieldType} - should be able to cleanup a column and not throw when ALL attachments are undefined`, async () => {
      const originalTable = tableGenerator()
      delete originalTable.schema[colKey]
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
