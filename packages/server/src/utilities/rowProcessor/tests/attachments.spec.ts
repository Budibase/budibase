import { AttachmentCleanup } from "../attachments"
import { FieldType, Table, Row, TableSourceType } from "@budibase/types"
import { DEFAULT_BB_DATASOURCE_ID } from "../../../constants"
import { objectStore, db, context } from "@budibase/backend-core"
import * as uuid from "uuid"

const BUCKET = "prod-budi-app-assets"
const FILE_NAME = "file/thing.jpg"
const DEV_APPID = "abc_dev_123"
const PROD_APPID = "abc_123"

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
      isProdAppID: jest.fn(),
      getProdAppID: jest.fn(),
      dbExists: jest.fn(),
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
      signature: {
        name: "signature",
        type: FieldType.SIGNATURE,
        constraints: {},
      },
    },
  }
}

function rowSignature(fieldName: string = "signature") {
  return {
    [fieldName]: [
      {
        size: 1,
        extension: "png",
        key: `${uuid.v4()}.png`,
      },
    ],
  }
}

function rowAttachment(fileKey: string = FILE_NAME): Row {
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

describe("attachment/signature cleanup", () => {
  beforeEach(() => {
    mockedDeleteFiles.mockClear()
    jest.resetAllMocks()

    jest.spyOn(context, "getAppId").mockReturnValue(DEV_APPID)
    jest.spyOn(db, "isProdAppID").mockReturnValue(false)
    jest.spyOn(db, "getProdAppID").mockReturnValue(PROD_APPID)
    jest.spyOn(db, "dbExists").mockReturnValue(Promise.resolve(false))
  })

  // Ignore calls to prune attachments when app is in production.
  it("should not attempt to delete attachments/signatures if a published app exists", async () => {
    jest.spyOn(db, "dbExists").mockReturnValue(Promise.resolve(true))
    const targetRow = {
      ...rowAttachment(),
      ...rowSignature(),
    }
    const originalTable = table()
    delete originalTable.schema["attach"]
    await AttachmentCleanup.tableUpdate(originalTable, [targetRow], {
      oldTable: table(),
    })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("should be able to cleanup a table update", async () => {
    const originalTable = table()
    delete originalTable.schema["attach"]
    await AttachmentCleanup.tableUpdate(originalTable, [rowAttachment()], {
      oldTable: table(),
    })
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
  })

  it("should be able to cleanup a table deletion", async () => {
    const targetRow = {
      ...rowAttachment(),
      ...rowSignature(),
    }
    await AttachmentCleanup.tableDelete(table(), [targetRow])
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [
      FILE_NAME,
      targetRow.signature[0].key,
    ])
  })

  it("should handle table attachment column renaming", async () => {
    const targetRow = {
      ...rowAttachment(),
      ...rowSignature(),
    }
    const updatedTable = table()
    updatedTable.schema.attach2 = updatedTable.schema.attach
    delete updatedTable.schema.attach
    await AttachmentCleanup.tableUpdate(updatedTable, [targetRow], {
      oldTable: table(),
      rename: { old: "attach", updated: "attach2" },
    })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("should handle table signature column renaming", async () => {
    const targetRow = {
      ...rowAttachment(),
      ...rowSignature(),
    }
    const updatedTable = table()
    updatedTable.schema.signaturex = updatedTable.schema.signature
    delete updatedTable.schema.signature
    await AttachmentCleanup.tableUpdate(updatedTable, [targetRow], {
      oldTable: table(),
      rename: { old: "signature", updated: "signaturex" },
    })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("shouldn't cleanup if no table changes", async () => {
    const targetRow = {
      ...rowAttachment(),
      ...rowSignature(),
    }
    await AttachmentCleanup.tableUpdate(table(), [targetRow], {
      oldTable: table(),
    })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("should handle row updates, remove attachment", async () => {
    const targetRow = {
      ...rowAttachment(),
      ...rowSignature(),
    }
    const updatedRow = targetRow
    delete updatedRow.attach
    await AttachmentCleanup.rowUpdate(table(), {
      row: updatedRow,
      oldRow: rowAttachment(),
    })
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
  })

  it("should handle row updates, remove signature", async () => {
    const targetRow = {
      ...rowAttachment(),
      ...rowSignature(),
    }
    const updatedRow = { ...targetRow }
    delete updatedRow.signature
    await AttachmentCleanup.rowUpdate(table(), {
      row: updatedRow,
      oldRow: targetRow,
    })
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [
      targetRow.signature[0].key,
    ])
  })

  it("should handle row deletion, prune attachment", async () => {
    const targetRow = {
      ...rowAttachment(),
    }
    await AttachmentCleanup.rowDelete(table(), [targetRow])
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [FILE_NAME])
  })

  it("should handle row deletion, prune signature", async () => {
    const targetRow = {
      ...rowSignature(),
    }
    await AttachmentCleanup.rowDelete(table(), [targetRow])
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [
      targetRow.signature[0].key,
    ])
  })

  it("should handle row deletion, prune attachment AND signature", async () => {
    const targetRow = {
      ...rowAttachment(),
      ...rowSignature(),
    }
    await AttachmentCleanup.rowDelete(table(), [targetRow])
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [
      FILE_NAME,
      targetRow.signature[0].key,
    ])
  })

  it("should handle row deletion and not throw when attachments are undefined", async () => {
    await AttachmentCleanup.rowDelete(table(), [
      {
        attach: undefined,
      },
    ])
  })

  it("should handle row deletion and not throw when signatures are undefined", async () => {
    await AttachmentCleanup.rowDelete(table(), [
      {
        signature: undefined,
      },
    ])
  })

  it("shouldn't cleanup attachments if row isn't updated", async () => {
    await AttachmentCleanup.rowUpdate(table(), {
      row: rowAttachment(),
      oldRow: rowAttachment(),
    })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("shouldn't cleanup signature if row isn't updated", async () => {
    const targetRow = rowSignature()
    await AttachmentCleanup.rowUpdate(table(), {
      row: targetRow,
      oldRow: targetRow,
    })
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })

  it("should be able to cleanup a column and not throw when attachments are undefined", async () => {
    const originalTable = table()
    delete originalTable.schema["attach"]
    await AttachmentCleanup.tableUpdate(
      originalTable,
      [rowAttachment("file 1"), { attach: undefined }, rowAttachment("file 2")],
      {
        oldTable: table(),
      }
    )
    expect(mockedDeleteFiles).toHaveBeenCalledTimes(1)
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, ["file 1", "file 2"])
  })

  it("should be able to cleanup a column and not throw when signatures are undefined", async () => {
    const originalTable = table()
    delete originalTable.schema["signature"]

    const sig1 = rowSignature()
    const sig2 = rowSignature()
    await AttachmentCleanup.tableUpdate(
      originalTable,
      [sig1, { signature: undefined }, sig2],
      {
        oldTable: table(),
      }
    )
    expect(mockedDeleteFiles).toHaveBeenCalledTimes(1)
    expect(mockedDeleteFiles).toHaveBeenCalledWith(BUCKET, [
      sig1.signature[0].key,
      sig2.signature[0].key,
    ])
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

  it("should be able to cleanup a column and not throw when ALL signatures are undefined", async () => {
    const originalTable = table()
    delete originalTable.schema["signature"]
    await AttachmentCleanup.tableUpdate(
      originalTable,
      [{}, { signature: undefined }],
      {
        oldTable: table(),
      }
    )
    expect(mockedDeleteFiles).not.toHaveBeenCalled()
  })
})
