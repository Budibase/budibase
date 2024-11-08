import { inputProcessing } from ".."
import { generator, structures } from "@budibase/backend-core/tests"
import {
  FieldType,
  BBReferenceFieldSubType,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableSourceType,
} from "@budibase/types"
import * as bbReferenceProcessor from "../bbReferenceProcessor"

jest.mock("../bbReferenceProcessor", (): typeof bbReferenceProcessor => ({
  processInputBBReference: jest.fn(),
  processInputBBReferences: jest.fn(),
  processOutputBBReference: jest.fn(),
  processOutputBBReferences: jest.fn(),
}))

describe("rowProcessor - inputProcessing", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const processInputBBReferenceMock =
    bbReferenceProcessor.processInputBBReference as jest.Mock
  const processInputBBReferencesMock =
    bbReferenceProcessor.processInputBBReferences as jest.Mock

  it("processes single BB references if on the schema and it's populated", async () => {
    const userId = generator.guid()

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
          type: FieldType.BB_REFERENCE_SINGLE,
          subtype: BBReferenceFieldSubType.USER,
          name: "user",
          constraints: {
            presence: true,
            type: "string",
          },
        },
      },
    }

    const newRow = {
      name: "Jack",
      user: "123",
    }

    const user = structures.users.user()

    processInputBBReferenceMock.mockResolvedValue(user)

    const row = await inputProcessing(userId, table, newRow)

    expect(bbReferenceProcessor.processInputBBReference).toHaveBeenCalledTimes(
      1
    )
    expect(bbReferenceProcessor.processInputBBReference).toHaveBeenCalledWith(
      "123",
      "user"
    )

    expect(row).toEqual({ ...newRow, user })
  })

  it("processes multiple BB references if on the schema and it's populated", async () => {
    const userId = generator.guid()

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
          subtype: BBReferenceFieldSubType.USER,
          name: "user",
          constraints: {
            presence: true,
            type: "array",
          },
        },
      },
    }

    const newRow = {
      name: "Jack",
      user: "123",
    }

    const user = structures.users.user()

    processInputBBReferencesMock.mockResolvedValue(user)

    const row = await inputProcessing(userId, table, newRow)

    expect(bbReferenceProcessor.processInputBBReferences).toHaveBeenCalledTimes(
      1
    )
    expect(bbReferenceProcessor.processInputBBReferences).toHaveBeenCalledWith(
      "123",
      "user"
    )

    expect(row).toEqual({ ...newRow, user })
  })

  it("does not process BB references if on the schema but it is not populated", async () => {
    const userId = generator.guid()

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
          subtype: BBReferenceFieldSubType.USER,
          name: "user",
          constraints: {
            presence: false,
            type: "array",
          },
        },
      },
    }

    const newRow = {
      name: "Jack",
    }

    const row = await inputProcessing(userId, table, newRow)

    expect(bbReferenceProcessor.processInputBBReferences).not.toHaveBeenCalled()
    expect(row).toEqual({ ...newRow, user: undefined })
  })

  it.each([undefined, null, ""])(
    "does not process BB references the field is $%",
    async userValue => {
      const userId = generator.guid()

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
            subtype: BBReferenceFieldSubType.USER,
            name: "user",
            constraints: {
              presence: false,
              type: "array",
            },
          },
        },
      }

      const newRow = {
        name: "Jack",
        user: userValue,
      }

      const row = await inputProcessing(userId, table, newRow)

      if (userValue === undefined) {
        // The 'user' field is omitted
        expect(row).toEqual({
          name: "Jack",
        })
      } else {
        // The update is processed if null or "". 'user' is changed to an empty array.
        expect(row).toEqual({
          name: "Jack",
          user: [],
        })
      }

      expect(
        bbReferenceProcessor.processInputBBReferences
      ).not.toHaveBeenCalled()
    }
  )

  it("does not process BB references if not in the schema", async () => {
    const userId = generator.guid()

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
            presence: true,
            type: "string",
          },
        },
      },
    }

    const newRow = {
      name: "Jack",
      user: "123",
    }

    const row = await inputProcessing(userId, table, newRow)

    expect(bbReferenceProcessor.processInputBBReferences).not.toHaveBeenCalled()
    expect(row).toEqual({
      name: "Jack",
      user: 123,
    })
  })
})
