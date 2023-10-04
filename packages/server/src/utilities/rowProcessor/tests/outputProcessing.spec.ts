import {
  FieldSubtype,
  FieldType,
  FieldTypeSubtypes,
  Table,
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

    expect(bbReferenceProcessor.processOutputBBReferences).toBeCalledTimes(1)
    expect(bbReferenceProcessor.processOutputBBReferences).toBeCalledWith(
      "123",
      FieldSubtype.USER
    )
  })

  it("process output even when the field is not empty", async () => {
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

    const row = {
      name: "Jack",
    }

    const result = await outputProcessing(table, row, { squash: false })

    expect(result).toEqual({ name: "Jack" })

    expect(bbReferenceProcessor.processOutputBBReferences).toBeCalledTimes(1)
  })

  it("does not fetch bb references when not in the schema", async () => {
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

    expect(bbReferenceProcessor.processOutputBBReferences).not.toBeCalled()
  })
})
