import * as setup from "./utilities"
import {
  CreateViewRequest,
  Datasource,
  FieldSchema,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  SaveTableRequest,
  SearchQueryOperators,
  SortOrder,
  SortType,
  Table,
  TableSourceType,
  UIFieldMetadata,
  UpdateViewRequest,
  ViewV2,
} from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import * as uuid from "uuid"
import { databaseTestProviders } from "../../../integrations/tests/utils"
import merge from "lodash/merge"

jest.unmock("mssql")
jest.unmock("pg")

describe.each([
  ["internal", undefined],
  ["postgres", databaseTestProviders.postgres],
  ["mysql", databaseTestProviders.mysql],
  ["mssql", databaseTestProviders.mssql],
  ["mariadb", databaseTestProviders.mariadb],
])("/v2/views (%s)", (_, dsProvider) => {
  const config = setup.getConfig()

  let table: Table
  let datasource: Datasource

  function saveTableRequest(
    ...overrides: Partial<SaveTableRequest>[]
  ): SaveTableRequest {
    const req: SaveTableRequest = {
      name: uuid.v4().substring(0, 16),
      type: "table",
      sourceType: datasource
        ? TableSourceType.EXTERNAL
        : TableSourceType.INTERNAL,
      sourceId: datasource ? datasource._id! : INTERNAL_TABLE_SOURCE_ID,
      primary: ["id"],
      schema: {
        id: {
          type: FieldType.AUTO,
          name: "id",
          autocolumn: true,
          constraints: {
            presence: true,
          },
        },
      },
    }
    return merge(req, ...overrides)
  }

  function priceTable(): SaveTableRequest {
    return saveTableRequest({
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
    })
  }

  beforeAll(async () => {
    await config.init()

    if (dsProvider) {
      datasource = await config.createDatasource({
        datasource: await dsProvider.datasource(),
      })
    }
    table = await config.api.table.save(priceTable())
  })

  afterAll(async () => {
    if (dsProvider) {
      await dsProvider.stop()
    }
    setup.afterAll()
  })

  describe("create", () => {
    it("persist the view when the view is successfully created", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: table._id!,
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        id: expect.stringMatching(new RegExp(`${table._id!}_`)),
        version: 2,
      })
    })

    it("can persist views with all fields", async () => {
      const newView: Required<CreateViewRequest> = {
        name: generator.name(),
        tableId: table._id!,
        primaryDisplay: generator.word(),
        query: [
          {
            operator: SearchQueryOperators.EQUAL,
            field: "field",
            value: "value",
          },
        ],
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
        tableId: table._id!,
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
        tableId: table._id!,
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
        status: 201,
      })
    })
  })

  describe("update", () => {
    let view: ViewV2

    beforeEach(async () => {
      table = await config.api.table.save(priceTable())

      view = await config.api.viewV2.create({
        tableId: table._id!,
        name: "View A",
      })
    })

    it("can update an existing view data", async () => {
      const tableId = table._id!
      await config.api.viewV2.update({
        ...view,
        query: [
          {
            operator: SearchQueryOperators.EQUAL,
            field: "newField",
            value: "thatValue",
          },
        ],
      })

      expect((await config.api.table.get(tableId)).views).toEqual({
        [view.name]: {
          ...view,
          query: [{ operator: "equal", field: "newField", value: "thatValue" }],
          schema: expect.anything(),
        },
      })
    })

    it("can update all fields", async () => {
      const tableId = table._id!

      const updatedData: Required<UpdateViewRequest> = {
        version: view.version,
        id: view.id,
        tableId,
        name: view.name,
        primaryDisplay: generator.word(),
        query: [
          {
            operator: SearchQueryOperators.EQUAL,
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

      expect((await config.api.table.get(tableId)).views).toEqual({
        [view.name]: {
          ...updatedData,
          schema: {
            ...table.schema,
            id: expect.objectContaining({
              visible: false,
            }),
            Category: expect.objectContaining({
              visible: false,
            }),
            Price: expect.objectContaining({
              visible: false,
            }),
          },
        },
      })
    })

    it("can update an existing view name", async () => {
      const tableId = table._id!
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
      const tableId = table._id!
      await config.api.viewV2.update(
        { ...view, id: generator.guid() },
        { status: 404 }
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
      const tableId = table._id!
      await config.api.viewV2.update(
        {
          ...view,
          tableId: generator.guid(),
          query: [
            {
              operator: SearchQueryOperators.EQUAL,
              field: "newField",
              value: "thatValue",
            },
          ],
        },
        { status: 404 }
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
      const viewV1 = await config.api.legacyView.save({
        tableId: table._id!,
        name: generator.guid(),
        filters: [],
        schema: {},
      })

      await config.api.viewV2.update(viewV1 as unknown as ViewV2, {
        status: 400,
        body: {
          message: "Only views V2 can be updated",
          status: 400,
        },
      })
    })

    it("cannot update the a view with unmatching ids between url and body", async () => {
      const anotherView = await config.api.viewV2.create({
        tableId: table._id!,
        name: generator.guid(),
      })
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
          status: 200,
        }
      )
    })
  })

  describe("delete", () => {
    let view: ViewV2

    beforeAll(async () => {
      view = await config.api.viewV2.create({
        tableId: table._id!,
        name: generator.guid(),
      })
    })

    it("can delete an existing view", async () => {
      const tableId = table._id!
      const getPersistedView = async () =>
        (await config.api.table.get(tableId)).views![view.name]

      expect(await getPersistedView()).toBeDefined()

      await config.api.viewV2.delete(view.id)

      expect(await getPersistedView()).toBeUndefined()
    })
  })

  describe("fetch view (through table)", () => {
    it("should be able to fetch a view V2", async () => {
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
      const updatedTable = await config.api.table.get(table._id!)
      const viewSchema = updatedTable.views![view!.name!].schema as Record<
        string,
        UIFieldMetadata
      >
      expect(viewSchema.Price?.visible).toEqual(false)
    })
  })

  describe("read", () => {
    it("views have extra data trimmed", async () => {
      const table = await config.api.table.save(
        saveTableRequest({
          name: "orders",
          schema: {
            Country: {
              type: FieldType.STRING,
              name: "Country",
            },
            Story: {
              type: FieldType.STRING,
              name: "Story",
            },
          },
        })
      )

      const view = await config.api.viewV2.create({
        tableId: table._id!,
        name: uuid.v4(),
        schema: {
          Country: {
            visible: true,
          },
        },
      })

      let row = await config.api.row.save(view.id, {
        Country: "Aussy",
        Story: "aaaaa",
      })

      row = await config.api.row.get(table._id!, row._id!)
      expect(row.Story).toBeUndefined()
      expect(row.Country).toEqual("Aussy")
    })
  })
})
