import { FieldType, Table, ViewV2 } from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import sdk from "../../.."

describe("table sdk", () => {
  describe("enrichViewSchemas", () => {
    describe("fetch", () => {
      const basicTable: Table = {
        _id: generator.guid(),
        name: "TestTable",
        type: "table",
        schema: {
          name: {
            type: FieldType.STRING,
            name: "name",
            visible: true,
            width: 80,
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
        const view: ViewV2 = {
          version: 2,
          id: generator.guid(),
          name: generator.guid(),
          tableId,
        }
        const res = sdk.tables.enrichViewSchemas({
          ...basicTable,
          views: { [view.name]: view },
        })

        expect(res).toEqual({
          ...basicTable,
          views: {
            [view.name]: {
              ...view,
              schema: {
                name: {
                  type: "string",
                  name: "name",
                  visible: true,
                  width: 80,
                  constraints: {
                    type: "string",
                  },
                },
                description: {
                  type: "string",
                  name: "description",
                  visible: true,
                  width: 200,
                  constraints: {
                    type: "string",
                  },
                },
                id: {
                  type: "number",
                  name: "id",
                  visible: true,
                  constraints: {
                    type: "number",
                  },
                },
                hiddenField: {
                  type: "string",
                  name: "hiddenField",
                  visible: false,
                  constraints: {
                    type: "string",
                  },
                },
              },
            },
          },
        })
      })

      it("if view schema only defines visiblility, should only fetch the selected fields", async () => {
        const tableId = basicTable._id!
        const view: ViewV2 = {
          version: 2,
          id: generator.guid(),
          name: generator.guid(),
          tableId,
          columns: {
            name: { visible: true },
            id: { visible: true },
            description: { visible: false },
          },
        }

        const res = sdk.tables.enrichViewSchemas({
          ...basicTable,
          views: { [view.name]: view },
        })

        expect(res).toEqual(
          expect.objectContaining({
            ...basicTable,
            views: {
              [view.name]: {
                ...view,
                schema: {
                  name: {
                    type: "string",
                    name: "name",
                    visible: true,
                    width: 80,
                    constraints: {
                      type: "string",
                    },
                  },
                  id: {
                    type: "number",
                    name: "id",
                    visible: true,
                    constraints: {
                      type: "number",
                    },
                  },
                },
              },
            },
          })
        )
      })

      it("schema does not break if the view has corrupted columns", async () => {
        const tableId = basicTable._id!
        const view: ViewV2 = {
          version: 2,
          id: generator.guid(),
          name: generator.guid(),
          tableId,
          columns: { unnexisting: { visible: true }, name: { visible: true } },
        }

        const res = sdk.tables.enrichViewSchemas({
          ...basicTable,
          views: { [view.name]: view },
        })

        expect(res).toEqual(
          expect.objectContaining({
            ...basicTable,
            views: {
              [view.name]: {
                ...view,
                schema: {
                  name: {
                    type: "string",
                    name: "name",
                    visible: true,
                    width: 80,
                    constraints: {
                      type: "string",
                    },
                  },
                },
              },
            },
          })
        )
      })
    })
  })
})
