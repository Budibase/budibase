import {
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  Table,
  TableSourceType,
  ViewV2,
} from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import sdk from "../../.."

jest.mock("../../views", () => ({
  ...jest.requireActual("../../views"),
  enrichSchema: jest.fn().mockImplementation(v => ({ ...v, mocked: true })),
}))

describe("table sdk", () => {
  describe("enrichViewSchemas", () => {
    const basicTable: Table = {
      _id: generator.guid(),
      name: "TestTable",
      type: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        name: {
          type: FieldType.STRING,
          name: "name",
          visible: true,
          width: 80,
          order: 2,
          constraints: {
            type: "string",
          },
        },
        description: {
          type: FieldType.STRING,
          name: "description",
          visible: true,
          width: 200,
          constraints: {
            type: "string",
          },
        },
        id: {
          type: FieldType.NUMBER,
          name: "id",
          visible: true,
          order: 1,
          constraints: {
            type: "number",
          },
        },
        hiddenField: {
          type: FieldType.STRING,
          name: "hiddenField",
          visible: false,
          constraints: {
            type: "string",
          },
        },
      },
    }

    it("should fetch the default schema if not overriden", async () => {
      const tableId = basicTable._id!
      function getTable() {
        const view: ViewV2 = {
          version: 2,
          id: generator.guid(),
          name: generator.guid(),
          tableId,
        }
        return view
      }
      const view1 = getTable()
      const view2 = getTable()
      const view3 = getTable()
      const res = await sdk.tables.enrichViewSchemas({
        ...basicTable,
        views: {
          [view1.name]: view1,
          [view2.name]: view2,
          [view3.name]: view3,
        },
      })

      expect(sdk.views.enrichSchema).toHaveBeenCalledTimes(3)

      expect(res).toEqual({
        ...basicTable,
        views: {
          [view1.name]: {
            ...view1,
            mocked: true,
          },
          [view2.name]: {
            ...view2,
            mocked: true,
          },
          [view3.name]: {
            ...view3,
            mocked: true,
          },
        },
      })
    })
  })
})
