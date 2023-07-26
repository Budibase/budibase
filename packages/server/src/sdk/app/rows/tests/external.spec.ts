import { generator } from "@budibase/backend-core/tests"
import { FieldType, Operation, Table } from "@budibase/types"
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
    beforeEach(() => {
      mockGetTable.mockResolvedValue(table)
    })

    it("patching a row from a table will submit the requested fields", async () => {
      const tableId = generator.guid()
      const patchData = {
        _id: generator.guid(),
        name: generator.name(),
        age: generator.age(),
        address: generator.address(),
      }

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

      expect(mockTrimViewFields).not.toBeCalled()
    })

    it("patching a row from a view will submit the requested fields", async () => {
      const tableId = generator.guid()
      const patchData = {
        _id: generator.guid(),
        _viewId: generator.guid(),
        name: generator.name(),
        age: generator.age(),
        address: generator.address(),
      }

      const trimmedRow = {
        name: patchData.name,
        age: patchData.age,
      }
      mockTrimViewFields.mockResolvedValue(trimmedRow)
      mockRowsValidate.mockResolvedValue({ valid: true, errors: [] })

      await patch(tableId, patchData)

      expect(mockTrimViewFields).toBeCalledTimes(1)
      expect(mockTrimViewFields).toBeCalledWith(patchData._viewId, table, {
        name: patchData.name,
        age: patchData.age,
        address: patchData.address,
      })

      // Ensure we don't persist _viewId
      expect(mockHandleRequest).not.toHaveBeenCalledWith(
        Operation.UPDATE,
        expect.anything(),
        expect.objectContaining({
          row: expect.objectContaining({ _viewId: expect.anything() }),
        })
      )

      expect(mockHandleRequest).toHaveBeenCalledWith(
        Operation.UPDATE,
        tableId,
        {
          id: [patchData._id],
          row: {
            name: patchData.name,
            age: patchData.age,
          },
        }
      )
    })
  })
})
