import * as setup from "./utilities"
import {
  CreateViewRequest,
  FieldSchema,
  FieldType,
  SortOrder,
  SortType,
  Table,
  UpdateViewRequest,
  ViewV2,
} from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"

function priceTable(): Table {
  return {
    name: "table",
    type: "table",
    schema: {
      Price: {
        type: FieldType.NUMBER,
        name: "Price",
        constraints: {},
      },
      Category: {
        type: FieldType.STRING,
        name: "Category",
        constraints: {
          type: "string",
        },
      },
    },
  }
}

describe("/v2/views", () => {
  const config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    await config.createTable(priceTable())
  })

  describe("create", () => {
    it("persist the view when the view is successfully created", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: config.table!._id!,
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        id: expect.stringMatching(new RegExp(`${config.table?._id!}_`)),
        version: 2,
      })
    })

    it("can persist views with all fields", async () => {
      const newView: Required<CreateViewRequest> = {
        name: generator.name(),
        tableId: config.table!._id!,
        primaryDisplay: generator.word(),
        query: [{ operator: "equal", field: "field", value: "value" }],
        sort: {
          field: "fieldToSort",
          order: SortOrder.DESCENDING,
          type: SortType.STRING,
        },
        schema: {
          name: {
            visible: true,
          },
        },
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        schema: newView.schema,
        id: expect.any(String),
        version: 2,
      })
    })

    it("persist only UI schema overrides", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: config.table!._id!,
        schema: {
          Price: {
            name: "Price",
            type: FieldType.NUMBER,
            visible: true,
            order: 1,
            width: 100,
          },
          Category: {
            name: "Category",
            type: FieldType.STRING,
            visible: false,
            icon: "ic",
          },
        } as Record<string, FieldSchema>,
      }

      const createdView = await config.api.viewV2.create(newView)

      expect(await config.api.viewV2.get(createdView.id)).toEqual({
        ...newView,
        schema: {
          Price: {
            visible: true,
            order: 1,
            width: 100,
          },
        },
        id: createdView.id,
        version: 2,
      })
    })

    it("will not throw an exception if the schema is 'deleting' non UI fields", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: config.table!._id!,
        schema: {
          Price: {
            name: "Price",
            type: FieldType.NUMBER,
            visible: true,
          },
          Category: {
            name: "Category",
            type: FieldType.STRING,
          },
        } as Record<string, FieldSchema>,
      }

      await config.api.viewV2.create(newView, {
        expectStatus: 201,
      })
    })
  })

  describe("update", () => {
    let view: ViewV2

    beforeEach(async () => {
      await config.createTable(priceTable())
      view = await config.api.viewV2.create({ name: "View A" })
    })

    it("can update an existing view data", async () => {
      const tableId = config.table!._id!
      await config.api.viewV2.update({
        ...view,
        query: [{ operator: "equal", field: "newField", value: "thatValue" }],
      })

      expect(await config.api.table.get(tableId)).toEqual({
        ...config.table,
        views: {
          [view.name]: {
            ...view,
            query: [
              { operator: "equal", field: "newField", value: "thatValue" },
            ],
            schema: expect.anything(),
          },
        },
        _rev: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it("can update all fields", async () => {
      const tableId = config.table!._id!

      const updatedData: Required<UpdateViewRequest> = {
        version: view.version,
        id: view.id,
        tableId,
        name: view.name,
        primaryDisplay: generator.word(),
        query: [
          {
            operator: "equal",
            field: generator.word(),
            value: generator.word(),
          },
        ],
        sort: {
          field: generator.word(),
          order: SortOrder.DESCENDING,
          type: SortType.STRING,
        },
        schema: {
          Category: {
            visible: false,
          },
        },
      }
      await config.api.viewV2.update(updatedData)

      expect(await config.api.table.get(tableId)).toEqual({
        ...config.table,
        views: {
          [view.name]: {
            ...updatedData,
            schema: {
              ...config.table!.schema,
              Category: expect.objectContaining({
                visible: false,
              }),
              Price: expect.objectContaining({
                visible: false,
              }),
            },
          },
        },
        _rev: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it("can update an existing view name", async () => {
      const tableId = config.table!._id!
      await config.api.viewV2.update({ ...view, name: "View B" })

      expect(await config.api.table.get(tableId)).toEqual(
        expect.objectContaining({
          views: {
            "View B": { ...view, name: "View B", schema: expect.anything() },
          },
        })
      )
    })

    it("cannot update an unexisting views nor edit ids", async () => {
      const tableId = config.table!._id!
      await config.api.viewV2.update(
        { ...view, id: generator.guid() },
        { expectStatus: 404 }
      )

      expect(await config.api.table.get(tableId)).toEqual(
        expect.objectContaining({
          views: {
            [view.name]: {
              ...view,
              schema: expect.anything(),
            },
          },
        })
      )
    })

    it("cannot update views with the wrong tableId", async () => {
      const tableId = config.table!._id!
      await config.api.viewV2.update(
        {
          ...view,
          tableId: generator.guid(),
          query: [{ operator: "equal", field: "newField", value: "thatValue" }],
        },
        { expectStatus: 404 }
      )

      expect(await config.api.table.get(tableId)).toEqual(
        expect.objectContaining({
          views: {
            [view.name]: {
              ...view,
              schema: expect.anything(),
            },
          },
        })
      )
    })

    it("cannot update views v1", async () => {
      const viewV1 = await config.createView()
      await config.api.viewV2.update(
        {
          ...viewV1,
        },
        {
          expectStatus: 400,
          handleResponse: r => {
            expect(r.body).toEqual({
              message: "Only views V2 can be updated",
              status: 400,
            })
          },
        }
      )
    })

    it("cannot update the a view with unmatching ids between url and body", async () => {
      const anotherView = await config.api.viewV2.create()
      const result = await config
        .request!.put(`/api/v2/views/${anotherView.id}`)
        .send(view)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(400)

      expect(result.body).toEqual({
        message: "View id does not match between the body and the uri path",
        status: 400,
      })
    })

    it("updates only UI schema overrides", async () => {
      await config.api.viewV2.update({
        ...view,
        schema: {
          Price: {
            name: "Price",
            type: FieldType.NUMBER,
            visible: true,
            order: 1,
            width: 100,
          },
          Category: {
            name: "Category",
            type: FieldType.STRING,
            visible: false,
            icon: "ic",
          },
        } as Record<string, FieldSchema>,
      })

      expect(await config.api.viewV2.get(view.id)).toEqual({
        ...view,
        schema: {
          Price: {
            visible: true,
            order: 1,
            width: 100,
          },
        },
        id: view.id,
        version: 2,
      })
    })

    it("will not throw an exception if the schema is 'deleting' non UI fields", async () => {
      await config.api.viewV2.update(
        {
          ...view,
          schema: {
            Price: {
              name: "Price",
              type: FieldType.NUMBER,
              visible: true,
            },
            Category: {
              name: "Category",
              type: FieldType.STRING,
            },
          } as Record<string, FieldSchema>,
        },
        {
          expectStatus: 200,
        }
      )
    })
  })

  describe("delete", () => {
    let view: ViewV2

    beforeAll(async () => {
      await config.createTable(priceTable())
      view = await config.api.viewV2.create()
    })

    it("can delete an existing view", async () => {
      const tableId = config.table!._id!
      const getPersistedView = async () =>
        (await config.api.table.get(tableId)).views![view.name]

      expect(await getPersistedView()).toBeDefined()

      await config.api.viewV2.delete(view.id)

      expect(await getPersistedView()).toBeUndefined()
    })
  })

  describe("fetch view (through table)", () => {
    it("should be able to fetch a view V2", async () => {
      const table = await config.createTable(priceTable())

      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: table._id!,
        schema: {
          Price: { visible: false },
          Category: { visible: true },
        },
      }
      const res = await config.api.viewV2.create(newView)
      const view = await config.api.viewV2.get(res.id)
      expect(view!.schema?.Price).toBeUndefined()
      const updatedTable = await config.getTable(table._id!)
      const viewSchema = updatedTable.views[view!.name!].schema
      expect(viewSchema.Price.visible).toEqual(false)
    })
  })
})
