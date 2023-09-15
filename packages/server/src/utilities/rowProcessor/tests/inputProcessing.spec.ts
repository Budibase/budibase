import { inputProcessing } from ".."
import { generator, structures } from "@budibase/backend-core/tests"
import { FieldType, FieldTypeSubtypes, Table } from "@budibase/types"
import * as bbReferenceProcessor from "../bbReferenceProcessor"

jest.mock("../bbReferenceProcessor", (): typeof bbReferenceProcessor => ({
  processInputBBReferences: jest.fn(),
  processOutputBBReferences: jest.fn(),
}))

describe("rowProcessor - inputProcessing", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("processes BB references if on the schema and it's populated", async () => {
    const userId = generator.guid()

    const table: Table = {
      _id: generator.guid(),
      name: "TestTable",
      type: "table",
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

    ;(
      bbReferenceProcessor.processInputBBReferences as jest.Mock
    ).mockResolvedValue(user)

    const { row } = await inputProcessing(userId, table, newRow)

    expect(bbReferenceProcessor.processInputBBReferences).toBeCalledTimes(1)
    expect(bbReferenceProcessor.processInputBBReferences).toBeCalledWith(
      "123",
      "user"
    )

    expect(row).toEqual({ ...newRow, user })
  })

  it("it does not process BB references if on the schema but it is not populated", async () => {
    const userId = generator.guid()

    const table: Table = {
      _id: generator.guid(),
      name: "TestTable",
      type: "table",
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

    const newRow = {
      name: "Jack",
    }

    const { row } = await inputProcessing(userId, table, newRow)

    expect(bbReferenceProcessor.processInputBBReferences).not.toBeCalled()
    expect(row).toEqual({ ...newRow, user: undefined })
  })

  it.each([undefined, null, ""])(
    "it does not process BB references the field is $%",
    async userValue => {
      const userId = generator.guid()

      const table: Table = {
        _id: generator.guid(),
        name: "TestTable",
        type: "table",
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

      const newRow = {
        name: "Jack",
        user: userValue,
      }

      const { row } = await inputProcessing(userId, table, newRow)

      expect(bbReferenceProcessor.processInputBBReferences).not.toBeCalled()
      expect(row).toEqual(newRow)
    }
  )

  it("it does not process BB references if not in the schema", async () => {
    const userId = generator.guid()

    const table: Table = {
      _id: generator.guid(),
      name: "TestTable",
      type: "table",
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

    const { row } = await inputProcessing(userId, table, newRow)

    expect(bbReferenceProcessor.processInputBBReferences).not.toBeCalled()
    expect(row).toEqual({
      name: "Jack",
      user: 123,
    })
  })
})
