import { generator } from "@budibase/backend-core/tests"
import { FieldType, Table } from "@budibase/types"
jest.mock("../../../../sdk", () => ({
  views: {
    ...jest.requireActual("../../../../sdk/app/views"),
    get: jest.fn(),
  },
}))

import sdk from "../../../../sdk"
import { trimViewFields } from "../utils"

const mockGetView = sdk.views.get as jest.MockedFunction<typeof sdk.views.get>

describe("utils", () => {
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

  describe("trimViewFields", () => {
    it("when no columns are defined, same data is returned", async () => {
      mockGetView.mockResolvedValue({
        version: 2,
        id: generator.guid(),
        name: generator.guid(),
        tableId: generator.guid(),
      })

      const viewId = generator.guid()
      const data = {
        _id: generator.guid(),
        name: generator.name(),
        age: generator.age(),
        address: generator.address(),
      }

      const result = await trimViewFields(viewId, table, data)

      expect(result).toBe(data)
    })

    it("when columns are defined, trim data is returned", async () => {
      mockGetView.mockResolvedValue({
        version: 2,
        id: generator.guid(),
        name: generator.guid(),
        tableId: generator.guid(),
        columns: {
          name: { visible: true },
          address: { visible: true },
          age: { visible: false },
        },
      })

      const viewId = generator.guid()
      const data = {
        _id: generator.guid(),
        name: generator.name(),
        age: generator.age(),
        address: generator.address(),
      }

      const result = await trimViewFields(viewId, table, data)

      expect(result).toEqual({
        name: data.name,
        address: data.address,
      })
    })
  })
})
