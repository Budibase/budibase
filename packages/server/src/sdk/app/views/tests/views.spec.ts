import _ from "lodash"
import {
  FieldSchema,
  FieldType,
  Table,
  TableSchema,
  ViewV2,
} from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import { enrichSchema, syncSchema } from ".."

describe("table sdk", () => {
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

  describe("enrichViewSchemas", () => {
    it("should fetch the default schema if not overridden", async () => {
      const tableId = basicTable._id!
      const view: ViewV2 = {
        version: 2,
        id: generator.guid(),
        name: generator.guid(),
        tableId,
      }

      const res = enrichSchema(view, basicTable.schema)

      expect(res).toEqual({
        ...view,
        schema: {
          name: {
            type: "string",
            name: "name",
            visible: false,
            order: 2,
            width: 80,
            constraints: {
              type: "string",
            },
          },
          description: {
            type: "string",
            name: "description",
            visible: false,
            width: 200,
            constraints: {
              type: "string",
            },
          },
          id: {
            type: "number",
            name: "id",
            visible: false,
            order: 1,
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
      })
    })

    it("if view schema only defines columns, should only fetch the selected fields", async () => {
      const tableId = basicTable._id!
      const view: ViewV2 = {
        version: 2,
        id: generator.guid(),
        name: generator.guid(),
        tableId,
        schema: {
          name: { visible: true },
          id: { visible: true },
        },
      }

      const res = enrichSchema(view, basicTable.schema)

      expect(res).toEqual({
        ...view,
        schema: {
          name: {
            ...basicTable.schema.name,
            visible: true,
          },
          description: {
            ...basicTable.schema.description,
            visible: false,
          },
          id: {
            ...basicTable.schema.id,
            visible: true,
          },
          hiddenField: {
            ...basicTable.schema.hiddenField,
            visible: false,
          },
        },
      })
    })

    it("schema does not break if the view has corrupted columns", async () => {
      const tableId = basicTable._id!
      const view: ViewV2 = {
        version: 2,
        id: generator.guid(),
        name: generator.guid(),
        tableId,
        schema: {
          unnexisting: { visible: true },
          name: { visible: true },
        },
      }

      const res = enrichSchema(view, basicTable.schema)

      expect(res).toEqual({
        ...view,
        schema: {
          name: {
            ...basicTable.schema.name,
            visible: true,
          },
          description: {
            ...basicTable.schema.description,
            visible: false,
          },
          id: {
            ...basicTable.schema.id,
            visible: false,
          },
          hiddenField: {
            ...basicTable.schema.hiddenField,
            visible: false,
          },
        },
      })
    })

    it("if the view schema overrides the schema UI, the table schema should be overridden", async () => {
      const tableId = basicTable._id!
      const view: ViewV2 = {
        version: 2,
        id: generator.guid(),
        name: generator.guid(),
        tableId,
        schema: {
          name: { visible: true, width: 100 },
          id: { visible: true, width: 20 },
          description: { visible: false },
        },
      }

      const res = enrichSchema(view, basicTable.schema)

      expect(res).toEqual(
        expect.objectContaining({
          ...view,
          schema: {
            ...basicTable.schema,
            name: {
              type: "string",
              name: "name",
              order: 2,
              visible: true,
              width: 100,
              constraints: {
                type: "string",
              },
            },
            id: {
              type: "number",
              name: "id",
              order: 1,
              visible: true,
              width: 20,
              constraints: {
                type: "number",
              },
            },
            description: {
              type: "string",
              name: "description",
              visible: false,
              width: 200,
              constraints: {
                type: "string",
              },
            },
          },
        })
      )
    })

    it("if the view defines order, the table schema order should be ignored", async () => {
      const tableId = basicTable._id!
      const view: ViewV2 = {
        version: 2,
        id: generator.guid(),
        name: generator.guid(),
        tableId,
        schema: {
          name: { visible: true, order: 1 },
          id: { visible: true },
          description: { visible: true, order: 2 },
        },
      }

      const res = enrichSchema(view, basicTable.schema)

      expect(res).toEqual(
        expect.objectContaining({
          ...view,
          schema: {
            ...basicTable.schema,
            name: {
              type: "string",
              name: "name",
              order: 1,
              visible: true,
              width: 80,
              constraints: {
                type: "string",
              },
            },
            id: {
              type: "number",
              name: "id",
              order: undefined,
              visible: true,
              constraints: {
                type: "number",
              },
            },
            description: {
              type: "string",
              name: "description",
              order: 2,
              visible: true,
              width: 200,
              constraints: {
                type: "string",
              },
            },
          },
        })
      )
    })
  })

  describe("syncSchema", () => {
    const basicView: ViewV2 = {
      version: 2,
      id: generator.guid(),
      name: generator.guid(),
      tableId: basicTable._id!,
    }

    describe("view without schema", () => {
      it("no table schema changes will not amend the view", () => {
        const view: ViewV2 = {
          ...basicView,
        }
        const result = syncSchema(
          _.cloneDeep(view),
          basicTable.schema,
          undefined
        )
        expect(result).toEqual(view)
      })

      it("adding new columns will not change the view schema", () => {
        const view: ViewV2 = {
          ...basicView,
        }

        const newTableSchema: TableSchema = {
          ...basicTable.schema,
          newField1: {
            type: FieldType.STRING,
            name: "newField1",
            visible: true,
          },
          newField2: {
            type: FieldType.NUMBER,
            name: "newField2",
            visible: false,
          },
        }

        const result = syncSchema(_.cloneDeep(view), newTableSchema, undefined)
        expect(result).toEqual({
          ...view,
          schema: undefined,
        })
      })

      it("deleting columns will not change the view schema", () => {
        const view: ViewV2 = {
          ...basicView,
        }
        const { name, description, ...newTableSchema } = basicTable.schema

        const result = syncSchema(_.cloneDeep(view), newTableSchema, undefined)
        expect(result).toEqual({
          ...view,
          schema: undefined,
        })
      })

      it("renaming mapped columns will update the view column mapping", () => {
        const view: ViewV2 = {
          ...basicView,
        }
        const { description, ...newTableSchema } = {
          ...basicTable.schema,
          updatedDescription: {
            ...basicTable.schema.description,
            name: "updatedDescription",
          },
        } as TableSchema

        const result = syncSchema(_.cloneDeep(view), newTableSchema, {
          old: "description",
          updated: "updatedDescription",
        })
        expect(result).toEqual({
          ...view,
          schema: undefined,
        })
      })
    })

    describe("view with schema", () => {
      it("no table schema changes will not amend the view", () => {
        const view: ViewV2 = {
          ...basicView,
          schema: {
            name: { visible: true, width: 100 },
            id: { visible: true, width: 20 },
            description: { visible: false },
            hiddenField: { visible: false },
          },
        }
        const result = syncSchema(
          _.cloneDeep(view),
          basicTable.schema,
          undefined
        )
        expect(result).toEqual(view)
      })

      it("adding new columns will add them as not visible to the view", () => {
        const view: ViewV2 = {
          ...basicView,
          schema: {
            name: { visible: true, width: 100 },
            id: { visible: true, width: 20 },
            description: { visible: false },
            hiddenField: { visible: false },
          },
        }

        const newTableSchema: TableSchema = {
          ...basicTable.schema,
          newField1: {
            type: FieldType.STRING,
            name: "newField1",
            visible: true,
          },
          newField2: {
            type: FieldType.NUMBER,
            name: "newField2",
            visible: false,
          },
        }

        const result = syncSchema(_.cloneDeep(view), newTableSchema, undefined)
        expect(result).toEqual({
          ...view,
          schema: {
            ...view.schema,
            newField1: { visible: false },
            newField2: { visible: false },
          },
        })
      })

      it("deleting columns will remove them from the UI", () => {
        const view: ViewV2 = {
          ...basicView,
          schema: {
            name: { visible: true, width: 100 },
            id: { visible: true, width: 20 },
            description: { visible: false },
            hiddenField: { visible: false },
          },
        }
        const { name, description, ...newTableSchema } = basicTable.schema

        const result = syncSchema(_.cloneDeep(view), newTableSchema, undefined)
        expect(result).toEqual({
          ...view,
          schema: {
            ...view.schema,
            name: undefined,
            description: undefined,
          },
        })
      })

      it("can handle additions and deletions at the same them UI", () => {
        const view: ViewV2 = {
          ...basicView,
          schema: {
            name: { visible: true, width: 100 },
            id: { visible: true, width: 20 },
            description: { visible: false },
            hiddenField: { visible: false },
          },
        }
        const { name, description, ...newTableSchema } = {
          ...basicTable.schema,
          newField1: {
            type: FieldType.STRING,
            name: "newField1",
            visible: true,
          },
        } as TableSchema

        const result = syncSchema(_.cloneDeep(view), newTableSchema, undefined)
        expect(result).toEqual({
          ...view,
          schema: {
            ...view.schema,
            name: undefined,
            description: undefined,
            newField1: { visible: false },
          },
        })
      })

      it("renaming mapped columns will update the view column mapping and it's schema", () => {
        const view: ViewV2 = {
          ...basicView,
          schema: {
            name: { visible: true },
            id: { visible: true },
            description: { visible: true, width: 150, icon: "ic-any" },
            hiddenField: { visible: false },
          },
        }
        const { description, ...newTableSchema } = {
          ...basicTable.schema,
          updatedDescription: {
            ...basicTable.schema.description,
            name: "updatedDescription",
          },
        } as TableSchema

        const result = syncSchema(_.cloneDeep(view), newTableSchema, {
          old: "description",
          updated: "updatedDescription",
        })
        expect(result).toEqual({
          ...view,
          schema: {
            ...view.schema,
            description: undefined,
            updatedDescription: { visible: true, width: 150, icon: "ic-any" },
          },
        })
      })

      it("changing no UI schema will not affect the view", () => {
        const view: ViewV2 = {
          ...basicView,
          schema: {
            name: { visible: true, width: 100 },
            id: { visible: true, width: 20 },
            description: { visible: false },
            hiddenField: { visible: false },
          },
        }
        const result = syncSchema(
          _.cloneDeep(view),
          {
            ...basicTable.schema,
            id: {
              ...basicTable.schema.id,
              type: FieldType.NUMBER,
            } as FieldSchema,
          },
          undefined
        )
        expect(result).toEqual(view)
      })

      it("changing table column UI fields will not affect the view schema", () => {
        const view: ViewV2 = {
          ...basicView,
          schema: {
            name: { visible: true, width: 100 },
            id: { visible: true, width: 20 },
            description: { visible: false },
            hiddenField: { visible: false },
          },
        }
        const result = syncSchema(
          _.cloneDeep(view),
          {
            ...basicTable.schema,
            id: {
              ...basicTable.schema.id,
              visible: !basicTable.schema.id.visible,
            },
          },
          undefined
        )
        expect(result).toEqual(view)
      })
    })
  })
})
