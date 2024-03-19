import {
  FieldSubtype,
  FieldType,
  FieldTypeSubtypes,
  INTERNAL_TABLE_SOURCE_ID,
  RowAttachment,
  Table,
  TableSourceType,
} from "@budibase/types"
import { outputProcessing } from ".."
import { generator, structures } from "@budibase/backend-core/tests"
import * as bbReferenceProcessor from "../bbReferenceProcessor"

jest.mock("../bbReferenceProcessor", (): typeof bbReferenceProcessor => ({
  processInputBBReferences: jest.fn(),
  processOutputBBReferences: jest.fn(),
}))

describe("rowProcessor - outputProcessing", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const processOutputBBReferencesMock =
    bbReferenceProcessor.processOutputBBReferences as jest.Mock

  it("fetches bb user references given a populated field", async () => {
    const table: Table = {
      _id: generator.guid(),
      name: "TestTable",
      type: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        name: {
          type: FieldType.STRING,
          name: "name",
          constraints: {
            presence: true,
            type: "string",
          },
        },
        user: {
          type: FieldType.BB_REFERENCE,
          subtype: FieldTypeSubtypes.BB_REFERENCE.USER,
          name: "user",
          constraints: {
            presence: false,
            type: "string",
          },
        },
      },
    }

    const row = {
      name: "Jack",
      user: "123",
    }

    const user = structures.users.user()
    processOutputBBReferencesMock.mockResolvedValue(user)

    const result = await outputProcessing(table, row, { squash: false })

    expect(result).toEqual({ name: "Jack", user })

    expect(
      bbReferenceProcessor.processOutputBBReferences
    ).toHaveBeenCalledTimes(1)
    expect(bbReferenceProcessor.processOutputBBReferences).toHaveBeenCalledWith(
      "123",
      FieldSubtype.USER
    )
  })

  it("should handle attachments correctly", async () => {
    const table: Table = {
      _id: generator.guid(),
      name: "TestTable",
      type: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        attach: {
          type: FieldType.ATTACHMENT,
          name: "attach",
          constraints: {},
        },
      },
    }

    const row: { attach: RowAttachment[] } = {
      attach: [
        {
          size: 10,
          name: "test",
          extension: "jpg",
          key: "test.jpg",
        },
      ],
    }

    const output = await outputProcessing(table, row, { squash: false })
    expect(output.attach[0].url).toBe(
      "/files/signed/prod-budi-app-assets/test.jpg"
    )

    row.attach[0].url = ""
    const output2 = await outputProcessing(table, row, { squash: false })
    expect(output2.attach[0].url).toBe(
      "/files/signed/prod-budi-app-assets/test.jpg"
    )

    row.attach[0].url = "aaaa"
    const output3 = await outputProcessing(table, row, { squash: false })
    expect(output3.attach[0].url).toBe("aaaa")
  })

  it("process output even when the field is not empty", async () => {
    const table: Table = {
      _id: generator.guid(),
      name: "TestTable",
      type: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        name: {
          type: FieldType.STRING,
          name: "name",
          constraints: {
            presence: true,
            type: "string",
          },
        },
        user: {
          type: FieldType.BB_REFERENCE,
          subtype: FieldTypeSubtypes.BB_REFERENCE.USER,
          name: "user",
          constraints: {
            presence: false,
            type: "string",
          },
        },
      },
    }

    const row = {
      name: "Jack",
    }

    const result = await outputProcessing(table, row, { squash: false })

    expect(result).toEqual({ name: "Jack" })

    expect(
      bbReferenceProcessor.processOutputBBReferences
    ).toHaveBeenCalledTimes(1)
  })

  it("does not fetch bb references when not in the schema", async () => {
    const table: Table = {
      _id: generator.guid(),
      name: "TestTable",
      type: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        name: {
          type: FieldType.STRING,
          name: "name",
          constraints: {
            presence: true,
            type: "string",
          },
        },
        user: {
          type: FieldType.NUMBER,
          name: "user",
          constraints: {
            presence: false,
            type: "string",
          },
        },
      },
    }

    const row = {
      name: "Jack",
      user: "123",
    }

    const result = await outputProcessing(table, row, { squash: false })

    expect(result).toEqual({ name: "Jack", user: "123" })

    expect(
      bbReferenceProcessor.processOutputBBReferences
    ).not.toHaveBeenCalled()
  })
})
