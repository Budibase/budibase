import * as setup from "./utilities"
import {
  CreateViewRequest,
  Datasource,
  FieldSchema,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  PermissionLevel,
  QuotaUsageType,
  Row,
  SaveTableRequest,
  SearchFilterOperator,
  SortOrder,
  SortType,
  StaticQuotaName,
  Table,
  TableSourceType,
  UpdateViewRequest,
  ViewUIFieldMetadata,
  ViewV2,
  SearchResponse,
} from "@budibase/types"
import { generator, mocks } from "@budibase/backend-core/tests"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"
import merge from "lodash/merge"
import { quotas } from "@budibase/pro"
import { db, roles } from "@budibase/backend-core"

describe.each([
  ["lucene", undefined],
  ["sqs", undefined],
  [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
  [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
  [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
  [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
])("/v2/views (%s)", (name, dsProvider) => {
  const config = setup.getConfig()
  const isSqs = name === "sqs"
  const isLucene = name === "lucene"
  const isInternal = isSqs || isLucene

  let table: Table
  let datasource: Datasource
  let envCleanup: (() => void) | undefined

  function saveTableRequest(
    ...overrides: Partial<Omit<SaveTableRequest, "name">>[]
  ): SaveTableRequest {
    const req: SaveTableRequest = {
      name: generator.guid().replaceAll("-", "").substring(0, 16),
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
    if (isSqs) {
      envCleanup = config.setEnv({ SQS_SEARCH_ENABLE: "true" })
    }
    await config.init()

    if (dsProvider) {
      datasource = await config.createDatasource({
        datasource: await dsProvider,
      })
    }
    table = await config.api.table.save(priceTable())
  })

  afterAll(async () => {
    setup.afterAll()
    if (envCleanup) {
      envCleanup()
    }
  })

  beforeEach(() => {
    mocks.licenses.useCloudFree()
  })

  const getRowUsage = async () => {
    const { total } = await config.doInContext(undefined, () =>
      quotas.getCurrentUsageValues(QuotaUsageType.STATIC, StaticQuotaName.ROWS)
    )
    return total
  }

  const assertRowUsage = async (expected: number) => {
    const usage = await getRowUsage()
    expect(usage).toBe(expected)
  }

  describe("create", () => {
    it("persist the view when the view is successfully created", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: table._id!,
        schema: {
          id: { visible: true },
        },
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
        primaryDisplay: "id",
        query: [
          {
            operator: SearchFilterOperator.EQUAL,
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
          id: { visible: true },
          Price: {
            visible: true,
          },
        },
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        schema: {
          id: { visible: true },
          Price: {
            visible: true,
          },
        },
        id: expect.any(String),
        version: 2,
      })
    })

    it("persist only UI schema overrides", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: table._id!,
        schema: {
          id: {
            name: "id",
            type: FieldType.NUMBER,
            visible: true,
          },
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

      expect(createdView).toEqual({
        ...newView,
        schema: {
          id: { visible: true },
          Price: {
            visible: true,
            order: 1,
            width: 100,
          },
          Category: {
            visible: false,
            icon: "ic",
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
          id: {
            name: "id",
            type: FieldType.AUTO,
            autocolumn: true,
            visible: true,
          },
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

    it("does not persist non-visible fields", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: table._id!,
        primaryDisplay: "id",
        schema: {
          id: { visible: true },
          Price: { visible: true },
          Category: { visible: false },
        },
      }
      const res = await config.api.viewV2.create(newView)

      expect(res).toEqual({
        ...newView,
        schema: {
          id: { visible: true },
          Price: { visible: true },
          Category: { visible: false },
        },
        id: expect.any(String),
        version: 2,
      })
    })

    it("throws bad request when the schema fields are not valid", async () => {
      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: table._id!,
        schema: {
          id: { visible: true },
          nonExisting: {
            visible: true,
          },
        },
      }
      await config.api.viewV2.create(newView, {
        status: 400,
        body: {
          message: 'Field "nonExisting" is not valid for the requested table',
        },
      })
    })

    describe("readonly fields", () => {
      beforeEach(() => {
        mocks.licenses.useViewReadonlyColumns()
      })

      it("readonly fields are persisted", async () => {
        const table = await config.api.table.save(
          saveTableRequest({
            schema: {
              name: {
                name: "name",
                type: FieldType.STRING,
              },
              description: {
                name: "description",
                type: FieldType.STRING,
              },
            },
          })
        )

        const newView: CreateViewRequest = {
          name: generator.name(),
          tableId: table._id!,
          schema: {
            id: { visible: true },
            name: {
              visible: true,
              readonly: true,
            },
            description: {
              visible: true,
              readonly: true,
            },
          },
        }

        const res = await config.api.viewV2.create(newView)
        expect(res.schema).toEqual({
          id: { visible: true },
          name: {
            visible: true,
            readonly: true,
          },
          description: {
            visible: true,
            readonly: true,
          },
        })
      })

      it("required fields cannot be marked as readonly", async () => {
        const table = await config.api.table.save(
          saveTableRequest({
            schema: {
              name: {
                name: "name",
                type: FieldType.STRING,
                constraints: { presence: true },
              },
              description: {
                name: "description",
                type: FieldType.STRING,
              },
            },
          })
        )

        const newView: CreateViewRequest = {
          name: generator.name(),
          tableId: table._id!,
          schema: {
            id: { visible: true },
            name: {
              visible: true,
              readonly: true,
            },
          },
        }

        await config.api.viewV2.create(newView, {
          status: 400,
          body: {
            message:
              'You can\'t make "name" readonly because it is a required field.',
            status: 400,
          },
        })
      })

      it("readonly fields must be visible", async () => {
        const table = await config.api.table.save(
          saveTableRequest({
            schema: {
              name: {
                name: "name",
                type: FieldType.STRING,
              },
              description: {
                name: "description",
                type: FieldType.STRING,
              },
            },
          })
        )

        const newView: CreateViewRequest = {
          name: generator.name(),
          tableId: table._id!,
          schema: {
            id: { visible: true },
            name: {
              visible: false,
              readonly: true,
            },
          },
        }

        await config.api.viewV2.create(newView, {
          status: 400,
          body: {
            message:
              'Field "name" must be visible if you want to make it readonly',
            status: 400,
          },
        })
      })

      it("readonly fields cannot be used on free license", async () => {
        mocks.licenses.useCloudFree()
        const table = await config.api.table.save(
          saveTableRequest({
            schema: {
              name: {
                name: "name",
                type: FieldType.STRING,
              },
              description: {
                name: "description",
                type: FieldType.STRING,
              },
            },
          })
        )

        const newView: CreateViewRequest = {
          name: generator.name(),
          tableId: table._id!,
          schema: {
            id: { visible: true },
            name: {
              visible: true,
              readonly: true,
            },
          },
        }

        await config.api.viewV2.create(newView, {
          status: 400,
          body: {
            message: "Readonly fields are not enabled",
            status: 400,
          },
        })
      })
    })

    it("display fields must be visible", async () => {
      const table = await config.api.table.save(
        saveTableRequest({
          schema: {
            name: {
              name: "name",
              type: FieldType.STRING,
            },
            description: {
              name: "description",
              type: FieldType.STRING,
            },
          },
        })
      )

      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: table._id!,
        primaryDisplay: "name",
        schema: {
          id: { visible: true },
          name: {
            visible: false,
          },
        },
      }

      await config.api.viewV2.create(newView, {
        status: 400,
        body: {
          message: 'You can\'t hide "name" because it is the display column.',
          status: 400,
        },
      })
    })

    it("display fields can be readonly", async () => {
      mocks.licenses.useViewReadonlyColumns()
      const table = await config.api.table.save(
        saveTableRequest({
          schema: {
            name: {
              name: "name",
              type: FieldType.STRING,
            },
            description: {
              name: "description",
              type: FieldType.STRING,
            },
          },
        })
      )

      const newView: CreateViewRequest = {
        name: generator.name(),
        tableId: table._id!,
        primaryDisplay: "name",
        schema: {
          id: { visible: true },
          name: {
            visible: true,
            readonly: true,
          },
        },
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
        name: generator.guid(),
        schema: {
          id: { visible: true },
        },
      })
    })

    it("can update an existing view data", async () => {
      const tableId = table._id!
      await config.api.viewV2.update({
        ...view,
        query: [
          {
            operator: SearchFilterOperator.EQUAL,
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
      mocks.licenses.useViewReadonlyColumns()
      const tableId = table._id!

      const updatedData: Required<UpdateViewRequest> = {
        version: view.version,
        id: view.id,
        tableId,
        name: view.name,
        primaryDisplay: "Price",
        query: [
          {
            operator: SearchFilterOperator.EQUAL,
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
          id: { visible: true },
          Category: {
            visible: false,
          },
          Price: {
            visible: true,
            readonly: true,
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
              visible: true,
            }),
            Category: expect.objectContaining({
              visible: false,
            }),
            Price: expect.objectContaining({
              visible: true,
              readonly: true,
            }),
          },
        },
      })
    })

    it("can update an existing view name", async () => {
      const tableId = table._id!
      const newName = generator.guid()
      await config.api.viewV2.update({ ...view, name: newName })

      expect(await config.api.table.get(tableId)).toEqual(
        expect.objectContaining({
          views: {
            [newName]: { ...view, name: newName, schema: expect.anything() },
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
              operator: SearchFilterOperator.EQUAL,
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
        schema: {
          id: { visible: true },
        },
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
      const updatedView = await config.api.viewV2.update({
        ...view,
        schema: {
          ...view.schema,
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

      expect(updatedView).toEqual({
        ...view,
        schema: {
          id: { visible: true },
          Price: {
            visible: true,
            order: 1,
            width: 100,
          },
          Category: { visible: false, icon: "ic" },
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
            ...view.schema,
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

    it("cannot update views with readonly on on free license", async () => {
      mocks.licenses.useViewReadonlyColumns()

      view = await config.api.viewV2.update({
        ...view,
        schema: {
          id: { visible: true },
          Price: {
            visible: true,
            readonly: true,
          },
        },
      })

      mocks.licenses.useCloudFree()
      await config.api.viewV2.update(view, {
        status: 400,
        body: {
          message: "Readonly fields are not enabled",
        },
      })
    })

    it("can remove readonly config after license downgrade", async () => {
      mocks.licenses.useViewReadonlyColumns()

      view = await config.api.viewV2.update({
        ...view,
        schema: {
          id: { visible: true },
          Price: {
            visible: true,
            readonly: true,
          },
          Category: {
            visible: true,
            readonly: true,
          },
        },
      })
      mocks.licenses.useCloudFree()
      const res = await config.api.viewV2.update({
        ...view,
        schema: {
          id: { visible: true },
          Price: {
            visible: true,
            readonly: false,
          },
        },
      })
      expect(res).toEqual(
        expect.objectContaining({
          ...view,
          schema: {
            id: { visible: true },
            Price: {
              visible: true,
              readonly: false,
            },
          },
        })
      )
    })

    isInternal &&
      it("updating schema will only validate modified field", async () => {
        let view = await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          schema: {
            id: { visible: true },
            Price: {
              visible: true,
            },
            Category: { visible: true },
          },
        })

        // Update the view to an invalid state
        const tableToUpdate = await config.api.table.get(table._id!)
        ;(tableToUpdate.views![view.name] as ViewV2).schema!.id.visible = false
        await db.getDB(config.appId!).put(tableToUpdate)

        view = await config.api.viewV2.get(view.id)
        await config.api.viewV2.update(
          {
            ...view,
            schema: {
              ...view.schema,
              Price: {
                visible: false,
              },
            },
          },
          {
            status: 400,
            body: {
              message: 'You can\'t hide "id" because it is a required field.',
              status: 400,
            },
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
        schema: {
          id: { visible: true },
        },
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
      const res = await config.api.viewV2.create({
        name: generator.name(),
        tableId: table._id!,
        schema: {
          id: { visible: true },
          Price: { visible: false },
          Category: { visible: true },
        },
      })

      const view = await config.api.viewV2.get(res.id)
      const updatedTable = await config.api.table.get(table._id!)
      const viewSchema = updatedTable.views![view!.name!].schema as Record<
        string,
        ViewUIFieldMetadata
      >
      expect(viewSchema.Price?.visible).toEqual(false)
      expect(viewSchema.Category?.visible).toEqual(true)
    })

    it("should be able to fetch readonly config after downgrades", async () => {
      mocks.licenses.useViewReadonlyColumns()
      const res = await config.api.viewV2.create({
        name: generator.name(),
        tableId: table._id!,
        schema: {
          id: { visible: true },
          Price: { visible: true, readonly: true },
        },
      })

      mocks.licenses.useCloudFree()
      const view = await config.api.viewV2.get(res.id)
      expect(view.schema?.Price).toEqual(
        expect.objectContaining({ visible: true, readonly: true })
      )
    })
  })

  describe("read", () => {
    let view: ViewV2

    beforeAll(async () => {
      table = await config.api.table.save(
        saveTableRequest({
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

      view = await config.api.viewV2.create({
        tableId: table._id!,
        name: generator.guid(),
        schema: {
          id: { visible: true },
          Country: {
            visible: true,
          },
        },
      })
    })

    it("views have extra data trimmed", async () => {
      let row = await config.api.row.save(view.id, {
        Country: "Aussy",
        Story: "aaaaa",
      })

      row = await config.api.row.get(table._id!, row._id!)
      expect(row.Story).toBeUndefined()
      expect(row.Country).toEqual("Aussy")
    })
  })

  describe("row operations", () => {
    let table: Table, view: ViewV2
    beforeEach(async () => {
      table = await config.api.table.save(
        saveTableRequest({
          schema: {
            one: { type: FieldType.STRING, name: "one" },
            two: { type: FieldType.STRING, name: "two" },
          },
        })
      )
      view = await config.api.viewV2.create({
        tableId: table._id!,
        name: generator.guid(),
        schema: {
          id: { visible: true },
          two: { visible: true },
        },
      })
    })

    describe("create", () => {
      it("should persist a new row with only the provided view fields", async () => {
        const newRow = await config.api.row.save(view.id, {
          tableId: table!._id,
          _viewId: view.id,
          one: "foo",
          two: "bar",
        })

        const row = await config.api.row.get(table._id!, newRow._id!)
        expect(row.one).toBeUndefined()
        expect(row.two).toEqual("bar")
      })

      it("can't persist readonly columns", async () => {
        mocks.licenses.useViewReadonlyColumns()
        const view = await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          schema: {
            id: { visible: true },
            one: { visible: true, readonly: true },
            two: { visible: true },
          },
        })
        const row = await config.api.row.save(view.id, {
          tableId: table!._id,
          _viewId: view.id,
          one: "foo",
          two: "bar",
        })

        expect(row.one).toBeUndefined()
        expect(row.two).toEqual("bar")
      })
    })

    describe("patch", () => {
      it("should update only the view fields for a row", async () => {
        const newRow = await config.api.row.save(table._id!, {
          one: "foo",
          two: "bar",
        })
        await config.api.row.patch(view.id, {
          tableId: table._id!,
          _id: newRow._id!,
          _rev: newRow._rev!,
          one: "newFoo",
          two: "newBar",
        })

        const row = await config.api.row.get(table._id!, newRow._id!)
        expect(row.one).toEqual("foo")
        expect(row.two).toEqual("newBar")
      })

      it("can't update readonly columns", async () => {
        mocks.licenses.useViewReadonlyColumns()
        const view = await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          schema: {
            id: { visible: true },
            one: { visible: true, readonly: true },
            two: { visible: true },
          },
        })
        const newRow = await config.api.row.save(table._id!, {
          one: "foo",
          two: "bar",
        })
        await config.api.row.patch(view.id, {
          tableId: table._id!,
          _id: newRow._id!,
          _rev: newRow._rev!,
          one: "newFoo",
          two: "newBar",
        })

        const row = await config.api.row.get(table._id!, newRow._id!)
        expect(row.one).toEqual("foo")
        expect(row.two).toEqual("newBar")
      })
    })

    describe("destroy", () => {
      it("should be able to delete a row", async () => {
        const createdRow = await config.api.row.save(table._id!, {})
        const rowUsage = await getRowUsage()
        await config.api.row.bulkDelete(view.id, { rows: [createdRow] })
        await assertRowUsage(isInternal ? rowUsage - 1 : rowUsage)
        await config.api.row.get(table._id!, createdRow._id!, {
          status: 404,
        })
      })

      it("should be able to delete multiple rows", async () => {
        const rows = await Promise.all([
          config.api.row.save(table._id!, {}),
          config.api.row.save(table._id!, {}),
          config.api.row.save(table._id!, {}),
        ])
        const rowUsage = await getRowUsage()

        await config.api.row.bulkDelete(view.id, { rows: [rows[0], rows[2]] })

        await assertRowUsage(isInternal ? rowUsage - 2 : rowUsage)

        await config.api.row.get(table._id!, rows[0]._id!, {
          status: 404,
        })
        await config.api.row.get(table._id!, rows[2]._id!, {
          status: 404,
        })
        await config.api.row.get(table._id!, rows[1]._id!, { status: 200 })
      })
    })

    describe("search", () => {
      it("returns empty rows from view when no schema is passed", async () => {
        const rows = await Promise.all(
          Array.from({ length: 10 }, () => config.api.row.save(table._id!, {}))
        )
        const response = await config.api.viewV2.search(view.id)
        expect(response.rows).toHaveLength(10)
        expect(response).toEqual({
          rows: expect.arrayContaining(
            rows.map(r => ({
              _viewId: view.id,
              tableId: table._id,
              id: r.id,
              _id: r._id,
              _rev: r._rev,
              ...(isInternal
                ? {
                    type: "row",
                    updatedAt: expect.any(String),
                    createdAt: expect.any(String),
                  }
                : {}),
            }))
          ),
          ...(isInternal
            ? {}
            : {
                hasNextPage: false,
              }),
        })
      })

      it("searching respects the view filters", async () => {
        await config.api.row.save(table._id!, {
          one: "foo",
          two: "bar",
        })
        const two = await config.api.row.save(table._id!, {
          one: "foo2",
          two: "bar2",
        })

        const view = await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          query: [
            {
              operator: SearchFilterOperator.EQUAL,
              field: "two",
              value: "bar2",
            },
          ],
          schema: {
            id: { visible: true },
            one: { visible: false },
            two: { visible: true },
          },
        })

        const response = await config.api.viewV2.search(view.id)
        expect(response.rows).toHaveLength(1)
        expect(response).toEqual({
          rows: expect.arrayContaining([
            {
              _viewId: view.id,
              tableId: table._id,
              id: two.id,
              two: two.two,
              _id: two._id,
              _rev: two._rev,
              ...(isInternal
                ? {
                    type: "row",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  }
                : {}),
            },
          ]),
          ...(isInternal
            ? {}
            : {
                hasNextPage: false,
              }),
        })
      })

      it("views without data can be returned", async () => {
        const response = await config.api.viewV2.search(view.id)
        expect(response.rows).toHaveLength(0)
      })

      it("respects the limit parameter", async () => {
        await Promise.all(
          Array.from({ length: 10 }, () => config.api.row.save(table._id!, {}))
        )
        const limit = generator.integer({ min: 1, max: 8 })
        const response = await config.api.viewV2.search(view.id, {
          limit,
          query: {},
        })
        expect(response.rows).toHaveLength(limit)
      })

      it("can handle pagination", async () => {
        await Promise.all(
          Array.from({ length: 10 }, () => config.api.row.save(table._id!, {}))
        )
        const rows = (await config.api.viewV2.search(view.id)).rows

        const page1 = await config.api.viewV2.search(view.id, {
          paginate: true,
          limit: 4,
          query: {},
          countRows: true,
        })
        expect(page1).toEqual({
          rows: expect.arrayContaining(rows.slice(0, 4)),
          hasNextPage: true,
          bookmark: expect.anything(),
          totalRows: 10,
        })

        const page2 = await config.api.viewV2.search(view.id, {
          paginate: true,
          limit: 4,
          bookmark: page1.bookmark,
          query: {},
          countRows: true,
        })
        expect(page2).toEqual({
          rows: expect.arrayContaining(rows.slice(4, 8)),
          hasNextPage: true,
          bookmark: expect.anything(),
          totalRows: 10,
        })

        const page3 = await config.api.viewV2.search(view.id, {
          paginate: true,
          limit: 4,
          bookmark: page2.bookmark,
          query: {},
          countRows: true,
        })
        const expectation: SearchResponse<Row> = {
          rows: expect.arrayContaining(rows.slice(8)),
          hasNextPage: false,
          totalRows: 10,
        }
        if (isLucene) {
          expectation.bookmark = expect.anything()
        }
        expect(page3).toEqual(expectation)
      })

      const sortTestOptions: [
        {
          field: string
          order?: SortOrder
          type?: SortType
        },
        string[]
      ][] = [
        [
          {
            field: "name",
            order: SortOrder.ASCENDING,
            type: SortType.STRING,
          },
          ["Alice", "Bob", "Charly", "Danny"],
        ],
        [
          {
            field: "name",
          },
          ["Alice", "Bob", "Charly", "Danny"],
        ],
        [
          {
            field: "name",
            order: SortOrder.DESCENDING,
          },
          ["Danny", "Charly", "Bob", "Alice"],
        ],
        [
          {
            field: "name",
            order: SortOrder.DESCENDING,
            type: SortType.STRING,
          },
          ["Danny", "Charly", "Bob", "Alice"],
        ],
        [
          {
            field: "age",
            order: SortOrder.ASCENDING,
            type: SortType.NUMBER,
          },
          ["Danny", "Alice", "Charly", "Bob"],
        ],
        [
          {
            field: "age",
            order: SortOrder.ASCENDING,
          },
          ["Danny", "Alice", "Charly", "Bob"],
        ],
        [
          {
            field: "age",
            order: SortOrder.DESCENDING,
          },
          ["Bob", "Charly", "Alice", "Danny"],
        ],
        [
          {
            field: "age",
            order: SortOrder.DESCENDING,
            type: SortType.NUMBER,
          },
          ["Bob", "Charly", "Alice", "Danny"],
        ],
      ]

      describe("sorting", () => {
        let table: Table
        const viewSchema = {
          id: { visible: true },
          age: { visible: true },
          name: { visible: true },
        }

        beforeAll(async () => {
          table = await config.api.table.save(
            saveTableRequest({
              type: "table",
              schema: {
                name: {
                  type: FieldType.STRING,
                  name: "name",
                },
                surname: {
                  type: FieldType.STRING,
                  name: "surname",
                },
                age: {
                  type: FieldType.NUMBER,
                  name: "age",
                },
                address: {
                  type: FieldType.STRING,
                  name: "address",
                },
                jobTitle: {
                  type: FieldType.STRING,
                  name: "jobTitle",
                },
              },
            })
          )

          const users = [
            { name: "Alice", age: 25 },
            { name: "Bob", age: 30 },
            { name: "Charly", age: 27 },
            { name: "Danny", age: 15 },
          ]
          await Promise.all(
            users.map(u =>
              config.api.row.save(table._id!, {
                tableId: table._id,
                ...u,
              })
            )
          )
        })

        it.each(sortTestOptions)(
          "allow sorting (%s)",
          async (sortParams, expected) => {
            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              sort: sortParams,
              schema: viewSchema,
            })

            const response = await config.api.viewV2.search(view.id)

            expect(response.rows).toHaveLength(4)
            expect(response.rows).toEqual(
              expected.map(name => expect.objectContaining({ name }))
            )
          }
        )

        it.each(sortTestOptions)(
          "allow override the default view sorting (%s)",
          async (sortParams, expected) => {
            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              sort: {
                field: "name",
                order: SortOrder.ASCENDING,
                type: SortType.STRING,
              },
              schema: viewSchema,
            })

            const response = await config.api.viewV2.search(view.id, {
              sort: sortParams.field,
              sortOrder: sortParams.order,
              sortType: sortParams.type,
              query: {},
            })

            expect(response.rows).toHaveLength(4)
            expect(response.rows).toEqual(
              expected.map(name => expect.objectContaining({ name }))
            )
          }
        )
      })
    })

    describe("permissions", () => {
      beforeEach(async () => {
        mocks.licenses.useViewPermissions()
        await Promise.all(
          Array.from({ length: 10 }, () => config.api.row.save(table._id!, {}))
        )
      })

      it("does not allow public users to fetch by default", async () => {
        await config.publish()
        await config.api.viewV2.publicSearch(view.id, undefined, {
          status: 403,
        })
      })

      it("allow public users to fetch when permissions are explicit", async () => {
        await config.api.permission.add({
          roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
          level: PermissionLevel.READ,
          resourceId: view.id,
        })
        await config.publish()

        const response = await config.api.viewV2.publicSearch(view.id)

        expect(response.rows).toHaveLength(10)
      })

      it("allow public users to fetch when permissions are inherited", async () => {
        await config.api.permission.add({
          roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
          level: PermissionLevel.READ,
          resourceId: table._id!,
        })
        await config.publish()

        const response = await config.api.viewV2.publicSearch(view.id)

        expect(response.rows).toHaveLength(10)
      })

      it("respects inherited permissions, not allowing not public views from public tables", async () => {
        await config.api.permission.add({
          roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
          level: PermissionLevel.READ,
          resourceId: table._id!,
        })
        await config.api.permission.add({
          roleId: roles.BUILTIN_ROLE_IDS.POWER,
          level: PermissionLevel.READ,
          resourceId: view.id,
        })
        await config.publish()

        await config.api.viewV2.publicSearch(view.id, undefined, {
          status: 403,
        })
      })
    })
  })

  describe("updating table schema", () => {
    describe("existing columns changed to required", () => {
      beforeEach(async () => {
        table = await config.api.table.save(
          saveTableRequest({
            schema: {
              id: {
                name: "id",
                type: FieldType.AUTO,
                autocolumn: true,
              },
              name: {
                name: "name",
                type: FieldType.STRING,
              },
            },
          })
        )
      })

      it("allows updating when no views constrains the field", async () => {
        await config.api.viewV2.create({
          name: "view a",
          tableId: table._id!,
          schema: {
            id: { visible: true },
            name: { visible: true },
          },
        })

        table = await config.api.table.get(table._id!)
        await config.api.table.save(
          {
            ...table,
            schema: {
              ...table.schema,
              name: {
                name: "name",
                type: FieldType.STRING,
                constraints: { presence: { allowEmpty: false } },
              },
            },
          },
          { status: 200 }
        )
      })

      it("rejects if field is readonly in any view", async () => {
        mocks.licenses.useViewReadonlyColumns()

        await config.api.viewV2.create({
          name: "view a",
          tableId: table._id!,
          schema: {
            id: { visible: true },
            name: {
              visible: true,
              readonly: true,
            },
          },
        })

        table = await config.api.table.get(table._id!)
        await config.api.table.save(
          {
            ...table,
            schema: {
              ...table.schema,
              name: {
                name: "name",
                type: FieldType.STRING,
                constraints: { presence: true },
              },
            },
          },
          {
            status: 400,
            body: {
              status: 400,
              message:
                'To make field "name" required, this field must be present and writable in views: view a.',
            },
          }
        )
      })

      it("rejects if field is hidden in any view", async () => {
        await config.api.viewV2.create({
          name: "view a",
          tableId: table._id!,
          schema: { id: { visible: true } },
        })

        table = await config.api.table.get(table._id!)
        await config.api.table.save(
          {
            ...table,
            schema: {
              ...table.schema,
              name: {
                name: "name",
                type: FieldType.STRING,
                constraints: { presence: true },
              },
            },
          },
          {
            status: 400,
            body: {
              status: 400,
              message:
                'To make field "name" required, this field must be present and writable in views: view a.',
            },
          }
        )
      })
    })
  })
})
