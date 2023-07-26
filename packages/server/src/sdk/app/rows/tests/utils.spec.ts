import { generator } from "@budibase/backend-core/tests"
import { FieldType, Table, ViewV2 } from "@budibase/types"
jest.mock("../../../../sdk", () => ({
  views: { get: jest.fn() },
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
  const view: ViewV2 = {
    version: 2,
    id: generator.guid(),
    name: generator.guid(),
    tableId: generator.guid(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("trimViewFields", () => {
    beforeEach(() => {
      mockGetView.mockResolvedValue(view)
    })

    it("when no columns are defined, same data is returned", async () => {
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
  })
})
