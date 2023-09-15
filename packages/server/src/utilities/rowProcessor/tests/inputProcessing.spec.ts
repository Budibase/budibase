import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { inputProcessing } from ".."
import { generator, structures } from "@budibase/backend-core/tests"
import { FieldType, FieldTypeSubtypes, Table } from "@budibase/types"
import * as bbReferenceProcessor from "../bbReferenceProcessor"

const config = new TestConfiguration()

jest.mock("../bbReferenceProcessor", (): typeof bbReferenceProcessor => ({
  processOutputBBReferences: jest.fn(),
}))

describe("rowProcessor - inputProcessing", () => {
  beforeAll(async () => {
    await config.init()
  })

  it("populate user BB references", async () => {
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
      bbReferenceProcessor.processOutputBBReferences as jest.Mock
    ).mockResolvedValue(user)

    const { row } = await inputProcessing(userId, table, newRow)

    expect(bbReferenceProcessor.processOutputBBReferences).toBeCalledTimes(1)
    expect(bbReferenceProcessor.processOutputBBReferences).toBeCalledWith(
      "123",
      "user"
    )

    expect(row).toEqual({ ...newRow, user })
  })
})
