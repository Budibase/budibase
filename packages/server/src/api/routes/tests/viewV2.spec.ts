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
  SortOrder,
  SortType,
  StaticQuotaName,
  Table,
  TableSourceType,
  UpdateViewRequest,
  ViewV2,
  SearchResponse,
  BasicOperator,
  CalculationType,
  RelationshipType,
  TableSchema,
  RenameColumn,
  BBReferenceFieldSubType,
  NumericCalculationFieldMetadata,
  ViewV2Schema,
  ViewV2Type,
} from "@budibase/types"
import { generator, mocks } from "@budibase/backend-core/tests"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"
import merge from "lodash/merge"
import { quotas } from "@budibase/pro"
import { db, roles, features } from "@budibase/backend-core"

describe.each([
  ["lucene", undefined],
  ["sqs", undefined],
  [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
  [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
  [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
  [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
  [DatabaseName.ORACLE, getDatasource(DatabaseName.ORACLE)],
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
          type: FieldType.NUMBER,
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
    await features.testutils.withFeatureFlags("*", { SQS: isSqs }, () =>
      config.init()
    )

    envCleanup = features.testutils.setFeatureFlags("*", {
      SQS: isSqs,
    })

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
    jest.clearAllMocks()
    mocks.licenses.useCloudFree()
  })

  describe("view crud", () => {
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
        const newView: Required<Omit<CreateViewRequest, "queryUI" | "type">> = {
          name: generator.name(),
          tableId: table._id!,
          primaryDisplay: "id",
          query: [
            {
              operator: BasicOperator.EQUAL,
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
              type: FieldType.NUMBER,
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

        it("readonly fields can be used on free license", async () => {
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
            status: 201,
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

      it("can create a view with calculation fields", async () => {
        let view = await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          type: ViewV2Type.CALCULATION,
          schema: {
            sum: {
              visible: true,
              calculationType: CalculationType.SUM,
              field: "Price",
            },
          },
        })

        expect(Object.keys(view.schema!)).toHaveLength(1)

        let sum = view.schema!.sum as NumericCalculationFieldMetadata
        expect(sum).toBeDefined()
        expect(sum.calculationType).toEqual(CalculationType.SUM)
        expect(sum.field).toEqual("Price")

        view = await config.api.viewV2.get(view.id)
        sum = view.schema!.sum as NumericCalculationFieldMetadata
        expect(sum).toBeDefined()
        expect(sum.calculationType).toEqual(CalculationType.SUM)
        expect(sum.field).toEqual("Price")
      })

      it("cannot create a view with calculation fields unless it has the right type", async () => {
        await config.api.viewV2.create(
          {
            tableId: table._id!,
            name: generator.guid(),
            schema: {
              sum: {
                visible: true,
                calculationType: CalculationType.SUM,
                field: "Price",
              },
            },
          },
          {
            status: 400,
            body: {
              message:
                "Calculation fields are not allowed in non-calculation views",
            },
          }
        )
      })

      it("cannot create a calculation view with more than 5 aggregations", async () => {
        await config.api.viewV2.create(
          {
            tableId: table._id!,
            name: generator.guid(),
            type: ViewV2Type.CALCULATION,
            schema: {
              sum: {
                visible: true,
                calculationType: CalculationType.SUM,
                field: "Price",
              },
              count: {
                visible: true,
                calculationType: CalculationType.COUNT,
                field: "Price",
              },
              min: {
                visible: true,
                calculationType: CalculationType.MIN,
                field: "Price",
              },
              max: {
                visible: true,
                calculationType: CalculationType.MAX,
                field: "Price",
              },
              avg: {
                visible: true,
                calculationType: CalculationType.AVG,
                field: "Price",
              },
              sum2: {
                visible: true,
                calculationType: CalculationType.SUM,
                field: "Price",
              },
            },
          },
          {
            status: 400,
            body: {
              message: "Calculation views can only have a maximum of 5 fields",
            },
          }
        )
      })

      it("cannot create a calculation view with duplicate calculations", async () => {
        await config.api.viewV2.create(
          {
            tableId: table._id!,
            name: generator.guid(),
            type: ViewV2Type.CALCULATION,
            schema: {
              sum: {
                visible: true,
                calculationType: CalculationType.SUM,
                field: "Price",
              },
              sum2: {
                visible: true,
                calculationType: CalculationType.SUM,
                field: "Price",
              },
            },
          },
          {
            status: 400,
            body: {
              message:
                'Duplicate calculation on field "Price", calculation type "sum"',
            },
          }
        )
      })

      it("finds duplicate counts", async () => {
        await config.api.viewV2.create(
          {
            tableId: table._id!,
            name: generator.guid(),
            type: ViewV2Type.CALCULATION,
            schema: {
              count: {
                visible: true,
                calculationType: CalculationType.COUNT,
              },
              count2: {
                visible: true,
                calculationType: CalculationType.COUNT,
              },
            },
          },
          {
            status: 400,
            body: {
              message:
                'Duplicate calculation on field "*", calculation type "count"',
            },
          }
        )
      })

      it("finds duplicate count distincts", async () => {
        await config.api.viewV2.create(
          {
            tableId: table._id!,
            name: generator.guid(),
            type: ViewV2Type.CALCULATION,
            schema: {
              count: {
                visible: true,
                calculationType: CalculationType.COUNT,
                distinct: true,
                field: "Price",
              },
              count2: {
                visible: true,
                calculationType: CalculationType.COUNT,
                distinct: true,
                field: "Price",
              },
            },
          },
          {
            status: 400,
            body: {
              message:
                'Duplicate calculation on field "Price", calculation type "count"',
            },
          }
        )
      })

      it("does not confuse counts and count distincts in the duplicate check", async () => {
        await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          type: ViewV2Type.CALCULATION,
          schema: {
            count: {
              visible: true,
              calculationType: CalculationType.COUNT,
            },
            count2: {
              visible: true,
              calculationType: CalculationType.COUNT,
              distinct: true,
              field: "Price",
            },
          },
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
              operator: BasicOperator.EQUAL,
              field: "newField",
              value: "thatValue",
            },
          ],
        })

        expect((await config.api.table.get(tableId)).views).toEqual({
          [view.name]: {
            ...view,
            query: [
              { operator: "equal", field: "newField", value: "thatValue" },
            ],
            schema: expect.anything(),
          },
        })
      })

      it("can update all fields", async () => {
        const tableId = table._id!

        const updatedData: Required<
          Omit<UpdateViewRequest, "queryUI" | "type">
        > = {
          version: view.version,
          id: view.id,
          tableId,
          name: view.name,
          primaryDisplay: "Price",
          query: [
            {
              operator: BasicOperator.EQUAL,
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
                operator: BasicOperator.EQUAL,
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

      isInternal &&
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

      it("cannot update view type after creation", async () => {
        const view = await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          schema: {
            id: { visible: true },
            Price: {
              visible: true,
            },
          },
        })

        await config.api.viewV2.update(
          {
            ...view,
            type: ViewV2Type.CALCULATION,
          },
          {
            status: 400,
            body: {
              message: "Cannot update view type after creation",
            },
          }
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
          ;(tableToUpdate.views![view.name] as ViewV2).schema!.id.visible =
            false
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

      !isLucene &&
        describe("calculation views", () => {
          let table: Table
          let view: ViewV2

          beforeEach(async () => {
            table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                    constraints: {
                      presence: true,
                    },
                  },
                  country: {
                    name: "country",
                    type: FieldType.STRING,
                  },
                  age: {
                    name: "age",
                    type: FieldType.NUMBER,
                  },
                },
              })
            )

            view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                country: {
                  visible: true,
                },
                age: {
                  visible: true,
                  calculationType: CalculationType.SUM,
                  field: "age",
                },
              },
            })

            await config.api.row.bulkImport(table._id!, {
              rows: [
                {
                  name: "Steve",
                  age: 30,
                  country: "UK",
                },
                {
                  name: "Jane",
                  age: 31,
                  country: "UK",
                },
                {
                  name: "Ruari",
                  age: 32,
                  country: "USA",
                },
                {
                  name: "Alice",
                  age: 33,
                  country: "USA",
                },
              ],
            })
          })

          it("returns the expected rows prior to modification", async () => {
            const { rows } = await config.api.row.search(view.id)
            expect(rows).toHaveLength(2)
            expect(rows).toEqual(
              expect.arrayContaining([
                {
                  country: "USA",
                  age: 65,
                },
                {
                  country: "UK",
                  age: 61,
                },
              ])
            )
          })

          it("can remove a group by field", async () => {
            delete view.schema!.country
            await config.api.viewV2.update(view)

            const { rows } = await config.api.row.search(view.id)
            expect(rows).toHaveLength(1)
            expect(rows).toEqual(
              expect.arrayContaining([
                {
                  age: 126,
                },
              ])
            )
          })

          it("can remove a calculation field", async () => {
            delete view.schema!.age
            await config.api.viewV2.update(view)

            const { rows } = await config.api.row.search(view.id)
            expect(rows).toHaveLength(4)

            // Because the removal of the calculation field actually makes this
            // no longer a calculation view, these rows will now have _id and
            // _rev fields.
            expect(rows).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ country: "UK" }),
                expect.objectContaining({ country: "UK" }),
                expect.objectContaining({ country: "USA" }),
                expect.objectContaining({ country: "USA" }),
              ])
            )
          })

          it("can add a new group by field", async () => {
            view.schema!.name = { visible: true }
            await config.api.viewV2.update(view)

            const { rows } = await config.api.row.search(view.id)
            expect(rows).toHaveLength(4)
            expect(rows).toEqual(
              expect.arrayContaining([
                {
                  name: "Steve",
                  age: 30,
                  country: "UK",
                },
                {
                  name: "Jane",
                  age: 31,
                  country: "UK",
                },
                {
                  name: "Ruari",
                  age: 32,
                  country: "USA",
                },
                {
                  name: "Alice",
                  age: 33,
                  country: "USA",
                },
              ])
            )
          })

          it("can add a new group by field that is invisible, even if required on the table", async () => {
            view.schema!.name = { visible: false }
            await config.api.viewV2.update(view)

            const { rows } = await config.api.row.search(view.id)
            expect(rows).toHaveLength(2)
            expect(rows).toEqual(
              expect.arrayContaining([
                {
                  country: "USA",
                  age: 65,
                },
                {
                  country: "UK",
                  age: 61,
                },
              ])
            )
          })

          it("can add a new calculation field", async () => {
            view.schema!.count = {
              visible: true,
              calculationType: CalculationType.COUNT,
            }
            await config.api.viewV2.update(view)

            const { rows } = await config.api.row.search(view.id)
            expect(rows).toHaveLength(2)
            expect(rows).toEqual(
              expect.arrayContaining([
                {
                  country: "USA",
                  age: 65,
                  count: 2,
                },
                {
                  country: "UK",
                  age: 61,
                  count: 2,
                },
              ])
            )
          })
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

    describe.each([
      ["from view api", (view: ViewV2) => config.api.viewV2.get(view.id)],
      [
        "from table",
        async (view: ViewV2) => {
          const table = await config.api.table.get(view.tableId)
          return table.views![view.name] as ViewV2
        },
      ],
    ])("read (%s)", (_, getDelegate) => {
      let table: Table
      let tableId: string

      beforeEach(async () => {
        table = await config.api.table.save(
          saveTableRequest({
            schema: {
              one: {
                type: FieldType.STRING,
                name: "one",
              },
              two: {
                type: FieldType.STRING,
                name: "two",
              },
              three: {
                type: FieldType.STRING,
                name: "three",
              },
            },
          })
        )
        tableId = table._id!
      })

      it("retrieves the view data with the enriched schema", async () => {
        const view = await config.api.viewV2.create({
          tableId,
          name: generator.guid(),
          schema: {
            id: { visible: true },
            one: { visible: true },
            two: { visible: true },
          },
        })

        expect(await getDelegate(view)).toEqual({
          ...view,
          schema: {
            id: { ...table.schema["id"], visible: true },
            one: { ...table.schema["one"], visible: true },
            two: { ...table.schema["two"], visible: true },
            three: { ...table.schema["three"], visible: false },
          },
        })
      })

      it("does not include columns removed from the table", async () => {
        const view = await config.api.viewV2.create({
          tableId,
          name: generator.guid(),
          schema: {
            id: { visible: true },
            one: { visible: true },
            two: { visible: true },
          },
        })
        const table = await config.api.table.get(tableId)
        const { one: _, ...newSchema } = table.schema
        await config.api.table.save({ ...table, schema: newSchema })

        expect(await getDelegate(view)).toEqual({
          ...view,
          schema: {
            id: { ...table.schema["id"], visible: true },
            two: { ...table.schema["two"], visible: true },
            three: { ...table.schema["three"], visible: false },
          },
        })
      })

      it("does not include columns hidden from the table", async () => {
        const view = await config.api.viewV2.create({
          tableId,
          name: generator.guid(),
          schema: {
            id: { visible: true },
            one: { visible: true },
            two: { visible: true },
          },
        })
        const table = await config.api.table.get(tableId)
        await config.api.table.save({
          ...table,
          schema: {
            ...table.schema,
            two: { ...table.schema["two"], visible: false },
          },
        })

        expect(await getDelegate(view)).toEqual({
          ...view,
          schema: {
            id: { ...table.schema["id"], visible: true },
            one: { ...table.schema["one"], visible: true },
            three: { ...table.schema["three"], visible: false },
          },
        })
      })

      it("should be able to fetch readonly config after downgrades", async () => {
        const res = await config.api.viewV2.create({
          name: generator.name(),
          tableId: table._id!,
          schema: {
            id: { visible: true },
            one: { visible: true, readonly: true },
          },
        })

        mocks.licenses.useCloudFree()
        const view = await getDelegate(res)
        expect(view.schema?.one).toEqual(
          expect.objectContaining({ visible: true, readonly: true })
        )
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
                  type: FieldType.NUMBER,
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

      describe("foreign relationship columns", () => {
        const createAuxTable = () =>
          config.api.table.save(
            saveTableRequest({
              primaryDisplay: "name",
              schema: {
                name: { name: "name", type: FieldType.STRING },
                age: { name: "age", type: FieldType.NUMBER },
              },
            })
          )

        const createMainTable = async (
          links: {
            name: string
            tableId: string
            fk: string
          }[]
        ) => {
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {},
            })
          )
          await config.api.table.save({
            ...table,
            schema: {
              ...table.schema,
              ...links.reduce<TableSchema>((acc, c) => {
                acc[c.name] = {
                  name: c.name,
                  relationshipType: RelationshipType.ONE_TO_MANY,
                  type: FieldType.LINK,
                  tableId: c.tableId,
                  fieldName: c.fk,
                  constraints: { type: "array" },
                }
                return acc
              }, {}),
            },
          })
          return table
        }

        const createView = async (tableId: string, schema: ViewV2Schema) =>
          await config.api.viewV2.create({
            name: generator.guid(),
            tableId,
            schema,
          })

        const renameColumn = async (table: Table, renaming: RenameColumn) => {
          const newSchema = { ...table.schema }
          newSchema[renaming.updated] = {
            ...table.schema[renaming.old],
            name: renaming.updated,
          }
          delete newSchema[renaming.old]

          await config.api.table.save({
            ...table,
            schema: newSchema,
            _rename: renaming,
          })
        }

        it("updating a column will update link columns configuration", async () => {
          let auxTable = await createAuxTable()

          const table = await createMainTable([
            { name: "aux", tableId: auxTable._id!, fk: "fk_aux" },
          ])
          // Refetch auxTable
          auxTable = await config.api.table.get(auxTable._id!)

          const view = await createView(table._id!, {
            aux: {
              visible: true,
              columns: {
                name: { visible: true, readonly: true },
                age: { visible: true, readonly: true },
              },
            },
          })

          await renameColumn(auxTable, { old: "age", updated: "dob" })

          const updatedView = await config.api.viewV2.get(view.id)
          expect(updatedView).toEqual(
            expect.objectContaining({
              schema: expect.objectContaining({
                aux: expect.objectContaining({
                  columns: {
                    id: expect.objectContaining({
                      visible: false,
                      readonly: false,
                    }),
                    name: expect.objectContaining({
                      visible: true,
                      readonly: true,
                    }),
                    dob: expect.objectContaining({
                      visible: true,
                      readonly: true,
                    }),
                  },
                }),
              }),
            })
          )
        })

        it("handles multiple fields using the same table", async () => {
          let auxTable = await createAuxTable()

          const table = await createMainTable([
            { name: "aux", tableId: auxTable._id!, fk: "fk_aux" },
            { name: "aux2", tableId: auxTable._id!, fk: "fk_aux2" },
          ])
          // Refetch auxTable
          auxTable = await config.api.table.get(auxTable._id!)

          const view = await createView(table._id!, {
            aux: {
              visible: true,
              columns: {
                name: { visible: true, readonly: true },
                age: { visible: true, readonly: true },
              },
            },
            aux2: {
              visible: true,
              columns: {
                name: { visible: true, readonly: true },
                age: { visible: true, readonly: true },
              },
            },
          })

          await renameColumn(auxTable, { old: "age", updated: "dob" })

          const updatedView = await config.api.viewV2.get(view.id)
          expect(updatedView).toEqual(
            expect.objectContaining({
              schema: expect.objectContaining({
                aux: expect.objectContaining({
                  columns: {
                    id: expect.objectContaining({
                      visible: false,
                      readonly: false,
                    }),
                    name: expect.objectContaining({
                      visible: true,
                      readonly: true,
                    }),
                    dob: expect.objectContaining({
                      visible: true,
                      readonly: true,
                    }),
                  },
                }),
                aux2: expect.objectContaining({
                  columns: {
                    id: expect.objectContaining({
                      visible: false,
                      readonly: false,
                    }),
                    name: expect.objectContaining({
                      visible: true,
                      readonly: true,
                    }),
                    dob: expect.objectContaining({
                      visible: true,
                      readonly: true,
                    }),
                  },
                }),
              }),
            })
          )
        })

        it("does not rename columns with the same name but from other tables", async () => {
          let auxTable = await createAuxTable()
          let aux2Table = await createAuxTable()

          const table = await createMainTable([
            { name: "aux", tableId: auxTable._id!, fk: "fk_aux" },
            { name: "aux2", tableId: aux2Table._id!, fk: "fk_aux2" },
          ])

          // Refetch auxTable
          auxTable = await config.api.table.get(auxTable._id!)

          const view = await createView(table._id!, {
            aux: {
              visible: true,
              columns: {
                name: { visible: true, readonly: true },
              },
            },
            aux2: {
              visible: true,
              columns: {
                name: { visible: true, readonly: true },
              },
            },
          })

          await renameColumn(auxTable, { old: "name", updated: "fullName" })

          const updatedView = await config.api.viewV2.get(view.id)
          expect(updatedView).toEqual(
            expect.objectContaining({
              schema: expect.objectContaining({
                aux: expect.objectContaining({
                  columns: {
                    id: expect.objectContaining({
                      visible: false,
                      readonly: false,
                    }),
                    fullName: expect.objectContaining({
                      visible: true,
                      readonly: true,
                    }),
                    age: expect.objectContaining({
                      visible: false,
                      readonly: false,
                    }),
                  },
                }),
                aux2: expect.objectContaining({
                  columns: {
                    id: expect.objectContaining({
                      visible: false,
                      readonly: false,
                    }),
                    name: expect.objectContaining({
                      visible: true,
                      readonly: true,
                    }),
                    age: expect.objectContaining({
                      visible: false,
                      readonly: false,
                    }),
                  },
                }),
              }),
            })
          )
        })

        it("updates all views references", async () => {
          let auxTable = await createAuxTable()

          const table1 = await createMainTable([
            { name: "aux", tableId: auxTable._id!, fk: "fk_aux_table1" },
          ])
          const table2 = await createMainTable([
            { name: "aux", tableId: auxTable._id!, fk: "fk_aux_table2" },
          ])

          // Refetch auxTable
          auxTable = await config.api.table.get(auxTable._id!)

          const viewSchema = {
            aux: {
              visible: true,
              columns: {
                name: { visible: true, readonly: true },
                age: { visible: true, readonly: true },
              },
            },
          }
          const view1 = await createView(table1._id!, viewSchema)
          const view2 = await createView(table1._id!, viewSchema)
          const view3 = await createView(table2._id!, viewSchema)

          await renameColumn(auxTable, { old: "age", updated: "dob" })

          for (const view of [view1, view2, view3]) {
            const updatedView = await config.api.viewV2.get(view.id)
            expect(updatedView).toEqual(
              expect.objectContaining({
                schema: expect.objectContaining({
                  aux: expect.objectContaining({
                    columns: {
                      id: expect.objectContaining({
                        visible: false,
                        readonly: false,
                      }),
                      name: expect.objectContaining({
                        visible: true,
                        readonly: true,
                      }),
                      dob: expect.objectContaining({
                        visible: true,
                        readonly: true,
                      }),
                    },
                  }),
                }),
              })
            )
          }
        })
      })
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
            default: {
              type: FieldType.STRING,
              name: "default",
              default: "default",
            },
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
          default: "ohnoes",
        })

        const row = await config.api.row.get(table._id!, newRow._id!)
        expect(row.one).toBeUndefined()
        expect(row.two).toEqual("bar")
        expect(row.default).toEqual("default")
      })

      it("can't persist readonly columns", async () => {
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

      it("should not return non-view view fields for a row", async () => {
        const newRow = await config.api.row.save(view.id, {
          one: "foo",
          two: "bar",
        })

        expect(newRow.one).toBeUndefined()
        expect(newRow.two).toEqual("bar")
      })
    })

    describe("patch", () => {
      it("should not return non-view view fields for a row", async () => {
        const newRow = await config.api.row.save(table._id!, {
          one: "foo",
          two: "bar",
        })
        const row = await config.api.row.patch(view.id, {
          tableId: table._id!,
          _id: newRow._id!,
          _rev: newRow._rev!,
          one: "newFoo",
          two: "newBar",
        })

        expect(row.one).toBeUndefined()
        expect(row.two).toEqual("newBar")
      })

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
      const getRowUsage = async () => {
        const { total } = await config.doInContext(undefined, () =>
          quotas.getCurrentUsageValues(
            QuotaUsageType.STATIC,
            StaticQuotaName.ROWS
          )
        )
        return total
      }

      const assertRowUsage = async (expected: number) => {
        const usage = await getRowUsage()
        expect(usage).toBe(expected)
      }

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

    describe("read", () => {
      let view: ViewV2
      let table: Table

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
              operator: BasicOperator.EQUAL,
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

      it("views filters are respected even if the column is hidden", async () => {
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
              operator: BasicOperator.EQUAL,
              field: "two",
              value: "bar2",
            },
          ],
          schema: {
            id: { visible: true },
            one: { visible: false },
            two: { visible: false },
          },
        })

        const response = await config.api.viewV2.search(view.id)
        expect(response.rows).toHaveLength(1)
        expect(response.rows).toEqual([
          expect.objectContaining({ _id: two._id }),
        ])
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

      it("can query on top of the view filters", async () => {
        await config.api.row.save(table._id!, {
          one: "foo",
          two: "bar",
        })
        await config.api.row.save(table._id!, {
          one: "foo2",
          two: "bar2",
        })
        const three = await config.api.row.save(table._id!, {
          one: "foo3",
          two: "bar3",
        })

        const view = await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          query: [
            {
              operator: BasicOperator.NOT_EQUAL,
              field: "one",
              value: "foo2",
            },
          ],
          schema: {
            id: { visible: true },
            one: { visible: true },
            two: { visible: true },
          },
        })

        const response = await config.api.viewV2.search(view.id, {
          query: {
            [BasicOperator.EQUAL]: {
              two: "bar3",
            },
            [BasicOperator.NOT_EMPTY]: {
              two: null,
            },
          },
        })
        expect(response.rows).toHaveLength(1)
        expect(response.rows).toEqual(
          expect.arrayContaining([expect.objectContaining({ _id: three._id })])
        )
      })

      it("can query on top of the view filters (using or filters)", async () => {
        const one = await config.api.row.save(table._id!, {
          one: "foo",
          two: "bar",
        })
        await config.api.row.save(table._id!, {
          one: "foo2",
          two: "bar2",
        })
        const three = await config.api.row.save(table._id!, {
          one: "foo3",
          two: "bar3",
        })

        const view = await config.api.viewV2.create({
          tableId: table._id!,
          name: generator.guid(),
          query: [
            {
              operator: BasicOperator.NOT_EQUAL,
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

        const response = await config.api.viewV2.search(view.id, {
          query: {
            allOr: true,
            [BasicOperator.NOT_EQUAL]: {
              two: "bar",
            },
            [BasicOperator.NOT_EMPTY]: {
              two: null,
            },
          },
        })
        expect(response.rows).toHaveLength(2)
        expect(response.rows).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ _id: one._id }),
            expect.objectContaining({ _id: three._id }),
          ])
        )
      })

      isLucene &&
        it.each([true, false])(
          "in lucene, cannot override a view filter",
          async allOr => {
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
                  operator: BasicOperator.EQUAL,
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

            const response = await config.api.viewV2.search(view.id, {
              query: {
                allOr,
                equal: {
                  two: "bar",
                },
              },
            })
            expect(response.rows).toHaveLength(1)
            expect(response.rows).toEqual([
              expect.objectContaining({ _id: two._id }),
            ])
          }
        )

      !isLucene &&
        it.each([true, false])(
          "can filter a view without a view filter",
          async allOr => {
            const one = await config.api.row.save(table._id!, {
              one: "foo",
              two: "bar",
            })
            await config.api.row.save(table._id!, {
              one: "foo2",
              two: "bar2",
            })

            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              schema: {
                id: { visible: true },
                one: { visible: false },
                two: { visible: true },
              },
            })

            const response = await config.api.viewV2.search(view.id, {
              query: {
                allOr,
                equal: {
                  two: "bar",
                },
              },
            })
            expect(response.rows).toHaveLength(1)
            expect(response.rows).toEqual([
              expect.objectContaining({ _id: one._id }),
            ])
          }
        )

      !isLucene &&
        it.each([true, false])("cannot bypass a view filter", async allOr => {
          await config.api.row.save(table._id!, {
            one: "foo",
            two: "bar",
          })
          await config.api.row.save(table._id!, {
            one: "foo2",
            two: "bar2",
          })

          const view = await config.api.viewV2.create({
            tableId: table._id!,
            name: generator.guid(),
            query: [
              {
                operator: BasicOperator.EQUAL,
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

          const response = await config.api.viewV2.search(view.id, {
            query: {
              allOr,
              equal: {
                two: "bar",
              },
            },
          })
          expect(response.rows).toHaveLength(0)
        })

      describe("foreign relationship columns", () => {
        let envCleanup: () => void
        beforeAll(() => {
          envCleanup = features.testutils.setFeatureFlags("*", {
            ENRICHED_RELATIONSHIPS: true,
          })
        })

        afterAll(() => {
          envCleanup?.()
        })

        const createMainTable = async (
          links: {
            name: string
            tableId: string
            fk: string
          }[]
        ) => {
          const table = await config.api.table.save(
            saveTableRequest({
              schema: { title: { name: "title", type: FieldType.STRING } },
            })
          )
          await config.api.table.save({
            ...table,
            schema: {
              ...table.schema,
              ...links.reduce<TableSchema>((acc, c) => {
                acc[c.name] = {
                  name: c.name,
                  relationshipType: RelationshipType.ONE_TO_MANY,
                  type: FieldType.LINK,
                  tableId: c.tableId,
                  fieldName: c.fk,
                  constraints: { type: "array" },
                }
                return acc
              }, {}),
            },
          })
          return table
        }
        const createAuxTable = (schema: TableSchema) =>
          config.api.table.save(
            saveTableRequest({
              primaryDisplay: "name",
              schema: {
                ...schema,
                name: { name: "name", type: FieldType.STRING },
              },
            })
          )

        it("returns squashed fields respecting the view config", async () => {
          const auxTable = await createAuxTable({
            age: { name: "age", type: FieldType.NUMBER },
          })
          const auxRow = await config.api.row.save(auxTable._id!, {
            name: generator.name(),
            age: generator.age(),
          })

          const table = await createMainTable([
            { name: "aux", tableId: auxTable._id!, fk: "fk_aux" },
          ])
          await config.api.row.save(table._id!, {
            title: generator.word(),
            aux: [auxRow],
          })

          const view = await config.api.viewV2.create({
            tableId: table._id!,
            name: generator.guid(),
            schema: {
              title: { visible: true },
              aux: {
                visible: true,
                columns: {
                  name: { visible: false, readonly: false },
                  age: { visible: true, readonly: true },
                },
              },
            },
          })

          const response = await config.api.viewV2.search(view.id)
          expect(response.rows).toEqual([
            expect.objectContaining({
              aux: [
                {
                  _id: auxRow._id,
                  primaryDisplay: auxRow.name,
                  age: auxRow.age,
                },
              ],
            }),
          ])
        })

        it("enriches squashed fields", async () => {
          const auxTable = await createAuxTable({
            user: {
              name: "user",
              type: FieldType.BB_REFERENCE_SINGLE,
              subtype: BBReferenceFieldSubType.USER,
              constraints: { presence: true },
            },
          })
          const table = await createMainTable([
            { name: "aux", tableId: auxTable._id!, fk: "fk_aux" },
          ])

          const user = config.getUser()
          const auxRow = await config.api.row.save(auxTable._id!, {
            name: generator.name(),
            user: user._id,
          })
          await config.api.row.save(table._id!, {
            title: generator.word(),
            aux: [auxRow],
          })

          const view = await config.api.viewV2.create({
            tableId: table._id!,
            name: generator.guid(),
            schema: {
              title: { visible: true },
              aux: {
                visible: true,
                columns: {
                  name: { visible: true, readonly: true },
                  user: { visible: true, readonly: true },
                },
              },
            },
          })

          const response = await config.api.viewV2.search(view.id)

          expect(response.rows).toEqual([
            expect.objectContaining({
              aux: [
                {
                  _id: auxRow._id,
                  primaryDisplay: auxRow.name,
                  name: auxRow.name,
                  user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    primaryDisplay: user.email,
                  },
                },
              ],
            }),
          ])
        })
      })

      !isLucene &&
        describe("calculations", () => {
          let table: Table
          let rows: Row[]

          beforeAll(async () => {
            table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  quantity: {
                    type: FieldType.NUMBER,
                    name: "quantity",
                  },
                  price: {
                    type: FieldType.NUMBER,
                    name: "price",
                  },
                },
              })
            )

            rows = await Promise.all(
              Array.from({ length: 10 }, () =>
                config.api.row.save(table._id!, {
                  quantity: generator.natural({ min: 1, max: 10 }),
                  price: generator.natural({ min: 1, max: 10 }),
                })
              )
            )
          })

          it("should be able to search by calculations", async () => {
            const view = await config.api.viewV2.create({
              tableId: table._id!,
              type: ViewV2Type.CALCULATION,
              name: generator.guid(),
              schema: {
                "Quantity Sum": {
                  visible: true,
                  calculationType: CalculationType.SUM,
                  field: "quantity",
                },
              },
            })

            const response = await config.api.viewV2.search(view.id, {
              query: {},
            })

            expect(response.rows).toHaveLength(1)
            expect(response.rows).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  "Quantity Sum": rows.reduce((acc, r) => acc + r.quantity, 0),
                }),
              ])
            )

            // Calculation views do not return rows that can be linked back to
            // the source table, and so should not have an _id field.
            for (const row of response.rows) {
              expect("_id" in row).toBe(false)
            }
          })

          it("should be able to group by a basic field", async () => {
            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                quantity: {
                  visible: true,
                  field: "quantity",
                },
                "Total Price": {
                  visible: true,
                  calculationType: CalculationType.SUM,
                  field: "price",
                },
              },
            })

            const response = await config.api.viewV2.search(view.id, {
              query: {},
            })

            const priceByQuantity: Record<number, number> = {}
            for (const row of rows) {
              priceByQuantity[row.quantity] ??= 0
              priceByQuantity[row.quantity] += row.price
            }

            for (const row of response.rows) {
              expect(row["Total Price"]).toEqual(priceByQuantity[row.quantity])
            }
          })

          it.each([
            CalculationType.COUNT,
            CalculationType.SUM,
            CalculationType.AVG,
            CalculationType.MIN,
            CalculationType.MAX,
          ])("should be able to calculate $type", async type => {
            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                aggregate: {
                  visible: true,
                  calculationType: type,
                  field: "price",
                },
              },
            })

            const response = await config.api.viewV2.search(view.id, {
              query: {},
            })

            function calculate(
              type: CalculationType,
              numbers: number[]
            ): number {
              switch (type) {
                case CalculationType.COUNT:
                  return numbers.length
                case CalculationType.SUM:
                  return numbers.reduce((a, b) => a + b, 0)
                case CalculationType.AVG:
                  return numbers.reduce((a, b) => a + b, 0) / numbers.length
                case CalculationType.MIN:
                  return Math.min(...numbers)
                case CalculationType.MAX:
                  return Math.max(...numbers)
              }
            }

            const prices = rows.map(row => row.price)
            const expected = calculate(type, prices)
            const actual = response.rows[0].aggregate

            if (type === CalculationType.AVG) {
              // The average calculation can introduce floating point rounding
              // errors, so we need to compare to within a small margin of
              // error.
              expect(actual).toBeCloseTo(expected)
            } else {
              expect(actual).toEqual(expected)
            }
          })

          it("should be able to do a COUNT(DISTINCT)", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                  },
                },
              })
            )

            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                count: {
                  visible: true,
                  calculationType: CalculationType.COUNT,
                  distinct: true,
                  field: "name",
                },
              },
            })

            await config.api.row.bulkImport(table._id!, {
              rows: [
                {
                  name: "John",
                },
                {
                  name: "John",
                },
                {
                  name: "Sue",
                },
              ],
            })

            const { rows } = await config.api.row.search(view.id)
            expect(rows).toHaveLength(1)
            expect(rows[0].count).toEqual(2)
          })

          it("should not be able to COUNT(DISTINCT ...) against a non-existent field", async () => {
            await config.api.viewV2.create(
              {
                tableId: table._id!,
                name: generator.guid(),
                type: ViewV2Type.CALCULATION,
                schema: {
                  count: {
                    visible: true,
                    calculationType: CalculationType.COUNT,
                    distinct: true,
                    field: "does not exist oh no",
                  },
                },
              },
              {
                status: 400,
                body: {
                  message:
                    'Calculation field "count" references field "does not exist oh no" which does not exist in the table schema',
                },
              }
            )
          })
        })

      !isLucene &&
        it("should not need required fields to be present", async () => {
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                name: {
                  name: "name",
                  type: FieldType.STRING,
                  constraints: {
                    presence: true,
                  },
                },
                age: {
                  name: "age",
                  type: FieldType.NUMBER,
                },
              },
            })
          )

          await Promise.all([
            config.api.row.save(table._id!, { name: "Steve", age: 30 }),
            config.api.row.save(table._id!, { name: "Jane", age: 31 }),
          ])

          const view = await config.api.viewV2.create({
            tableId: table._id!,
            name: generator.guid(),
            type: ViewV2Type.CALCULATION,
            schema: {
              sum: {
                visible: true,
                calculationType: CalculationType.SUM,
                field: "age",
              },
            },
          })

          const response = await config.api.viewV2.search(view.id, {
            query: {},
          })

          expect(response.rows).toHaveLength(1)
          expect(response.rows[0].sum).toEqual(61)
        })
    })

    describe("permissions", () => {
      beforeEach(async () => {
        await Promise.all(
          Array.from({ length: 10 }, () => config.api.row.save(table._id!, {}))
        )
      })

      it("does not allow public users to fetch by default", async () => {
        await config.publish()
        await config.api.viewV2.publicSearch(view.id, undefined, {
          status: 401,
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
        await config.api.permission.revoke({
          roleId: roles.BUILTIN_ROLE_IDS.PUBLIC, // Don't think this matters since we are revoking the permission
          level: PermissionLevel.READ,
          resourceId: view.id,
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
          status: 401,
        })
      })
    })
  })
})
