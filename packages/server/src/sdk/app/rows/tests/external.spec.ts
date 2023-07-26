import { generator } from "@budibase/backend-core/tests"
import { FieldType, Operation, Row, Table } from "@budibase/types"
import { patch } from "../external"

jest.mock("../../../../sdk", () => ({
  tables: { getTable: jest.fn() },
  rows: { utils: { trimViewFields: jest.fn(), validate: jest.fn() } },
}))
jest.mock("../../../../api/controllers/row/external")
import sdk from "../../../../sdk"
import { handleRequest } from "../../../../api/controllers/row/external"

const mockGetTable = sdk.tables.getTable as jest.MockedFunction<
  typeof sdk.tables.getTable
>
const mockTrimViewFields = sdk.rows.utils.trimViewFields as jest.MockedFunction<
  typeof sdk.rows.utils.trimViewFields
>
const mockRowsValidate = sdk.rows.utils.validate as jest.MockedFunction<
  typeof sdk.rows.utils.validate
>
const mockHandleRequest = handleRequest as jest.MockedFunction<
  typeof handleRequest
>

describe("external", () => {
  const table: Table = {
    name: generator.word(),
    type: "table",
    schema: {
      name: {
        name: "name",
        type: FieldType.STRING,
      },
      age: {
        name: "age",
        type: FieldType.NUMBER,
      },
      address: {
        name: "address",
        type: FieldType.STRING,
      },
    },
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("patch", () => {
    beforeAll(() => {
      mockGetTable.mockResolvedValue(table)
    })

    it("patching a row from a table will submit the requested fields", async () => {
      const tableId = generator.guid()
      const patchData: Row = {
        _id: generator.guid(),
        name: generator.name(),
        age: generator.age(),
        address: generator.address(),
      }

      const trimmedRow: Row = {
        name: patchData.name,
        age: patchData.age,
      }
      mockTrimViewFields.mockResolvedValue(trimmedRow)
      mockRowsValidate.mockResolvedValue({ valid: true, errors: [] })

      await patch(tableId, patchData)

      expect(mockHandleRequest).toHaveBeenCalledTimes(2)
      expect(mockHandleRequest).toHaveBeenCalledWith(
        Operation.UPDATE,
        tableId,
        {
          id: [patchData._id],
          row: {
            name: patchData.name,
            age: patchData.age,
            address: patchData.address,
          },
        }
      )
      expect(mockHandleRequest).toHaveBeenCalledWith(
        Operation.READ,
        tableId,
        expect.anything()
      )
    })
  })
})
