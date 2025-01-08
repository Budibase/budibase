import {
  AIOperationEnum,
  ArrayOperator,
  BasicOperator,
  BBReferenceFieldSubType,
  CalculationType,
  CreateViewRequest,
  Datasource,
  EmptyFilterOption,
  FieldSchema,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  JsonFieldSubType,
  JsonTypes,
  LegacyFilter,
  NumericCalculationFieldMetadata,
  PermissionLevel,
  QuotaUsageType,
  RelationshipType,
  RenameColumn,
  Row,
  SaveTableRequest,
  SearchFilters,
  SearchResponse,
  SearchViewRowRequest,
  SortOrder,
  SortType,
  StaticQuotaName,
  Table,
  TableSchema,
  TableSourceType,
  UILogicalOperator,
  UISearchFilter,
  UpdateViewRequest,
  ViewV2,
  ViewV2Schema,
  ViewV2Type,
} from "@budibase/types"
import { generator, mocks } from "@budibase/backend-core/tests"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import merge from "lodash/merge"
import { quotas } from "@budibase/pro"
import { context, db, events, roles, setEnv } from "@budibase/backend-core"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/openai"
import nock from "nock"

const descriptions = datasourceDescribe({ exclude: [DatabaseName.MONGODB] })

if (descriptions.length) {
  describe.each(descriptions)(
    "/v2/views ($dbName)",
    ({ config, isInternal, dsProvider }) => {
      let table: Table
      let rawDatasource: Datasource | undefined
      let datasource: Datasource | undefined

      function saveTableRequest(
        ...overrides: Partial<SaveTableRequest>[]
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
        await config.init()
        mocks.licenses.useCloudFree()

        const ds = await dsProvider()
        rawDatasource = ds.rawDatasource
        datasource = ds.datasource
        table = await config.api.table.save(priceTable())
      })

      beforeEach(() => {
        jest.clearAllMocks()
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
            expect(events.view.created).toHaveBeenCalledTimes(1)
          })

          it("can persist views with all fields", async () => {
            const newView: Required<Omit<CreateViewRequest, "query" | "type">> =
              {
                name: generator.name(),
                tableId: table._id!,
                primaryDisplay: "id",
                queryUI: {
                  groups: [
                    {
                      filters: [
                        {
                          operator: BasicOperator.EQUAL,
                          field: "field",
                          value: "value",
                        },
                      ],
                    },
                  ],
                },
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
                rowHeight: generator.integer(),
              }
            const res = await config.api.viewV2.create(newView)

            const expected: ViewV2 = {
              ...newView,
              schema: {
                id: { visible: true },
                Price: {
                  visible: true,
                },
              },
              query: {
                onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                $and: {
                  conditions: [
                    {
                      $and: {
                        conditions: [
                          {
                            equal: {
                              field: "value",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              id: expect.any(String),
              version: 2,
            }

            expect(res).toEqual(expected)
            expect(events.view.created).toHaveBeenCalledTimes(1)
          })

          it("can create a view with just a query field, no queryUI, for backwards compatibility", async () => {
            const newView: Required<
              Omit<CreateViewRequest, "queryUI" | "type">
            > = {
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
              rowHeight: generator.integer(),
            }
            const res = await config.api.viewV2.create(newView)
            expect(events.view.created).toHaveBeenCalledTimes(1)

            const expected: ViewV2 = {
              ...newView,
              schema: {
                id: { visible: true },
                Price: {
                  visible: true,
                },
              },
              queryUI: {
                logicalOperator: UILogicalOperator.ALL,
                onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                groups: [
                  {
                    logicalOperator: UILogicalOperator.ALL,
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "field",
                        value: "value",
                      },
                    ],
                  },
                ],
              },
              id: expect.any(String),
              version: 2,
            }

            expect(res).toEqual(expected)
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
              } as ViewV2Schema,
            }

            const createdView = await config.api.viewV2.create(newView)
            expect(events.view.created).toHaveBeenCalledTimes(1)

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
              } as ViewV2Schema,
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
                message:
                  'Field "nonExisting" is not valid for the requested table',
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
                message:
                  'You can\'t hide "name" because it is the display column.',
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
                  countDistinct: {
                    visible: true,
                    calculationType: CalculationType.COUNT,
                    distinct: true,
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
                },
              },
              {
                status: 400,
                body: {
                  message:
                    "Calculation views can only have a maximum of 5 fields",
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
                    field: "Price",
                  },
                  count2: {
                    visible: true,
                    calculationType: CalculationType.COUNT,
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
                    'Duplicate calculation on field "Price", calculation type "count distinct"',
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
                  field: "Price",
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

          it("does not confuse counts on different fields in the duplicate check", async () => {
            await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                count: {
                  visible: true,
                  calculationType: CalculationType.COUNT,
                  field: "Price",
                },
                count2: {
                  visible: true,
                  calculationType: CalculationType.COUNT,
                  field: "Category",
                },
              },
            })
          })

          it("does not get confused when a calculation field shadows a basic one", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  age: {
                    name: "age",
                    type: FieldType.NUMBER,
                  },
                },
              })
            )

            await config.api.row.bulkImport(table._id!, {
              rows: [{ age: 1 }, { age: 2 }, { age: 3 }],
            })

            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                age: {
                  visible: true,
                  calculationType: CalculationType.SUM,
                  field: "age",
                },
              },
            })

            const { rows } = await config.api.row.search(view.id)
            expect(rows).toHaveLength(1)
            expect(rows[0].age).toEqual(6)
          })

          // We don't allow the creation of tables with most JsonTypes when using
          // external datasources.
          isInternal &&
            it("cannot use complex types as group-by fields", async () => {
              for (const type of JsonTypes) {
                const field = { name: "field", type } as FieldSchema
                const table = await config.api.table.save(
                  saveTableRequest({ schema: { field } })
                )
                await config.api.viewV2.create(
                  {
                    tableId: table._id!,
                    name: generator.guid(),
                    type: ViewV2Type.CALCULATION,
                    schema: {
                      field: { visible: true },
                    },
                  },
                  {
                    status: 400,
                    body: {
                      message: `Grouping by fields of type "${type}" is not supported`,
                    },
                  }
                )
              }
            })

          isInternal &&
            it("shouldn't trigger a complex type check on a group by field if field is invisible", async () => {
              const table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    field: {
                      name: "field",
                      type: FieldType.JSON,
                    },
                  },
                })
              )

              await config.api.viewV2.create(
                {
                  tableId: table._id!,
                  name: generator.guid(),
                  type: ViewV2Type.CALCULATION,
                  schema: {
                    field: { visible: false },
                  },
                },
                {
                  status: 201,
                }
              )
            })

          isInternal &&
            describe("AI fields", () => {
              let envCleanup: () => void
              beforeAll(() => {
                mocks.licenses.useBudibaseAI()
                mocks.licenses.useAICustomConfigs()
                envCleanup = setEnv({
                  OPENAI_API_KEY: "sk-abcdefghijklmnopqrstuvwxyz1234567890abcd",
                })

                mockChatGPTResponse(prompt => {
                  if (prompt.includes("elephant")) {
                    return "big"
                  }
                  if (prompt.includes("mouse")) {
                    return "small"
                  }
                  if (prompt.includes("whale")) {
                    return "big"
                  }
                  return "unknown"
                })
              })

              afterAll(() => {
                nock.cleanAll()
                envCleanup()
                mocks.licenses.useCloudFree()
              })

              it("can use AI fields in view calculations", async () => {
                const table = await config.api.table.save(
                  saveTableRequest({
                    schema: {
                      animal: {
                        name: "animal",
                        type: FieldType.STRING,
                      },
                      bigOrSmall: {
                        name: "bigOrSmall",
                        type: FieldType.AI,
                        operation: AIOperationEnum.CATEGORISE_TEXT,
                        categories: "big,small",
                        columns: ["animal"],
                      },
                    },
                  })
                )

                const view = await config.api.viewV2.create({
                  tableId: table._id!,
                  name: generator.guid(),
                  type: ViewV2Type.CALCULATION,
                  schema: {
                    bigOrSmall: {
                      visible: true,
                    },
                    count: {
                      visible: true,
                      calculationType: CalculationType.COUNT,
                      field: "animal",
                    },
                  },
                })

                await config.api.row.save(table._id!, {
                  animal: "elephant",
                })

                await config.api.row.save(table._id!, {
                  animal: "mouse",
                })

                await config.api.row.save(table._id!, {
                  animal: "whale",
                })

                const { rows } = await config.api.row.search(view.id, {
                  sort: "bigOrSmall",
                  sortOrder: SortOrder.ASCENDING,
                })
                expect(rows).toHaveLength(2)
                expect(rows[0].bigOrSmall).toEqual("big")
                expect(rows[1].bigOrSmall).toEqual("small")
                expect(rows[0].count).toEqual(2)
                expect(rows[1].count).toEqual(1)
              })
            })
        })

        describe("update", () => {
          let view: ViewV2
          let table: Table

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

            const expected: ViewV2 = {
              ...view,
              query: [
                {
                  operator: BasicOperator.EQUAL,
                  field: "newField",
                  value: "thatValue",
                },
              ],
              // Should also update queryUI because query was not previously set.
              queryUI: {
                onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                logicalOperator: UILogicalOperator.ALL,
                groups: [
                  {
                    logicalOperator: UILogicalOperator.ALL,
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "newField",
                        value: "thatValue",
                      },
                    ],
                  },
                ],
              },
              schema: expect.anything(),
            }

            expect((await config.api.table.get(tableId)).views).toEqual({
              [view.name]: expected,
            })
            expect(events.view.updated).toHaveBeenCalledTimes(1)
          })

          it("handles view grouped filter events", async () => {
            view.queryUI = {
              logicalOperator: UILogicalOperator.ALL,
              onEmptyFilter: EmptyFilterOption.RETURN_ALL,
              groups: [
                {
                  logicalOperator: UILogicalOperator.ALL,
                  filters: [
                    {
                      operator: BasicOperator.EQUAL,
                      field: "newField",
                      value: "newValue",
                    },
                  ],
                },
              ],
            }
            await config.api.viewV2.update(view)
            expect(events.view.filterUpdated).not.toHaveBeenCalled()

            // @ts-ignore
            view.queryUI.groups.push({
              logicalOperator: UILogicalOperator.ALL,
              filters: [
                {
                  operator: BasicOperator.EQUAL,
                  field: "otherField",
                  value: "otherValue",
                },
              ],
            })

            await config.api.viewV2.update(view)
            expect(events.view.filterUpdated).toHaveBeenCalledWith({
              filterGroups: 2,
              tableId: view.tableId,
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
                  field: "newField",
                  value: "newValue",
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
              rowHeight: generator.integer(),
            }
            await config.api.viewV2.update(updatedData)

            const expected: ViewV2 = {
              ...updatedData,
              // queryUI gets generated from query
              queryUI: {
                logicalOperator: UILogicalOperator.ALL,
                onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                groups: [
                  {
                    logicalOperator: UILogicalOperator.ALL,
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "newField",
                        value: "newValue",
                      },
                    ],
                  },
                ],
              },
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
            }

            expect((await config.api.table.get(tableId)).views).toEqual({
              [view.name]: expected,
            })
          })

          it("can update an existing view name", async () => {
            const tableId = table._id!
            const newName = generator.guid()
            await config.api.viewV2.update({ ...view, name: newName })

            expect(await config.api.table.get(tableId)).toEqual(
              expect.objectContaining({
                views: {
                  [newName]: {
                    ...view,
                    name: newName,
                    schema: expect.anything(),
                  },
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
              message:
                "View id does not match between the body and the uri path",
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
              } as ViewV2Schema,
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
                } as ViewV2Schema,
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
                    message:
                      'You can\'t hide "id" because it is a required field.',
                    status: 400,
                  },
                }
              )
            })

          it("can update queryUI field and query gets regenerated", async () => {
            await config.api.viewV2.update({
              ...view,
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "field",
                        value: "value",
                      },
                    ],
                  },
                ],
              },
            })

            let updatedView = await config.api.viewV2.get(view.id)
            let expected: SearchFilters = {
              onEmptyFilter: EmptyFilterOption.RETURN_ALL,
              $and: {
                conditions: [
                  {
                    $and: {
                      conditions: [
                        {
                          equal: { field: "value" },
                        },
                      ],
                    },
                  },
                ],
              },
            }
            expect(updatedView.query).toEqual(expected)

            await config.api.viewV2.update({
              ...updatedView,
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "newField",
                        value: "newValue",
                      },
                    ],
                  },
                ],
              },
            })

            updatedView = await config.api.viewV2.get(view.id)
            expected = {
              onEmptyFilter: EmptyFilterOption.RETURN_ALL,
              $and: {
                conditions: [
                  {
                    $and: {
                      conditions: [
                        {
                          equal: { newField: "newValue" },
                        },
                      ],
                    },
                  },
                ],
              },
            }
            expect(updatedView.query).toEqual(expected)
          })

          it("can delete either query and it will get regenerated from queryUI", async () => {
            await config.api.viewV2.update({
              ...view,
              query: [
                {
                  operator: BasicOperator.EQUAL,
                  field: "field",
                  value: "value",
                },
              ],
            })

            let updatedView = await config.api.viewV2.get(view.id)
            expect(updatedView.queryUI).toBeDefined()

            await config.api.viewV2.update({
              ...updatedView,
              query: undefined,
            })

            updatedView = await config.api.viewV2.get(view.id)
            expect(updatedView.query).toBeDefined()
          })

          // This is because the conversion from queryUI -> query loses data, so you
          // can't accurately reproduce the original queryUI from the query. If
          // query is a LegacyFilter[] we allow it, because for Budibase v3
          // everything in the db had query set to a LegacyFilter[], and there's no
          // loss of information converting from a LegacyFilter[] to a
          // UISearchFilter. But we convert to a SearchFilters and that can't be
          // accurately converted to a UISearchFilter.
          it("can't regenerate queryUI from a query once it has been generated from a queryUI", async () => {
            await config.api.viewV2.update({
              ...view,
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "field",
                        value: "value",
                      },
                    ],
                  },
                ],
              },
            })

            let updatedView = await config.api.viewV2.get(view.id)
            expect(updatedView.query).toBeDefined()

            await config.api.viewV2.update(
              {
                ...updatedView,
                queryUI: undefined,
              },
              {
                status: 400,
                body: {
                  message: "view is missing queryUI field",
                },
              }
            )
          })

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
                field: "age",
              }
              await config.api.viewV2.update(view)
              expect(events.view.calculationCreated).toHaveBeenCalledTimes(1)

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

            const view = await getDelegate(res)
            expect(view.schema?.one).toEqual(
              expect.objectContaining({ visible: true, readonly: true })
            )
          })

          it("should fill in the queryUI field if it's missing", async () => {
            const res = await config.api.viewV2.create({
              name: generator.name(),
              tableId: tableId,
              query: [
                {
                  operator: BasicOperator.EQUAL,
                  field: "one",
                  value: "1",
                },
              ],
              schema: {
                id: { visible: true },
                one: { visible: true },
              },
            })

            const table = await config.api.table.get(tableId)
            const rawView = table.views![res.name] as ViewV2
            delete rawView.queryUI

            await context.doInAppContext(config.getAppId(), async () => {
              const db = context.getAppDB()

              if (!rawDatasource) {
                await db.put(table)
              } else {
                const ds = await config.api.datasource.get(datasource!._id!)
                ds.entities![table.name] = table
                const updatedDs = {
                  ...rawDatasource,
                  _id: ds._id,
                  _rev: ds._rev,
                  entities: ds.entities,
                }
                await db.put(updatedDs)
              }
            })

            const view = await getDelegate(res)
            const expected: UISearchFilter = {
              onEmptyFilter: EmptyFilterOption.RETURN_ALL,
              logicalOperator: UILogicalOperator.ALL,
              groups: [
                {
                  logicalOperator: UILogicalOperator.ALL,
                  filters: [
                    {
                      operator: BasicOperator.EQUAL,
                      field: "one",
                      value: "1",
                    },
                  ],
                },
              ],
            }
            expect(view.queryUI).toEqual(expected)
          })

          it("tables and views can contain whitespaces", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                name: `table with spaces ${generator.hash()}`,
                schema: {
                  name: {
                    type: FieldType.STRING,
                    name: "name",
                  },
                },
              })
            )

            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: `view name with spaces`,
              schema: {
                name: { visible: true },
              },
            })

            expect(await getDelegate(view)).toEqual({
              ...view,
              schema: {
                id: { ...table.schema["id"], visible: false },
                name: { ...table.schema["name"], visible: true },
              },
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

            const renameColumn = async (
              table: Table,
              renaming: RenameColumn
            ) => {
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
              expect(events.view.viewJoinCreated).not.toHaveBeenCalled()
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

            it("handles events for changing column visibility from default false", async () => {
              let auxTable = await createAuxTable()
              let aux2Table = await createAuxTable()

              const table = await createMainTable([
                { name: "aux", tableId: auxTable._id!, fk: "fk_aux" },
                { name: "aux2", tableId: aux2Table._id!, fk: "fk_aux2" },
              ])

              const view = await createView(table._id!, {
                aux: {
                  visible: true,
                  columns: {
                    name: { visible: false, readonly: true },
                  },
                },
                aux2: {
                  visible: true,
                  columns: {
                    name: { visible: false, readonly: true },
                  },
                },
              })

              // @ts-expect-error column exists above
              view.schema.aux2.columns.name.visible = true
              await config.api.viewV2.update(view)
              expect(events.view.viewJoinCreated).toHaveBeenCalledTimes(1)
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

        describe("calculation views", () => {
          it("should not remove calculation columns when modifying table schema", async () => {
            let table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                  },
                  age: {
                    name: "age",
                    type: FieldType.NUMBER,
                  },
                },
              })
            )

            let view = await config.api.viewV2.create({
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

            table = await config.api.table.get(table._id!)
            await config.api.table.save({
              ...table,
              schema: {
                ...table.schema,
                name: {
                  name: "name",
                  type: FieldType.STRING,
                  constraints: { presence: true },
                },
              },
            })

            view = await config.api.viewV2.get(view.id)
            expect(Object.keys(view.schema!).sort()).toEqual([
              "age",
              "id",
              "name",
              "sum",
            ])
          })

          describe("bigints", () => {
            let table: Table
            let view: ViewV2

            beforeEach(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    bigint: {
                      name: "bigint",
                      type: FieldType.BIGINT,
                    },
                  },
                })
              )

              view = await config.api.viewV2.create({
                tableId: table._id!,
                name: generator.guid(),
                type: ViewV2Type.CALCULATION,
                schema: {
                  sum: {
                    visible: true,
                    calculationType: CalculationType.SUM,
                    field: "bigint",
                  },
                },
              })
            })

            it("should not lose precision handling ints larger than JSs int53", async () => {
              // The sum of the following 3 numbers cannot be represented by
              // JavaScripts default int53 datatype for numbers, so this is a test
              // that makes sure we aren't losing precision between the DB and the
              // user.
              await config.api.row.bulkImport(table._id!, {
                rows: [
                  { bigint: "1000000000000000000" },
                  { bigint: "123" },
                  { bigint: "321" },
                ],
              })

              const { rows } = await config.api.row.search(view.id)
              expect(rows).toHaveLength(1)
              expect(rows[0].sum).toEqual("1000000000000000444")
            })

            it("should be able to handle up to 2**63 - 1 bigints", async () => {
              await config.api.row.bulkImport(table._id!, {
                rows: [{ bigint: "9223372036854775806" }, { bigint: "1" }],
              })

              const { rows } = await config.api.row.search(view.id)
              expect(rows).toHaveLength(1)
              expect(rows[0].sum).toEqual("9223372036854775807")
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

          it("should not be possible to create a row in a calculation view", async () => {
            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                id: { visible: true },
                one: { visible: true },
              },
            })

            await config.api.row.save(
              view.id,
              { one: "foo" },
              {
                status: 400,
                body: {
                  message: "Cannot insert rows through a calculation view",
                  status: 400,
                },
              }
            )
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

          it("should not be possible to modify a row in a calculation view", async () => {
            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                id: { visible: true },
                one: { visible: true },
              },
            })

            const newRow = await config.api.row.save(table._id!, {
              one: "foo",
              two: "bar",
            })

            await config.api.row.patch(
              view.id,
              {
                tableId: table._id!,
                _id: newRow._id!,
                _rev: newRow._rev!,
                one: "newFoo",
                two: "newBar",
              },
              {
                status: 400,
                body: {
                  message: "Cannot update rows through a calculation view",
                },
              }
            )
          })
        })

        describe("fetch", () => {
          let view: ViewV2, view2: ViewV2
          let table: Table, table2: Table
          beforeEach(async () => {
            table = await config.api.table.save(saveTableRequest())
            table2 = await config.api.table.save(saveTableRequest())
            view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              schema: {},
            })
            view2 = await config.api.viewV2.create({
              tableId: table2._id!,
              name: generator.guid(),
              schema: {},
            })
          })

          it("should be able to list views", async () => {
            const response = await config.api.viewV2.fetch({
              status: 200,
            })
            expect(response.data.find(v => v.id === view.id)).toBeDefined()
            expect(response.data.find(v => v.id === view2.id)).toBeDefined()
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

            await config.api.row.bulkDelete(view.id, {
              rows: [rows[0], rows[2]],
            })

            await assertRowUsage(isInternal ? rowUsage - 2 : rowUsage)

            await config.api.row.get(table._id!, rows[0]._id!, {
              status: 404,
            })
            await config.api.row.get(table._id!, rows[2]._id!, {
              status: 404,
            })
            await config.api.row.get(table._id!, rows[1]._id!, { status: 200 })
          })

          it("should not be possible to delete a row in a calculation view", async () => {
            const row = await config.api.row.save(table._id!, {})

            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              type: ViewV2Type.CALCULATION,
              schema: {
                id: { visible: true },
                one: { visible: true },
              },
            })

            await config.api.row.delete(
              view.id,
              { _id: row._id! },
              {
                status: 400,
                body: {
                  message: "Cannot delete rows through a calculation view",
                  status: 400,
                },
              }
            )
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
              Array.from({ length: 10 }, () =>
                config.api.row.save(table._id!, {})
              )
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
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "two",
                        value: "bar2",
                      },
                    ],
                  },
                ],
              },
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
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "two",
                        value: "bar2",
                      },
                    ],
                  },
                ],
              },
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
              Array.from({ length: 10 }, () =>
                config.api.row.save(table._id!, {})
              )
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
              Array.from({ length: 10 }, () =>
                config.api.row.save(table._id!, {})
              )
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
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.NOT_EQUAL,
                        field: "one",
                        value: "foo2",
                      },
                    ],
                  },
                ],
              },
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
              expect.arrayContaining([
                expect.objectContaining({ _id: three._id }),
              ])
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
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.NOT_EQUAL,
                        field: "one",
                        value: "foo2",
                      },
                    ],
                  },
                ],
              },
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
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "two",
                        value: "bar2",
                      },
                    ],
                  },
                ],
              },
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
                    "Quantity Sum": rows.reduce(
                      (acc, r) => acc + r.quantity,
                      0
                    ),
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
                expect(row["Total Price"]).toEqual(
                  priceByQuantity[row.quantity]
                )
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

            it("should be able to filter on relationships", async () => {
              const companies = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    name: {
                      name: "name",
                      type: FieldType.STRING,
                    },
                  },
                })
              )

              const employees = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    age: {
                      type: FieldType.NUMBER,
                      name: "age",
                    },
                    name: {
                      type: FieldType.STRING,
                      name: "name",
                    },
                    company: {
                      type: FieldType.LINK,
                      name: "company",
                      tableId: companies._id!,
                      relationshipType: RelationshipType.ONE_TO_MANY,
                      fieldName: "company",
                    },
                  },
                })
              )

              const view = await config.api.viewV2.create({
                tableId: employees._id!,
                name: generator.guid(),
                type: ViewV2Type.CALCULATION,
                queryUI: {
                  groups: [
                    {
                      filters: [
                        {
                          operator: BasicOperator.EQUAL,
                          field: "company.name",
                          value: "Aperture Science Laboratories",
                        },
                      ],
                    },
                  ],
                },
                schema: {
                  sum: {
                    visible: true,
                    calculationType: CalculationType.SUM,
                    field: "age",
                  },
                },
              })

              const apertureScience = await config.api.row.save(
                companies._id!,
                {
                  name: "Aperture Science Laboratories",
                }
              )

              const blackMesa = await config.api.row.save(companies._id!, {
                name: "Black Mesa",
              })

              await Promise.all([
                config.api.row.save(employees._id!, {
                  name: "Alice",
                  age: 25,
                  company: apertureScience._id,
                }),
                config.api.row.save(employees._id!, {
                  name: "Bob",
                  age: 30,
                  company: apertureScience._id,
                }),
                config.api.row.save(employees._id!, {
                  name: "Charly",
                  age: 27,
                  company: blackMesa._id,
                }),
                config.api.row.save(employees._id!, {
                  name: "Danny",
                  age: 15,
                  company: blackMesa._id,
                }),
              ])

              const { rows } = await config.api.viewV2.search(view.id, {
                query: {},
              })

              expect(rows).toHaveLength(1)
              expect(rows[0].sum).toEqual(55)
            })

            it("should be able to count non-numeric fields", async () => {
              const table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    firstName: {
                      type: FieldType.STRING,
                      name: "firstName",
                    },
                    lastName: {
                      type: FieldType.STRING,
                      name: "lastName",
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
                    field: "firstName",
                  },
                },
              })

              await config.api.row.bulkImport(table._id!, {
                rows: [
                  { firstName: "Jane", lastName: "Smith" },
                  { firstName: "Jane", lastName: "Doe" },
                  { firstName: "Alice", lastName: "Smith" },
                ],
              })

              const { rows } = await config.api.viewV2.search(view.id, {
                query: {},
              })

              expect(rows).toHaveLength(1)
              expect(rows[0].count).toEqual(3)
            })

            it("should be able to filter rows on the view itself", async () => {
              const table = await config.api.table.save(
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

              const view = await config.api.viewV2.create({
                tableId: table._id!,
                name: generator.guid(),
                type: ViewV2Type.CALCULATION,
                queryUI: {
                  groups: [
                    {
                      filters: [
                        {
                          operator: BasicOperator.EQUAL,
                          field: "quantity",
                          value: 1,
                        },
                      ],
                    },
                  ],
                },
                schema: {
                  sum: {
                    visible: true,
                    calculationType: CalculationType.SUM,
                    field: "price",
                  },
                },
              })

              await config.api.row.bulkImport(table._id!, {
                rows: [
                  {
                    quantity: 1,
                    price: 1,
                  },
                  {
                    quantity: 1,
                    price: 2,
                  },
                  {
                    quantity: 2,
                    price: 10,
                  },
                ],
              })

              const { rows } = await config.api.viewV2.search(view.id, {
                query: {},
              })
              expect(rows).toHaveLength(1)
              expect(rows[0].sum).toEqual(3)
            })

            it("should be able to filter on group by fields", async () => {
              const table = await config.api.table.save(
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

              const view = await config.api.viewV2.create({
                tableId: table._id!,
                name: generator.guid(),
                type: ViewV2Type.CALCULATION,
                schema: {
                  quantity: { visible: true },
                  sum: {
                    visible: true,
                    calculationType: CalculationType.SUM,
                    field: "price",
                  },
                },
              })

              await config.api.row.bulkImport(table._id!, {
                rows: [
                  {
                    quantity: 1,
                    price: 1,
                  },
                  {
                    quantity: 1,
                    price: 2,
                  },
                  {
                    quantity: 2,
                    price: 10,
                  },
                ],
              })

              const { rows } = await config.api.viewV2.search(view.id, {
                query: {
                  equal: {
                    quantity: 1,
                  },
                },
              })

              expect(rows).toHaveLength(1)
              expect(rows[0].sum).toEqual(3)
            })

            it("should be able to sort by group by field", async () => {
              const table = await config.api.table.save(
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

              const view = await config.api.viewV2.create({
                tableId: table._id!,
                name: generator.guid(),
                type: ViewV2Type.CALCULATION,
                schema: {
                  quantity: { visible: true },
                  sum: {
                    visible: true,
                    calculationType: CalculationType.SUM,
                    field: "price",
                  },
                },
              })

              await config.api.row.bulkImport(table._id!, {
                rows: [
                  {
                    quantity: 1,
                    price: 1,
                  },
                  {
                    quantity: 1,
                    price: 2,
                  },
                  {
                    quantity: 2,
                    price: 10,
                  },
                ],
              })

              const { rows } = await config.api.viewV2.search(view.id, {
                query: {},
                sort: "quantity",
                sortOrder: SortOrder.DESCENDING,
              })

              expect(rows).toEqual([
                expect.objectContaining({ quantity: 2, sum: 10 }),
                expect.objectContaining({ quantity: 1, sum: 3 }),
              ])
            })

            it("should be able to sort by a calculation", async () => {
              const table = await config.api.table.save(
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

              await config.api.row.bulkImport(table._id!, {
                rows: [
                  {
                    quantity: 1,
                    price: 1,
                  },
                  {
                    quantity: 1,
                    price: 2,
                  },
                  {
                    quantity: 2,
                    price: 10,
                  },
                ],
              })

              const view = await config.api.viewV2.create({
                tableId: table._id!,
                name: generator.guid(),
                type: ViewV2Type.CALCULATION,
                schema: {
                  quantity: { visible: true },
                  sum: {
                    visible: true,
                    calculationType: CalculationType.SUM,
                    field: "price",
                  },
                },
              })

              const { rows } = await config.api.viewV2.search(view.id, {
                query: {},
                sort: "sum",
                sortOrder: SortOrder.DESCENDING,
              })

              expect(rows).toEqual([
                expect.objectContaining({ quantity: 2, sum: 10 }),
                expect.objectContaining({ quantity: 1, sum: 3 }),
              ])
            })
          })

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

          it("should be able to filter on a single user field in both the view query and search query", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  user: {
                    name: "user",
                    type: FieldType.BB_REFERENCE_SINGLE,
                    subtype: BBReferenceFieldSubType.USER,
                  },
                },
              })
            )

            await config.api.row.save(table._id!, {
              user: config.getUser()._id,
            })

            const view = await config.api.viewV2.create({
              tableId: table._id!,
              name: generator.guid(),
              queryUI: {
                groups: [
                  {
                    filters: [
                      {
                        operator: BasicOperator.EQUAL,
                        field: "user",
                        value: "{{ [user].[_id] }}",
                      },
                    ],
                  },
                ],
              },
              schema: {
                user: {
                  visible: true,
                },
              },
            })

            const { rows } = await config.api.viewV2.search(view.id, {
              query: {
                equal: {
                  user: "{{ [user].[_id] }}",
                },
              },
            })

            expect(rows).toHaveLength(1)
            expect(rows[0].user._id).toEqual(config.getUser()._id)
          })

          describe("search operators", () => {
            let table: Table
            beforeEach(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    string: { name: "string", type: FieldType.STRING },
                    longform: { name: "longform", type: FieldType.LONGFORM },
                    options: {
                      name: "options",
                      type: FieldType.OPTIONS,
                      constraints: { inclusion: ["a", "b", "c"] },
                    },
                    array: {
                      name: "array",
                      type: FieldType.ARRAY,
                      constraints: {
                        type: JsonFieldSubType.ARRAY,
                        inclusion: ["a", "b", "c"],
                      },
                    },
                    number: { name: "number", type: FieldType.NUMBER },
                    bigint: { name: "bigint", type: FieldType.BIGINT },
                    datetime: { name: "datetime", type: FieldType.DATETIME },
                    boolean: { name: "boolean", type: FieldType.BOOLEAN },
                    user: {
                      name: "user",
                      type: FieldType.BB_REFERENCE_SINGLE,
                      subtype: BBReferenceFieldSubType.USER,
                    },
                    users: {
                      name: "users",
                      type: FieldType.BB_REFERENCE,
                      subtype: BBReferenceFieldSubType.USER,
                      constraints: {
                        type: JsonFieldSubType.ARRAY,
                      },
                    },
                  },
                })
              )
            })

            interface TestCase {
              name: string
              query: UISearchFilter | (() => UISearchFilter)
              insert: Row[] | (() => Row[])
              expected: Row[] | (() => Row[])
              searchOpts?: Partial<SearchViewRowRequest>
            }

            function simpleQuery(...filters: LegacyFilter[]): UISearchFilter {
              return { groups: [{ filters }] }
            }

            const testCases: TestCase[] = [
              {
                name: "empty query return all",
                insert: [{ string: "foo" }],
                query: {
                  onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                },
                expected: [{ string: "foo" }],
              },
              {
                name: "empty query return none",
                insert: [{ string: "foo" }],
                query: {
                  onEmptyFilter: EmptyFilterOption.RETURN_NONE,
                },
                expected: [],
              },
              {
                name: "simple string search",
                insert: [{ string: "foo" }],
                query: simpleQuery({
                  operator: BasicOperator.EQUAL,
                  field: "string",
                  value: "foo",
                }),
                expected: [{ string: "foo" }],
              },
              {
                name: "non matching string search",
                insert: [{ string: "foo" }],
                query: simpleQuery({
                  operator: BasicOperator.EQUAL,
                  field: "string",
                  value: "bar",
                }),
                expected: [],
              },
              {
                name: "allOr",
                insert: [{ string: "bar" }, { string: "foo" }],
                query: simpleQuery(
                  {
                    operator: BasicOperator.EQUAL,
                    field: "string",
                    value: "foo",
                  },
                  {
                    operator: BasicOperator.EQUAL,
                    field: "string",
                    value: "bar",
                  },
                  {
                    operator: "allOr",
                  }
                ),
                searchOpts: {
                  sort: "string",
                  sortOrder: SortOrder.ASCENDING,
                },
                expected: [{ string: "bar" }, { string: "foo" }],
              },
              {
                name: "can find rows with fuzzy search",
                insert: [{ string: "foo" }, { string: "bar" }],
                query: simpleQuery({
                  operator: BasicOperator.FUZZY,
                  field: "string",
                  value: "fo",
                }),
                expected: [{ string: "foo" }],
              },
              {
                name: "can find nothing with fuzzy search",
                insert: [{ string: "foo" }, { string: "bar" }],
                query: simpleQuery({
                  operator: BasicOperator.FUZZY,
                  field: "string",
                  value: "baz",
                }),
                expected: [],
              },
              {
                name: "can find numeric rows",
                insert: [{ number: 1 }, { number: 2 }],
                query: simpleQuery({
                  operator: BasicOperator.EQUAL,
                  field: "number",
                  value: 1,
                }),
                expected: [{ number: 1 }],
              },
              {
                name: "can find numeric values with rangeHigh",
                insert: [{ number: 1 }, { number: 2 }, { number: 3 }],
                query: simpleQuery({
                  operator: "rangeHigh",
                  field: "number",
                  value: 2,
                }),
                searchOpts: {
                  sort: "number",
                  sortOrder: SortOrder.ASCENDING,
                },
                expected: [{ number: 1 }, { number: 2 }],
              },
              {
                name: "can find numeric values with rangeLow",
                insert: [{ number: 1 }, { number: 2 }, { number: 3 }],
                query: simpleQuery({
                  operator: "rangeLow",
                  field: "number",
                  value: 2,
                }),
                searchOpts: {
                  sort: "number",
                  sortOrder: SortOrder.ASCENDING,
                },
                expected: [{ number: 2 }, { number: 3 }],
              },
              {
                name: "can find numeric values with full range",
                insert: [{ number: 1 }, { number: 2 }, { number: 3 }],
                query: simpleQuery(
                  {
                    operator: "rangeHigh",
                    field: "number",
                    value: 2,
                  },
                  {
                    operator: "rangeLow",
                    field: "number",
                    value: 2,
                  }
                ),
                expected: [{ number: 2 }],
              },
              {
                name: "can find longform values",
                insert: [{ longform: "foo" }, { longform: "bar" }],
                query: simpleQuery({
                  operator: BasicOperator.EQUAL,
                  field: "longform",
                  value: "foo",
                }),
                expected: [{ longform: "foo" }],
              },
              {
                name: "can find options values",
                insert: [{ options: "a" }, { options: "b" }],
                query: simpleQuery({
                  operator: BasicOperator.EQUAL,
                  field: "options",
                  value: "a",
                }),
                expected: [{ options: "a" }],
              },
              {
                name: "can find array values",
                insert: [
                  // Number field here is just to guarantee order.
                  { number: 1, array: ["a"] },
                  { number: 2, array: ["b"] },
                  { number: 3, array: ["a", "c"] },
                ],
                query: simpleQuery({
                  operator: ArrayOperator.CONTAINS,
                  field: "array",
                  value: "a",
                }),
                searchOpts: {
                  sort: "number",
                  sortOrder: SortOrder.ASCENDING,
                },
                expected: [{ array: ["a"] }, { array: ["a", "c"] }],
              },
              {
                name: "can find bigint values",
                insert: [{ bigint: "1" }, { bigint: "2" }],
                query: simpleQuery({
                  operator: BasicOperator.EQUAL,
                  field: "bigint",
                  type: FieldType.BIGINT,
                  value: "1",
                }),
                expected: [{ bigint: "1" }],
              },
              {
                name: "can find datetime values",
                insert: [
                  { datetime: "2021-01-01T00:00:00.000Z" },
                  { datetime: "2021-01-02T00:00:00.000Z" },
                ],
                query: simpleQuery({
                  operator: BasicOperator.EQUAL,
                  field: "datetime",
                  type: FieldType.DATETIME,
                  value: "2021-01-01",
                }),
                expected: [{ datetime: "2021-01-01T00:00:00.000Z" }],
              },
              {
                name: "can find boolean values",
                insert: [{ boolean: true }, { boolean: false }],
                query: simpleQuery({
                  operator: BasicOperator.EQUAL,
                  field: "boolean",
                  value: true,
                }),
                expected: [{ boolean: true }],
              },
              {
                name: "can find user values",
                insert: () => [{ user: config.getUser() }],
                query: () =>
                  simpleQuery({
                    operator: BasicOperator.EQUAL,
                    field: "user",
                    value: config.getUser()._id,
                  }),
                expected: () => [
                  {
                    user: expect.objectContaining({
                      _id: config.getUser()._id,
                    }),
                  },
                ],
              },
              {
                name: "can find users values",
                insert: () => [{ users: [config.getUser()] }],
                query: () =>
                  simpleQuery({
                    operator: ArrayOperator.CONTAINS,
                    field: "users",
                    value: [config.getUser()._id],
                  }),
                expected: () => [
                  {
                    users: [
                      expect.objectContaining({ _id: config.getUser()._id }),
                    ],
                  },
                ],
              },
              {
                name: "can handle logical operator any",
                insert: [{ string: "bar" }, { string: "foo" }],
                query: {
                  groups: [
                    {
                      logicalOperator: UILogicalOperator.ANY,
                      filters: [
                        {
                          operator: BasicOperator.EQUAL,
                          field: "string",
                          value: "foo",
                        },
                        {
                          operator: BasicOperator.EQUAL,
                          field: "string",
                          value: "bar",
                        },
                      ],
                    },
                  ],
                },
                searchOpts: {
                  sort: "string",
                  sortOrder: SortOrder.ASCENDING,
                },
                expected: [{ string: "bar" }, { string: "foo" }],
              },
              {
                name: "can handle logical operator all",
                insert: [
                  { string: "bar", number: 1 },
                  { string: "foo", number: 2 },
                ],
                query: {
                  groups: [
                    {
                      logicalOperator: UILogicalOperator.ALL,
                      filters: [
                        {
                          operator: BasicOperator.EQUAL,
                          field: "string",
                          value: "foo",
                        },
                        {
                          operator: BasicOperator.EQUAL,
                          field: "number",
                          value: 2,
                        },
                      ],
                    },
                  ],
                },
                searchOpts: {
                  sort: "string",
                  sortOrder: SortOrder.ASCENDING,
                },
                expected: [{ string: "foo", number: 2 }],
              },
              {
                name: "overrides allOr with logical operators",
                insert: [
                  { string: "bar", number: 1 },
                  { string: "foo", number: 1 },
                ],
                query: {
                  groups: [
                    {
                      logicalOperator: UILogicalOperator.ALL,
                      filters: [
                        { operator: "allOr" },
                        {
                          operator: BasicOperator.EQUAL,
                          field: "string",
                          value: "foo",
                        },
                        {
                          operator: BasicOperator.EQUAL,
                          field: "number",
                          value: 1,
                        },
                      ],
                    },
                  ],
                },
                searchOpts: {
                  sort: "string",
                  sortOrder: SortOrder.ASCENDING,
                },
                expected: [{ string: "foo", number: 1 }],
              },
            ]

            it.each(testCases)(
              "$name",
              async ({ query, insert, expected, searchOpts }) => {
                // Some values can't be specified outside of a test (e.g. getting
                // config.getUser(), it won't be initialised), so we use functions
                // in those cases.
                if (typeof insert === "function") {
                  insert = insert()
                }
                if (typeof expected === "function") {
                  expected = expected()
                }
                if (typeof query === "function") {
                  query = query()
                }

                await config.api.row.bulkImport(table._id!, { rows: insert })

                const view = await config.api.viewV2.create({
                  tableId: table._id!,
                  name: generator.guid(),
                  queryUI: query,
                  schema: {
                    string: { visible: true },
                    longform: { visible: true },
                    options: { visible: true },
                    array: { visible: true },
                    number: { visible: true },
                    bigint: { visible: true },
                    datetime: { visible: true },
                    boolean: { visible: true },
                    user: { visible: true },
                    users: { visible: true },
                  },
                })

                const { rows } = await config.api.viewV2.search(view.id, {
                  query: {},
                  ...searchOpts,
                })
                expect(rows).toEqual(
                  expected.map(r => expect.objectContaining(r))
                )
              }
            )
          })
        })

        describe("permissions", () => {
          beforeEach(async () => {
            await Promise.all(
              Array.from({ length: 10 }, () =>
                config.api.row.save(table._id!, {})
              )
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
    }
  )
}
