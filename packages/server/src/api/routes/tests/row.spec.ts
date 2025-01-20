import * as setup from "./utilities"

import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"

import tk from "timekeeper"
import emitter from "../../../../src/events"
import { outputProcessing } from "../../../utilities/rowProcessor"
import {
  context,
  setEnv,
  InternalTable,
  tenancy,
  utils,
} from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  AIOperationEnum,
  AutoFieldSubType,
  Datasource,
  DeleteRow,
  FieldSchema,
  FieldType,
  BBReferenceFieldSubType,
  FormulaType,
  INTERNAL_TABLE_SOURCE_ID,
  QuotaUsageType,
  RelationshipType,
  Row,
  SaveTableRequest,
  StaticQuotaName,
  Table,
  TableSourceType,
  UpdatedRowEventEmitter,
  TableSchema,
  JsonFieldSubType,
  RowExportFormat,
  RelationSchemaField,
  FormulaResponseType,
} from "@budibase/types"
import { generator, mocks } from "@budibase/backend-core/tests"
import _, { merge } from "lodash"
import * as uuid from "uuid"
import { Knex } from "knex"
import { InternalTables } from "../../../db/utils"
import { withEnv } from "../../../environment"
import { JsTimeoutError } from "@budibase/string-templates"
import { isDate } from "../../../utilities"
import nock from "nock"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/openai"

const timestamp = new Date("2023-01-26T11:48:57.597Z").toISOString()
tk.freeze(timestamp)
interface WaitOptions {
  name: string
  matchFn?: (event: any) => boolean
}
async function waitForEvent(
  opts: WaitOptions,
  callback: () => Promise<void>
): Promise<any> {
  const p = new Promise((resolve: any) => {
    const listener = (event: any) => {
      if (opts.matchFn && !opts.matchFn(event)) {
        return
      }
      resolve(event)
      emitter.off(opts.name, listener)
    }
    emitter.on(opts.name, listener)
  })

  await callback()
  return await p
}

function encodeJS(binding: string) {
  return `{{ js "${Buffer.from(binding).toString("base64")}"}}`
}

const descriptions = datasourceDescribe({ exclude: [DatabaseName.MONGODB] })

if (descriptions.length) {
  describe.each(descriptions)(
    "/rows ($dbName)",
    ({ config, dsProvider, isInternal, isMSSQL, isOracle }) => {
      let table: Table
      let datasource: Datasource | undefined
      let client: Knex | undefined

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource
        client = ds.client

        mocks.licenses.useCloudFree()
      })

      afterAll(async () => {
        setup.afterAll()
      })

      function saveTableRequest(
        // We omit the name field here because it's generated in the function with a
        // high likelihood to be unique. Tests should not have any reason to control
        // the table name they're writing to.
        ...overrides: Partial<Omit<SaveTableRequest, "name">>[]
      ): SaveTableRequest {
        const defaultSchema: TableSchema = {
          id: {
            type: FieldType.NUMBER,
            name: "id",
            autocolumn: true,
            constraints: {
              presence: true,
            },
          },
        }

        for (const override of overrides) {
          if (override.primary) {
            delete defaultSchema.id
          }
        }

        const req: SaveTableRequest = {
          name: uuid.v4().substring(0, 10),
          type: "table",
          sourceType: datasource
            ? TableSourceType.EXTERNAL
            : TableSourceType.INTERNAL,
          sourceId: datasource ? datasource._id! : INTERNAL_TABLE_SOURCE_ID,
          primary: ["id"],
          schema: defaultSchema,
        }
        const merged = merge(req, ...overrides)
        return merged
      }

      function defaultTable(
        // We omit the name field here because it's generated in the function with a
        // high likelihood to be unique. Tests should not have any reason to control
        // the table name they're writing to.
        ...overrides: Partial<Omit<SaveTableRequest, "name">>[]
      ): SaveTableRequest {
        return saveTableRequest(
          {
            primaryDisplay: "name",
            schema: {
              name: {
                type: FieldType.STRING,
                name: "name",
                constraints: {
                  type: "string",
                },
              },
              description: {
                type: FieldType.STRING,
                name: "description",
                constraints: {
                  type: "string",
                },
              },
            },
          },
          ...overrides
        )
      }

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

        // Because our quota tracking is not perfect, we allow a 10% margin of
        // error.  This is to account for the fact that parallel writes can result
        // in some quota updates getting lost. We don't have any need to solve this
        // right now, so we just allow for some error.
        if (expected === 0) {
          expect(usage).toEqual(0)
          return
        }
        expect(usage).toBeGreaterThan(expected * 0.9)
        expect(usage).toBeLessThan(expected * 1.1)
      }

      const defaultRowFields = isInternal
        ? {
            type: "row",
            createdAt: timestamp,
            updatedAt: timestamp,
          }
        : undefined

      beforeAll(async () => {
        table = await config.api.table.save(defaultTable())
      })

      describe("create", () => {
        it("creates a new row successfully", async () => {
          const rowUsage = await getRowUsage()
          const row = await config.api.row.save(table._id!, {
            name: "Test Contact",
          })
          expect(row.name).toEqual("Test Contact")
          expect(row._rev).toBeDefined()
          await assertRowUsage(isInternal ? rowUsage + 1 : rowUsage)
        })

        it("fails to create a row for a table that does not exist", async () => {
          const rowUsage = await getRowUsage()
          await config.api.row.save("1234567", {}, { status: 404 })
          await assertRowUsage(rowUsage)
        })

        it("fails to create a row if required fields are missing", async () => {
          const rowUsage = await getRowUsage()
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                required: {
                  type: FieldType.STRING,
                  name: "required",
                  constraints: {
                    type: "string",
                    presence: true,
                  },
                },
              },
            })
          )
          await config.api.row.save(
            table._id!,
            {},
            {
              status: 500,
              body: {
                validationErrors: {
                  required: ["can't be blank"],
                },
              },
            }
          )
          await assertRowUsage(rowUsage)
        })

        isInternal &&
          it("increment row autoId per create row request", async () => {
            const rowUsage = await getRowUsage()

            const newTable = await config.api.table.save(
              saveTableRequest({
                schema: {
                  "Row ID": {
                    name: "Row ID",
                    type: FieldType.NUMBER,
                    subtype: AutoFieldSubType.AUTO_ID,
                    icon: "ri-magic-line",
                    autocolumn: true,
                    constraints: {
                      type: "number",
                      presence: true,
                      numericality: {
                        greaterThanOrEqualTo: "",
                        lessThanOrEqualTo: "",
                      },
                    },
                  },
                },
              })
            )

            let previousId = 0
            for (let i = 0; i < 10; i++) {
              const row = await config.api.row.save(newTable._id!, {})
              expect(row["Row ID"]).toBeGreaterThan(previousId)
              previousId = row["Row ID"]
            }
            await assertRowUsage(isInternal ? rowUsage + 10 : rowUsage)
          })

        isInternal &&
          it("should increment auto ID correctly when creating rows in parallel", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  "Row ID": {
                    name: "Row ID",
                    type: FieldType.NUMBER,
                    subtype: AutoFieldSubType.AUTO_ID,
                    icon: "ri-magic-line",
                    autocolumn: true,
                    constraints: {
                      type: "number",
                      presence: true,
                      numericality: {
                        greaterThanOrEqualTo: "",
                        lessThanOrEqualTo: "",
                      },
                    },
                  },
                },
              })
            )

            const sequence = Array(50)
              .fill(0)
              .map((_, i) => i + 1)

            // This block of code is simulating users creating auto ID rows at the
            // same time. It's expected that this operation will sometimes return
            // a document conflict error (409), but the idea is to retry in those
            // situations. The code below does this a large number of times with
            // small, random delays between them to try and get through the list
            // as quickly as possible.
            await Promise.all(
              sequence.map(async () => {
                const attempts = 30
                for (let attempt = 0; attempt < attempts; attempt++) {
                  try {
                    await config.api.row.save(table._id!, {})
                    return
                  } catch (e) {
                    await new Promise(r => setTimeout(r, Math.random() * 50))
                  }
                }
                throw new Error(
                  `Failed to create row after ${attempts} attempts`
                )
              })
            )

            const rows = await config.api.row.fetch(table._id!)
            expect(rows).toHaveLength(50)

            // The main purpose of this test is to ensure that even under pressure,
            // we maintain data integrity. An auto ID column should hand out
            // monotonically increasing unique integers no matter what.
            const ids = rows.map(r => r["Row ID"])
            expect(ids).toEqual(expect.arrayContaining(sequence))
          })

        isInternal &&
          it("doesn't allow creating in user table", async () => {
            const response = await config.api.row.save(
              InternalTable.USER_METADATA,
              {
                firstName: "Joe",
                lastName: "Joe",
                email: "joe@joe.com",
                roles: {},
              },
              { status: 400 }
            )
            expect(response.message).toBe("Cannot create new user entry.")
          })

        it("should not mis-parse date string out of JSON", async () => {
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                name: {
                  type: FieldType.STRING,
                  name: "name",
                },
              },
            })
          )

          const row = await config.api.row.save(table._id!, {
            name: `{ "foo": "2023-01-26T11:48:57.000Z" }`,
          })

          expect(row.name).toEqual(`{ "foo": "2023-01-26T11:48:57.000Z" }`)
        })

        describe("default values", () => {
          let table: Table

          describe("string column", () => {
            beforeAll(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    description: {
                      name: "description",
                      type: FieldType.STRING,
                      default: "default description",
                    },
                  },
                })
              )
            })

            it("creates a new row with a default value successfully", async () => {
              const row = await config.api.row.save(table._id!, {})
              expect(row.description).toEqual("default description")
            })

            it("does not use default value if value specified", async () => {
              const row = await config.api.row.save(table._id!, {
                description: "specified description",
              })
              expect(row.description).toEqual("specified description")
            })

            it("uses the default value if value is null", async () => {
              const row = await config.api.row.save(table._id!, {
                description: null,
              })
              expect(row.description).toEqual("default description")
            })

            it("uses the default value if value is undefined", async () => {
              const row = await config.api.row.save(table._id!, {
                description: undefined,
              })
              expect(row.description).toEqual("default description")
            })
          })

          describe("number column", () => {
            beforeAll(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    age: {
                      name: "age",
                      type: FieldType.NUMBER,
                      default: "25",
                    },
                  },
                })
              )
            })

            it("creates a new row with a default value successfully", async () => {
              const row = await config.api.row.save(table._id!, {})
              expect(row.age).toEqual(25)
            })

            it("does not use default value if value specified", async () => {
              const row = await config.api.row.save(table._id!, {
                age: 30,
              })
              expect(row.age).toEqual(30)
            })
          })

          describe("date column", () => {
            it("creates a row with a default value successfully", async () => {
              const table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    date: {
                      name: "date",
                      type: FieldType.DATETIME,
                      default: "2023-01-26T11:48:57.000Z",
                    },
                  },
                })
              )
              const row = await config.api.row.save(table._id!, {})
              expect(row.date).toEqual("2023-01-26T11:48:57.000Z")
            })

            it("gives an error if the default value is invalid", async () => {
              const table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    date: {
                      name: "date",
                      type: FieldType.DATETIME,
                      default: "invalid",
                    },
                  },
                })
              )
              await config.api.row.save(
                table._id!,
                {},
                {
                  status: 400,
                  body: {
                    message: `Invalid default value for field 'date' - Invalid date value: "invalid"`,
                  },
                }
              )
            })
          })

          describe("options column", () => {
            beforeAll(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    status: {
                      name: "status",
                      type: FieldType.OPTIONS,
                      default: "requested",
                      constraints: {
                        inclusion: ["requested", "approved"],
                      },
                    },
                  },
                })
              )
            })

            it("creates a new row with a default value successfully", async () => {
              const row = await config.api.row.save(table._id!, {})
              expect(row.status).toEqual("requested")
            })

            it("does not use default value if value specified", async () => {
              const row = await config.api.row.save(table._id!, {
                status: "approved",
              })
              expect(row.status).toEqual("approved")
            })
          })

          describe("array column", () => {
            beforeAll(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    food: {
                      name: "food",
                      type: FieldType.ARRAY,
                      default: ["apple", "orange"],
                      constraints: {
                        type: JsonFieldSubType.ARRAY,
                        inclusion: ["apple", "orange", "banana"],
                      },
                    },
                  },
                })
              )
            })

            it("creates a new row with a default value successfully", async () => {
              const row = await config.api.row.save(table._id!, {})
              expect(row.food).toEqual(["apple", "orange"])
            })

            it("creates a new row with a default value when given an empty list", async () => {
              const row = await config.api.row.save(table._id!, { food: [] })
              expect(row.food).toEqual(["apple", "orange"])
            })

            it("does not use default value if value specified", async () => {
              const row = await config.api.row.save(table._id!, {
                food: ["orange"],
              })
              expect(row.food).toEqual(["orange"])
            })

            it("resets back to its default value when empty", async () => {
              let row = await config.api.row.save(table._id!, {
                food: ["orange"],
              })
              row = await config.api.row.save(table._id!, { ...row, food: [] })
              expect(row.food).toEqual(["apple", "orange"])
            })
          })

          describe("user column", () => {
            beforeAll(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    user: {
                      name: "user",
                      type: FieldType.BB_REFERENCE_SINGLE,
                      subtype: BBReferenceFieldSubType.USER,
                      default: "{{ [Current User]._id }}",
                    },
                  },
                })
              )
            })

            it("creates a new row with a default value successfully", async () => {
              const row = await config.api.row.save(table._id!, {})
              expect(row.user._id).toEqual(config.getUser()._id)
            })

            it("does not use default value if value specified", async () => {
              const id = `us_${utils.newid()}`
              await config.createUser({ _id: id })
              const row = await config.api.row.save(table._id!, {
                user: id,
              })
              expect(row.user._id).toEqual(id)
            })
          })

          describe("multi-user column", () => {
            beforeAll(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    users: {
                      name: "users",
                      type: FieldType.BB_REFERENCE,
                      subtype: BBReferenceFieldSubType.USER,
                      default: ["{{ [Current User]._id }}"],
                    },
                  },
                })
              )
            })

            it("creates a new row with a default value successfully", async () => {
              const row = await config.api.row.save(table._id!, {})
              expect(row.users).toHaveLength(1)
              expect(row.users[0]._id).toEqual(config.getUser()._id)
            })

            it("does not use default value if value specified", async () => {
              const id = `us_${utils.newid()}`
              await config.createUser({ _id: id })
              const row = await config.api.row.save(table._id!, {
                users: [id],
              })
              expect(row.users).toHaveLength(1)
              expect(row.users[0]._id).toEqual(id)
            })
          })

          describe("boolean column", () => {
            beforeAll(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    active: {
                      name: "active",
                      type: FieldType.BOOLEAN,
                      default: "true",
                    },
                  },
                })
              )
            })

            it("creates a new row with a default value successfully", async () => {
              const row = await config.api.row.save(table._id!, {})
              expect(row.active).toEqual(true)
            })

            it("does not use default value if value specified", async () => {
              const row = await config.api.row.save(table._id!, {
                active: false,
              })
              expect(row.active).toEqual(false)
            })
          })

          describe("bigint column", () => {
            beforeAll(async () => {
              table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    bigNumber: {
                      name: "bigNumber",
                      type: FieldType.BIGINT,
                      default: "1234567890",
                    },
                  },
                })
              )
            })

            it("creates a new row with a default value successfully", async () => {
              const row = await config.api.row.save(table._id!, {})
              expect(row.bigNumber).toEqual("1234567890")
            })

            it("does not use default value if value specified", async () => {
              const row = await config.api.row.save(table._id!, {
                bigNumber: "9876543210",
              })
              expect(row.bigNumber).toEqual("9876543210")
            })
          })

          describe("bindings", () => {
            describe("string column", () => {
              beforeAll(async () => {
                table = await config.api.table.save(
                  saveTableRequest({
                    schema: {
                      description: {
                        name: "description",
                        type: FieldType.STRING,
                        default: `{{ date now "YYYY-MM-DDTHH:mm:ss" }}`,
                      },
                    },
                  })
                )
              })

              it("can use bindings in default values", async () => {
                const row = await config.api.row.save(table._id!, {})
                expect(row.description).toMatch(
                  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
                )
              })

              it("does not use default value if value specified", async () => {
                const row = await config.api.row.save(table._id!, {
                  description: "specified description",
                })
                expect(row.description).toEqual("specified description")
              })

              it("can bind the current user", async () => {
                const table = await config.api.table.save(
                  saveTableRequest({
                    schema: {
                      user: {
                        name: "user",
                        type: FieldType.STRING,
                        default: `{{ [Current User]._id }}`,
                      },
                    },
                  })
                )
                const row = await config.api.row.save(table._id!, {})
                expect(row.user).toEqual(config.getUser()._id)
              })

              it("cannot access current user password", async () => {
                const table = await config.api.table.save(
                  saveTableRequest({
                    schema: {
                      user: {
                        name: "user",
                        type: FieldType.STRING,
                        default: `{{ user.password }}`,
                      },
                    },
                  })
                )
                const row = await config.api.row.save(table._id!, {})
                // For some reason it's null for internal tables, and undefined for
                // external.
                expect(row.user == null).toBe(true)
              })
            })

            describe("number column", () => {
              beforeAll(async () => {
                table = await config.api.table.save(
                  saveTableRequest({
                    schema: {
                      age: {
                        name: "age",
                        type: FieldType.NUMBER,
                        default: `{{ sum 10 10 5 }}`,
                      },
                    },
                  })
                )
              })

              it("can use bindings in default values", async () => {
                const row = await config.api.row.save(table._id!, {})
                expect(row.age).toEqual(25)
              })

              describe("invalid default value", () => {
                beforeAll(async () => {
                  table = await config.api.table.save(
                    saveTableRequest({
                      schema: {
                        age: {
                          name: "age",
                          type: FieldType.NUMBER,
                          default: `{{ capitalize "invalid" }}`,
                        },
                      },
                    })
                  )
                })

                it("throws an error when invalid default value", async () => {
                  await config.api.row.save(
                    table._id!,
                    {},
                    {
                      status: 400,
                      body: {
                        message:
                          "Invalid default value for field 'age' - Invalid number value \"Invalid\"",
                      },
                    }
                  )
                })
              })
            })
          })
        })

        describe("relations to same table", () => {
          let relatedRows: Row[]

          beforeAll(async () => {
            const relatedTable = await config.api.table.save(
              defaultTable({
                schema: {
                  name: { name: "name", type: FieldType.STRING },
                },
              })
            )
            const relatedTableId = relatedTable._id!
            table = await config.api.table.save(
              defaultTable({
                schema: {
                  name: { name: "name", type: FieldType.STRING },
                  related1: {
                    type: FieldType.LINK,
                    name: "related1",
                    fieldName: "main1",
                    tableId: relatedTableId,
                    relationshipType: RelationshipType.MANY_TO_MANY,
                  },
                  related2: {
                    type: FieldType.LINK,
                    name: "related2",
                    fieldName: "main2",
                    tableId: relatedTableId,
                    relationshipType: RelationshipType.MANY_TO_MANY,
                  },
                },
              })
            )
            relatedRows = await Promise.all([
              config.api.row.save(relatedTableId, { name: "foo" }),
              config.api.row.save(relatedTableId, { name: "bar" }),
              config.api.row.save(relatedTableId, { name: "baz" }),
              config.api.row.save(relatedTableId, { name: "boo" }),
            ])
          })

          it("can create rows with both relationships", async () => {
            const row = await config.api.row.save(table._id!, {
              name: "test",
              related1: [relatedRows[0]._id!],
              related2: [relatedRows[1]._id!],
            })

            expect(row).toEqual(
              expect.objectContaining({
                name: "test",
                related1: [
                  {
                    _id: relatedRows[0]._id,
                    primaryDisplay: relatedRows[0].name,
                  },
                ],
                related2: [
                  {
                    _id: relatedRows[1]._id,
                    primaryDisplay: relatedRows[1].name,
                  },
                ],
              })
            )
          })

          it("can create rows with no relationships", async () => {
            const row = await config.api.row.save(table._id!, {
              name: "test",
            })

            expect(row.related1).toBeUndefined()
            expect(row.related2).toBeUndefined()
          })

          it("can create rows with only one relationships field", async () => {
            const row = await config.api.row.save(table._id!, {
              name: "test",
              related1: [],
              related2: [relatedRows[1]._id!],
            })

            expect(row).toEqual(
              expect.objectContaining({
                name: "test",
                related2: [
                  {
                    _id: relatedRows[1]._id,
                    primaryDisplay: relatedRows[1].name,
                  },
                ],
              })
            )
            expect(row.related1).toBeUndefined()
          })
        })
      })

      describe("get", () => {
        it("reads an existing row successfully", async () => {
          const existing = await config.api.row.save(table._id!, {})

          const res = await config.api.row.get(table._id!, existing._id!)

          expect(res).toEqual({
            ...existing,
            ...defaultRowFields,
          })
        })

        it("returns 404 when row does not exist", async () => {
          const table = await config.api.table.save(defaultTable())
          await config.api.row.save(table._id!, {})
          await config.api.row.get(table._id!, "1234567", {
            status: 404,
          })
        })

        isInternal &&
          it("can search row from user table", async () => {
            const res = await config.api.row.get(
              InternalTables.USER_METADATA,
              config.userMetadataId!
            )

            expect(res).toEqual({
              ...config.getUser(),
              _id: config.userMetadataId!,
              _rev: expect.any(String),
              roles: undefined,
              roleId: "ADMIN",
              tableId: InternalTables.USER_METADATA,
            })
          })
      })

      describe("fetch", () => {
        it("fetches all rows for given tableId", async () => {
          const table = await config.api.table.save(defaultTable())
          const rows = await Promise.all([
            config.api.row.save(table._id!, {}),
            config.api.row.save(table._id!, {}),
          ])

          const res = await config.api.row.fetch(table._id!)
          expect(res.map(r => r._id)).toEqual(
            expect.arrayContaining(rows.map(r => r._id))
          )
        })

        it("returns 404 when table does not exist", async () => {
          await config.api.row.fetch("1234567", { status: 404 })
        })
      })

      describe("update", () => {
        it("updates an existing row successfully", async () => {
          const existing = await config.api.row.save(table._id!, {})
          const rowUsage = await getRowUsage()

          const res = await config.api.row.save(table._id!, {
            _id: existing._id,
            _rev: existing._rev,
            name: "Updated Name",
          })

          expect(res.name).toEqual("Updated Name")
          await assertRowUsage(rowUsage)
        })

        !isInternal &&
          it("can update a row on an external table with a primary key", async () => {
            const tableName = uuid.v4().substring(0, 10)
            await client!.schema.createTable(tableName, table => {
              table.increments("id").primary()
              table.string("name")
            })

            const res = await config.api.datasource.fetchSchema({
              datasourceId: datasource!._id!,
            })
            const table = res.datasource.entities![tableName]

            const row = await config.api.row.save(table._id!, {
              id: 1,
              name: "Row 1",
            })

            const updatedRow = await config.api.row.save(table._id!, {
              _id: row._id!,
              name: "Row 1 Updated",
            })

            expect(updatedRow.name).toEqual("Row 1 Updated")

            const rows = await config.api.row.fetch(table._id!)
            expect(rows).toHaveLength(1)
          })

        describe("relations to same table", () => {
          let relatedRows: Row[]

          beforeAll(async () => {
            const relatedTable = await config.api.table.save(
              defaultTable({
                schema: {
                  name: { name: "name", type: FieldType.STRING },
                },
              })
            )
            const relatedTableId = relatedTable._id!
            table = await config.api.table.save(
              defaultTable({
                schema: {
                  name: { name: "name", type: FieldType.STRING },
                  related1: {
                    type: FieldType.LINK,
                    name: "related1",
                    fieldName: "main1",
                    tableId: relatedTableId,
                    relationshipType: RelationshipType.MANY_TO_MANY,
                  },
                  related2: {
                    type: FieldType.LINK,
                    name: "related2",
                    fieldName: "main2",
                    tableId: relatedTableId,
                    relationshipType: RelationshipType.MANY_TO_MANY,
                  },
                },
              })
            )
            relatedRows = await Promise.all([
              config.api.row.save(relatedTableId, { name: "foo" }),
              config.api.row.save(relatedTableId, { name: "bar" }),
              config.api.row.save(relatedTableId, { name: "baz" }),
              config.api.row.save(relatedTableId, { name: "boo" }),
            ])
          })

          it("can edit rows with both relationships", async () => {
            let row = await config.api.row.save(table._id!, {
              name: "test",
              related1: [relatedRows[0]._id!],
              related2: [relatedRows[1]._id!],
            })

            row = await config.api.row.save(table._id!, {
              ...row,
              related1: [relatedRows[0]._id!, relatedRows[1]._id!],
              related2: [relatedRows[2]._id!],
            })

            expect(row).toEqual(
              expect.objectContaining({
                name: "test",
                related1: expect.arrayContaining([
                  {
                    _id: relatedRows[0]._id,
                    primaryDisplay: relatedRows[0].name,
                  },
                  {
                    _id: relatedRows[1]._id,
                    primaryDisplay: relatedRows[1].name,
                  },
                ]),
                related2: [
                  {
                    _id: relatedRows[2]._id,
                    primaryDisplay: relatedRows[2].name,
                  },
                ],
              })
            )
          })

          it("can drop existing relationship", async () => {
            let row = await config.api.row.save(table._id!, {
              name: "test",
              related1: [relatedRows[0]._id!],
              related2: [relatedRows[1]._id!],
            })

            row = await config.api.row.save(table._id!, {
              ...row,
              related1: [],
              related2: [relatedRows[2]._id!],
            })

            expect(row).toEqual(
              expect.objectContaining({
                name: "test",
                related2: [
                  {
                    _id: relatedRows[2]._id,
                    primaryDisplay: relatedRows[2].name,
                  },
                ],
              })
            )
            expect(row.related1).toBeUndefined()
          })

          it("can drop both relationships", async () => {
            let row = await config.api.row.save(table._id!, {
              name: "test",
              related1: [relatedRows[0]._id!],
              related2: [relatedRows[1]._id!],
            })

            row = await config.api.row.save(table._id!, {
              ...row,
              related1: [],
              related2: [],
            })

            expect(row).toEqual(
              expect.objectContaining({
                name: "test",
              })
            )
            expect(row.related1).toBeUndefined()
            expect(row.related2).toBeUndefined()
          })
        })
      })

      describe("patch", () => {
        let otherTable: Table

        beforeAll(async () => {
          table = await config.api.table.save(defaultTable())
          otherTable = await config.api.table.save(
            defaultTable({
              schema: {
                relationship: {
                  name: "relationship",
                  relationshipType: RelationshipType.ONE_TO_MANY,
                  type: FieldType.LINK,
                  tableId: table._id!,
                  fieldName: "relationship",
                },
              },
            })
          )
        })

        it("should update only the fields that are supplied", async () => {
          const existing = await config.api.row.save(table._id!, {})

          const rowUsage = await getRowUsage()

          const row = await config.api.row.patch(table._id!, {
            _id: existing._id!,
            _rev: existing._rev!,
            tableId: table._id!,
            name: "Updated Name",
          })

          expect(row.name).toEqual("Updated Name")
          expect(row.description).toEqual(existing.description)

          const savedRow = await config.api.row.get(table._id!, row._id!)

          expect(savedRow.description).toEqual(existing.description)
          expect(savedRow.name).toEqual("Updated Name")
          await assertRowUsage(rowUsage)
        })

        it("should update only the fields that are supplied and emit the correct oldRow", async () => {
          let beforeRow = await config.api.row.save(table._id!, {
            name: "test",
            description: "test",
          })
          const opts = {
            name: "row:update",
            matchFn: (event: UpdatedRowEventEmitter) =>
              event.row._id === beforeRow._id,
          }
          const event = await waitForEvent(opts, async () => {
            await config.api.row.patch(table._id!, {
              _id: beforeRow._id!,
              _rev: beforeRow._rev!,
              tableId: table._id!,
              name: "Updated Name",
            })
          })

          expect(event.oldRow).toBeDefined()
          expect(event.oldRow.name).toEqual("test")
          expect(event.row.name).toEqual("Updated Name")
          expect(event.oldRow.description).toEqual(beforeRow.description)
          expect(event.row.description).toEqual(beforeRow.description)
        })

        it("should throw an error when given improper types", async () => {
          const existing = await config.api.row.save(table._id!, {})
          const rowUsage = await getRowUsage()

          await config.api.row.patch(
            table._id!,
            {
              _id: existing._id!,
              _rev: existing._rev!,
              tableId: table._id!,
              name: 1,
            },
            { status: 400 }
          )

          await assertRowUsage(rowUsage)
        })

        it("should not overwrite links if those links are not set", async () => {
          let linkField: FieldSchema = {
            type: FieldType.LINK,
            name: "",
            fieldName: "",
            constraints: {
              type: "array",
              presence: false,
            },
            relationshipType: RelationshipType.ONE_TO_MANY,
            tableId: InternalTable.USER_METADATA,
          }

          let table = await config.api.table.save({
            name: "TestTable",
            type: "table",
            sourceType: TableSourceType.INTERNAL,
            sourceId: INTERNAL_TABLE_SOURCE_ID,
            schema: {
              user1: { ...linkField, name: "user1", fieldName: "user1" },
              user2: { ...linkField, name: "user2", fieldName: "user2" },
            },
          })

          let user1 = await config.createUser()
          let user2 = await config.createUser()

          let row = await config.api.row.save(table._id!, {
            user1: [{ _id: user1._id }],
            user2: [{ _id: user2._id }],
          })

          let getResp = await config.api.row.get(table._id!, row._id!)
          expect(getResp.user1[0]._id).toEqual(user1._id)
          expect(getResp.user2[0]._id).toEqual(user2._id)

          let patchResp = await config.api.row.patch(table._id!, {
            _id: row._id!,
            _rev: row._rev!,
            tableId: table._id!,
            user1: [{ _id: user2._id }],
          })
          expect(patchResp.user1[0]._id).toEqual(user2._id)
          expect(patchResp.user2[0]._id).toEqual(user2._id)

          getResp = await config.api.row.get(table._id!, row._id!)
          expect(getResp.user1[0]._id).toEqual(user2._id)
          expect(getResp.user2[0]._id).toEqual(user2._id)
        })

        it("should be able to remove a relationship from many side", async () => {
          const row = await config.api.row.save(otherTable._id!, {
            name: "test",
            description: "test",
          })
          const row2 = await config.api.row.save(otherTable._id!, {
            name: "test",
            description: "test",
          })
          const { _id } = await config.api.row.save(table._id!, {
            relationship: [{ _id: row._id }, { _id: row2._id }],
          })
          const relatedRow = await config.api.row.get(table._id!, _id!, {
            status: 200,
          })
          expect(relatedRow.relationship.length).toEqual(2)
          await config.api.row.save(table._id!, {
            ...relatedRow,
            relationship: [{ _id: row._id }],
          })
          const afterRelatedRow = await config.api.row.get(table._id!, _id!, {
            status: 200,
          })
          expect(afterRelatedRow.relationship.length).toEqual(1)
          expect(afterRelatedRow.relationship[0]._id).toEqual(row._id)
        })

        it("should be able to update relationships when both columns are same name", async () => {
          let row = await config.api.row.save(table._id!, {
            name: "test",
            description: "test",
          })
          let row2 = await config.api.row.save(otherTable._id!, {
            name: "test",
            description: "test",
            relationship: [row._id],
          })
          row = await config.api.row.get(table._id!, row._id!)
          expect(row.relationship.length).toBe(1)
          const resp = await config.api.row.patch(table._id!, {
            _id: row._id!,
            _rev: row._rev!,
            tableId: row.tableId!,
            name: "test2",
            relationship: [row2._id],
          })
          expect(resp.relationship.length).toBe(1)
        })

        it("should be able to keep linked data when updating from views that trims links from the main table", async () => {
          let row = await config.api.row.save(table._id!, {
            name: "main",
            description: "main description",
          })
          const row2 = await config.api.row.save(otherTable._id!, {
            name: "link",
            description: "link description",
            relationship: [row._id],
          })

          const view = await config.api.viewV2.create({
            tableId: table._id!,
            name: "view",
            schema: {
              name: { visible: true },
            },
          })
          const resp = await config.api.row.patch(view.id, {
            _id: row._id!,
            _rev: row._rev!,
            tableId: row.tableId!,
            name: "test2",
            relationship: [row2._id],
          })
          expect(resp.relationship).toBeUndefined()

          const updatedRow = await config.api.row.get(table._id!, row._id!)
          expect(updatedRow.relationship.length).toBe(1)
        })

        it("should be able to keep linked data when updating from views that trims links from the foreign table", async () => {
          let row = await config.api.row.save(table._id!, {
            name: "main",
            description: "main description",
          })
          const row2 = await config.api.row.save(otherTable._id!, {
            name: "link",
            description: "link description",
            relationship: [row._id],
          })

          const view = await config.api.viewV2.create({
            tableId: otherTable._id!,
            name: "view",
          })
          await config.api.row.patch(view.id, {
            _id: row2._id!,
            _rev: row2._rev!,
            tableId: row2.tableId!,
          })

          const updatedRow = await config.api.row.get(table._id!, row._id!)
          expect(updatedRow.relationship.length).toBe(1)
        })

        !isInternal &&
          // MSSQL needs a setting called IDENTITY_INSERT to be set to ON to allow writing
          // to identity columns. This is not something Budibase does currently.
          !isMSSQL &&
          it("should support updating fields that are part of a composite key", async () => {
            const tableRequest = saveTableRequest({
              primary: ["number", "string"],
              schema: {
                string: {
                  type: FieldType.STRING,
                  name: "string",
                },
                number: {
                  type: FieldType.NUMBER,
                  name: "number",
                },
              },
            })

            delete tableRequest.schema.id

            const table = await config.api.table.save(tableRequest)

            const stringValue = generator.word()

            // MySQL and MariaDB auto-increment fields have a minimum value of 1. If
            // you try to save a row with a value of 0 it will use 1 instead.
            const naturalValue = generator.integer({ min: 1, max: 1000 })

            const existing = await config.api.row.save(table._id!, {
              string: stringValue,
              number: naturalValue,
            })

            expect(existing._id).toEqual(
              `%5B${naturalValue}%2C'${stringValue}'%5D`
            )

            const row = await config.api.row.patch(table._id!, {
              _id: existing._id!,
              _rev: existing._rev!,
              tableId: table._id!,
              string: stringValue,
              number: 1500,
            })

            expect(row._id).toEqual(`%5B${"1500"}%2C'${stringValue}'%5D`)
          })
      })

      describe("destroy", () => {
        beforeAll(async () => {
          table = await config.api.table.save(defaultTable())
        })

        it("should be able to delete a row", async () => {
          const createdRow = await config.api.row.save(table._id!, {})
          const rowUsage = await getRowUsage()

          const res = await config.api.row.bulkDelete(table._id!, {
            rows: [createdRow],
          })
          expect(res[0]._id).toEqual(createdRow._id)
          await assertRowUsage(isInternal ? rowUsage - 1 : rowUsage)
        })

        it("should be able to delete a row with ID only", async () => {
          const createdRow = await config.api.row.save(table._id!, {})
          const rowUsage = await getRowUsage()

          const res = await config.api.row.bulkDelete(table._id!, {
            rows: [createdRow._id!],
          })
          expect(res[0]._id).toEqual(createdRow._id)
          expect(res[0].tableId).toEqual(table._id!)
          await assertRowUsage(isInternal ? rowUsage - 1 : rowUsage)
        })

        it("should be able to bulk delete rows, including a row that doesn't exist", async () => {
          const createdRow = await config.api.row.save(table._id!, {})
          const createdRow2 = await config.api.row.save(table._id!, {})

          const res = await config.api.row.bulkDelete(table._id!, {
            rows: [createdRow, createdRow2, { _id: "9999999" }],
          })

          expect(res.map(r => r._id)).toEqual(
            expect.arrayContaining([createdRow._id, createdRow2._id])
          )
          expect(res.length).toEqual(2)
        })

        describe("relations to same table", () => {
          let relatedRows: Row[]

          beforeAll(async () => {
            const relatedTable = await config.api.table.save(
              defaultTable({
                schema: {
                  name: { name: "name", type: FieldType.STRING },
                },
              })
            )
            const relatedTableId = relatedTable._id!
            table = await config.api.table.save(
              defaultTable({
                schema: {
                  name: { name: "name", type: FieldType.STRING },
                  related1: {
                    type: FieldType.LINK,
                    name: "related1",
                    fieldName: "main1",
                    tableId: relatedTableId,
                    relationshipType: RelationshipType.MANY_TO_MANY,
                  },
                  related2: {
                    type: FieldType.LINK,
                    name: "related2",
                    fieldName: "main2",
                    tableId: relatedTableId,
                    relationshipType: RelationshipType.MANY_TO_MANY,
                  },
                },
              })
            )
            relatedRows = await Promise.all([
              config.api.row.save(relatedTableId, { name: "foo" }),
              config.api.row.save(relatedTableId, { name: "bar" }),
              config.api.row.save(relatedTableId, { name: "baz" }),
              config.api.row.save(relatedTableId, { name: "boo" }),
            ])
          })

          it("can delete rows with both relationships", async () => {
            const row = await config.api.row.save(table._id!, {
              name: "test",
              related1: [relatedRows[0]._id!],
              related2: [relatedRows[1]._id!],
            })

            await config.api.row.delete(table._id!, { _id: row._id! })

            await config.api.row.get(table._id!, row._id!, { status: 404 })
          })

          it("can delete rows with empty relationships", async () => {
            const row = await config.api.row.save(table._id!, {
              name: "test",
              related1: [],
              related2: [],
            })

            await config.api.row.delete(table._id!, { _id: row._id! })

            await config.api.row.get(table._id!, row._id!, { status: 404 })
          })
        })
      })

      describe("validate", () => {
        beforeAll(async () => {
          table = await config.api.table.save(defaultTable())
        })

        it("should return no errors on valid row", async () => {
          const rowUsage = await getRowUsage()

          const res = await config.api.row.validate(table._id!, {
            name: "ivan",
          })

          expect(res.valid).toBe(true)
          expect(Object.keys(res.errors)).toEqual([])
          await assertRowUsage(rowUsage)
        })

        it("should errors on invalid row", async () => {
          const rowUsage = await getRowUsage()

          const res = await config.api.row.validate(table._id!, { name: 1 })

          if (isInternal) {
            expect(res.valid).toBe(false)
            expect(Object.keys(res.errors)).toEqual(["name"])
          } else {
            // Validation for external is not implemented, so it will always return valid
            expect(res.valid).toBe(true)
            expect(Object.keys(res.errors)).toEqual([])
          }
          await assertRowUsage(rowUsage)
        })
      })

      describe("bulkDelete", () => {
        beforeAll(async () => {
          table = await config.api.table.save(defaultTable())
        })

        it("should be able to delete a bulk set of rows", async () => {
          const row1 = await config.api.row.save(table._id!, {})
          const row2 = await config.api.row.save(table._id!, {})
          const rowUsage = await getRowUsage()

          const res = await config.api.row.bulkDelete(table._id!, {
            rows: [row1, row2],
          })

          expect(res.length).toEqual(2)
          await config.api.row.get(table._id!, row1._id!, { status: 404 })
          await assertRowUsage(isInternal ? rowUsage - 2 : rowUsage)
        })

        it("should be able to delete a variety of row set types", async () => {
          const [row1, row2, row3] = await Promise.all([
            config.api.row.save(table._id!, {}),
            config.api.row.save(table._id!, {}),
            config.api.row.save(table._id!, {}),
          ])
          const rowUsage = await getRowUsage()

          const res = await config.api.row.bulkDelete(table._id!, {
            rows: [row1, row2._id!, { _id: row3._id }],
          })

          expect(res.length).toEqual(3)
          await config.api.row.get(table._id!, row1._id!, { status: 404 })
          await assertRowUsage(isInternal ? rowUsage - 3 : rowUsage)
        })

        it("should accept a valid row object and delete the row", async () => {
          const row1 = await config.api.row.save(table._id!, {})
          const rowUsage = await getRowUsage()

          const res = await config.api.row.delete(table._id!, row1 as DeleteRow)

          expect(res.id).toEqual(row1._id)
          await config.api.row.get(table._id!, row1._id!, { status: 404 })
          await assertRowUsage(isInternal ? rowUsage - 1 : rowUsage)
        })

        it.each([{ not: "valid" }, { rows: 123 }, "invalid"])(
          "should ignore malformed/invalid delete request: %s",
          async (request: any) => {
            const rowUsage = await getRowUsage()

            await config.api.row.delete(table._id!, request, {
              status: 400,
              body: {
                message: "Invalid delete rows request",
              },
            })

            await assertRowUsage(rowUsage)
          }
        )
      })

      describe("bulkImport", () => {
        isInternal &&
          it("should update Auto ID field after bulk import", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                primary: ["autoId"],
                schema: {
                  autoId: {
                    name: "autoId",
                    type: FieldType.NUMBER,
                    subtype: AutoFieldSubType.AUTO_ID,
                    autocolumn: true,
                    constraints: {
                      type: "number",
                      presence: false,
                    },
                  },
                },
              })
            )

            let row = await config.api.row.save(table._id!, {})
            expect(row.autoId).toEqual(1)

            await config.api.row.bulkImport(table._id!, {
              rows: [{ autoId: 2 }],
            })

            row = await config.api.row.save(table._id!, {})
            expect(row.autoId).toEqual(3)
          })

        isInternal &&
          it("should reject bulkImporting relationship fields", async () => {
            const table1 = await config.api.table.save(saveTableRequest())
            const table2 = await config.api.table.save(
              saveTableRequest({
                schema: {
                  relationship: {
                    name: "relationship",
                    type: FieldType.LINK,
                    tableId: table1._id!,
                    relationshipType: RelationshipType.ONE_TO_MANY,
                    fieldName: "relationship",
                  },
                },
              })
            )

            const table1Row1 = await config.api.row.save(table1._id!, {})
            await config.api.row.bulkImport(
              table2._id!,
              {
                rows: [{ relationship: [table1Row1._id!] }],
              },
              {
                status: 400,
                body: {
                  message:
                    'Can\'t bulk import relationship fields for internal databases, found value in field "relationship"',
                },
              }
            )
          })

        it("should be able to bulkImport rows", async () => {
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                name: {
                  type: FieldType.STRING,
                  name: "name",
                },
                description: {
                  type: FieldType.STRING,
                  name: "description",
                },
              },
            })
          )

          const rowUsage = await getRowUsage()

          await config.api.row.bulkImport(table._id!, {
            rows: [
              {
                name: "Row 1",
                description: "Row 1 description",
              },
              {
                name: "Row 2",
                description: "Row 2 description",
              },
            ],
          })

          const rows = await config.api.row.fetch(table._id!)
          expect(rows.length).toEqual(2)

          rows.sort((a, b) => a.name.localeCompare(b.name))
          expect(rows[0].name).toEqual("Row 1")
          expect(rows[0].description).toEqual("Row 1 description")
          expect(rows[1].name).toEqual("Row 2")
          expect(rows[1].description).toEqual("Row 2 description")

          await assertRowUsage(isInternal ? rowUsage + 2 : rowUsage)
        })

        isInternal &&
          it("should be able to update existing rows on bulkImport", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  name: {
                    type: FieldType.STRING,
                    name: "name",
                  },
                  description: {
                    type: FieldType.STRING,
                    name: "description",
                  },
                },
              })
            )

            const existingRow = await config.api.row.save(table._id!, {
              name: "Existing row",
              description: "Existing description",
            })

            const rowUsage = await getRowUsage()

            await config.api.row.bulkImport(table._id!, {
              rows: [
                {
                  name: "Row 1",
                  description: "Row 1 description",
                },
                { ...existingRow, name: "Updated existing row" },
                {
                  name: "Row 2",
                  description: "Row 2 description",
                },
              ],
              identifierFields: ["_id"],
            })

            const rows = await config.api.row.fetch(table._id!)
            expect(rows.length).toEqual(3)

            rows.sort((a, b) => a.name.localeCompare(b.name))
            expect(rows[0].name).toEqual("Row 1")
            expect(rows[0].description).toEqual("Row 1 description")
            expect(rows[1].name).toEqual("Row 2")
            expect(rows[1].description).toEqual("Row 2 description")
            expect(rows[2].name).toEqual("Updated existing row")
            expect(rows[2].description).toEqual("Existing description")

            await assertRowUsage(rowUsage + 2)
          })

        isInternal &&
          it("should create new rows if not identifierFields are provided", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  name: {
                    type: FieldType.STRING,
                    name: "name",
                  },
                  description: {
                    type: FieldType.STRING,
                    name: "description",
                  },
                },
              })
            )

            const existingRow = await config.api.row.save(table._id!, {
              name: "Existing row",
              description: "Existing description",
            })

            const rowUsage = await getRowUsage()

            await config.api.row.bulkImport(table._id!, {
              rows: [
                {
                  name: "Row 1",
                  description: "Row 1 description",
                },
                { ...existingRow, name: "Updated existing row" },
                {
                  name: "Row 2",
                  description: "Row 2 description",
                },
              ],
            })

            const rows = await config.api.row.fetch(table._id!)
            expect(rows.length).toEqual(4)

            rows.sort((a, b) => a.name.localeCompare(b.name))
            expect(rows[0].name).toEqual("Existing row")
            expect(rows[0].description).toEqual("Existing description")
            expect(rows[1].name).toEqual("Row 1")
            expect(rows[1].description).toEqual("Row 1 description")
            expect(rows[2].name).toEqual("Row 2")
            expect(rows[2].description).toEqual("Row 2 description")
            expect(rows[3].name).toEqual("Updated existing row")
            expect(rows[3].description).toEqual("Existing description")

            await assertRowUsage(rowUsage + 3)
          })

        // Upserting isn't yet supported in MSSQL / Oracle, see:
        //   https://github.com/knex/knex/pull/6050
        !isMSSQL &&
          !isOracle &&
          it("should be able to update existing rows with bulkImport", async () => {
            const table = await config.api.table.save(
              saveTableRequest({
                primary: ["userId"],
                schema: {
                  userId: {
                    type: FieldType.NUMBER,
                    name: "userId",
                    constraints: {
                      presence: true,
                    },
                  },
                  name: {
                    type: FieldType.STRING,
                    name: "name",
                  },
                  description: {
                    type: FieldType.STRING,
                    name: "description",
                  },
                },
              })
            )

            const row1 = await config.api.row.save(table._id!, {
              userId: 1,
              name: "Row 1",
              description: "Row 1 description",
            })

            const row2 = await config.api.row.save(table._id!, {
              userId: 2,
              name: "Row 2",
              description: "Row 2 description",
            })

            await config.api.row.bulkImport(table._id!, {
              identifierFields: ["userId"],
              rows: [
                {
                  userId: row1.userId,
                  name: "Row 1 updated",
                  description: "Row 1 description updated",
                },
                {
                  userId: row2.userId,
                  name: "Row 2 updated",
                  description: "Row 2 description updated",
                },
                {
                  userId: 3,
                  name: "Row 3",
                  description: "Row 3 description",
                },
              ],
            })

            const rows = await config.api.row.fetch(table._id!)
            expect(rows.length).toEqual(3)

            rows.sort((a, b) => a.name.localeCompare(b.name))
            expect(rows[0].name).toEqual("Row 1 updated")
            expect(rows[0].description).toEqual("Row 1 description updated")
            expect(rows[1].name).toEqual("Row 2 updated")
            expect(rows[1].description).toEqual("Row 2 description updated")
            expect(rows[2].name).toEqual("Row 3")
            expect(rows[2].description).toEqual("Row 3 description")
          })

        // Upserting isn't yet supported in MSSQL or Oracle, see:
        //   https://github.com/knex/knex/pull/6050
        !isMSSQL &&
          !isOracle &&
          !isInternal &&
          it("should be able to update existing rows with composite primary keys with bulkImport", async () => {
            const tableName = uuid.v4()
            await client?.schema.createTable(tableName, table => {
              table.integer("companyId")
              table.integer("userId")
              table.string("name")
              table.string("description")
              table.primary(["companyId", "userId"])
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource!._id!,
            })
            const table = resp.datasource.entities![tableName]

            const row1 = await config.api.row.save(table._id!, {
              companyId: 1,
              userId: 1,
              name: "Row 1",
              description: "Row 1 description",
            })

            const row2 = await config.api.row.save(table._id!, {
              companyId: 1,
              userId: 2,
              name: "Row 2",
              description: "Row 2 description",
            })

            await config.api.row.bulkImport(table._id!, {
              identifierFields: ["companyId", "userId"],
              rows: [
                {
                  companyId: 1,
                  userId: row1.userId,
                  name: "Row 1 updated",
                  description: "Row 1 description updated",
                },
                {
                  companyId: 1,
                  userId: row2.userId,
                  name: "Row 2 updated",
                  description: "Row 2 description updated",
                },
                {
                  companyId: 1,
                  userId: 3,
                  name: "Row 3",
                  description: "Row 3 description",
                },
              ],
            })

            const rows = await config.api.row.fetch(table._id!)
            expect(rows.length).toEqual(3)

            rows.sort((a, b) => a.name.localeCompare(b.name))
            expect(rows[0].name).toEqual("Row 1 updated")
            expect(rows[0].description).toEqual("Row 1 description updated")
            expect(rows[1].name).toEqual("Row 2 updated")
            expect(rows[1].description).toEqual("Row 2 description updated")
            expect(rows[2].name).toEqual("Row 3")
            expect(rows[2].description).toEqual("Row 3 description")
          })

        // Upserting isn't yet supported in MSSQL/Oracle, see:
        //   https://github.com/knex/knex/pull/6050
        !isMSSQL &&
          !isOracle &&
          !isInternal &&
          it("should be able to update existing rows an autoID primary key", async () => {
            const tableName = uuid.v4()
            await client!.schema.createTable(tableName, table => {
              table.increments("userId").primary()
              table.string("name")
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource!._id!,
            })
            const table = resp.datasource.entities![tableName]

            const row1 = await config.api.row.save(table._id!, {
              name: "Clare",
            })

            const row2 = await config.api.row.save(table._id!, {
              name: "Jeff",
            })

            await config.api.row.bulkImport(table._id!, {
              identifierFields: ["userId"],
              rows: [
                {
                  userId: row1.userId,
                  name: "Clare updated",
                },
                {
                  userId: row2.userId,
                  name: "Jeff updated",
                },
              ],
            })

            const rows = await config.api.row.fetch(table._id!)
            expect(rows.length).toEqual(2)

            rows.sort((a, b) => a.name.localeCompare(b.name))
            expect(rows[0].name).toEqual("Clare updated")
            expect(rows[1].name).toEqual("Jeff updated")
          })

        it("should reject bulkImport date only fields with wrong format", async () => {
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                date: {
                  type: FieldType.DATETIME,
                  dateOnly: true,
                  name: "date",
                },
              },
            })
          )

          await config.api.row.bulkImport(
            table._id!,
            {
              rows: [
                {
                  date: "01.02.2024",
                },
              ],
            },
            {
              status: 400,
              body: {
                message:
                  'Invalid format for field "date": "01.02.2024". Date-only fields must be in the format "YYYY-MM-DD".',
              },
            }
          )
        })

        it("should reject bulkImport date time fields with wrong format", async () => {
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                date: {
                  type: FieldType.DATETIME,
                  name: "date",
                },
              },
            })
          )

          await config.api.row.bulkImport(
            table._id!,
            {
              rows: [
                {
                  date: "01.02.2024",
                },
              ],
            },
            {
              status: 400,
              body: {
                message:
                  'Invalid format for field "date": "01.02.2024". Datetime fields must be in ISO format, e.g. "YYYY-MM-DDTHH:MM:SSZ".',
              },
            }
          )
        })

        it("should reject bulkImport time fields with wrong format", async () => {
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                time: {
                  type: FieldType.DATETIME,
                  timeOnly: true,
                  name: "time",
                },
              },
            })
          )

          await config.api.row.bulkImport(
            table._id!,
            {
              rows: [
                {
                  time: "3pm",
                },
              ],
            },
            {
              status: 400,
              body: {
                message:
                  'Invalid format for field "time": "3pm". Time-only fields must be in the format "HH:MM:SS".',
              },
            }
          )
        })
      })

      describe("enrich", () => {
        beforeAll(async () => {
          table = await config.api.table.save(defaultTable())
        })

        it("should allow enriching some linked rows", async () => {
          const { linkedTable, firstRow, secondRow } = await tenancy.doInTenant(
            config.getTenantId(),
            async () => {
              const linkedTable = await config.api.table.save(
                defaultTable({
                  schema: {
                    link: {
                      name: "link",
                      fieldName: "link",
                      type: FieldType.LINK,
                      relationshipType: RelationshipType.ONE_TO_MANY,
                      tableId: table._id!,
                    },
                  },
                })
              )
              const firstRow = await config.api.row.save(table._id!, {
                name: "Test Contact",
                description: "original description",
              })
              const secondRow = await config.api.row.save(linkedTable._id!, {
                name: "Test 2",
                description: "og desc",
                link: [{ _id: firstRow._id }],
              })
              return { linkedTable, firstRow, secondRow }
            }
          )
          const rowUsage = await getRowUsage()

          // test basic enrichment
          const resBasic = await config.api.row.get(
            linkedTable._id!,
            secondRow._id!
          )
          expect(resBasic.link.length).toBe(1)
          expect(resBasic.link[0]).toEqual({
            _id: firstRow._id,
            primaryDisplay: firstRow.name,
          })

          // test full enrichment
          const resEnriched = await config.api.row.getEnriched(
            linkedTable._id!,
            secondRow._id!
          )
          expect(resEnriched.link.length).toBe(1)
          expect(resEnriched.link[0]._id).toBe(firstRow._id)
          expect(resEnriched.link[0].name).toBe("Test Contact")
          expect(resEnriched.link[0].description).toBe("original description")
          await assertRowUsage(rowUsage)
        })
      })

      isInternal &&
        describe("attachments and signatures", () => {
          const coreAttachmentEnrichment = async (
            schema: TableSchema,
            field: string,
            attachmentCfg: string | string[]
          ) => {
            const testTable = await config.api.table.save(
              defaultTable({
                schema,
              })
            )
            const attachmentToStoreKey = (attachmentId: string) => {
              return {
                key: `${config.getAppId()}/attachments/${attachmentId}`,
              }
            }
            const draftRow = {
              name: "test",
              description: "test",
              [field]:
                typeof attachmentCfg === "string"
                  ? attachmentToStoreKey(attachmentCfg)
                  : attachmentCfg.map(attachmentToStoreKey),
              tableId: testTable._id,
            }
            const row = await config.api.row.save(testTable._id!, draftRow)

            await withEnv({ SELF_HOSTED: "true" }, async () => {
              return context.doInAppContext(config.getAppId(), async () => {
                const enriched: Row[] = await outputProcessing(testTable, [row])
                const [targetRow] = enriched
                const attachmentEntries = Array.isArray(targetRow[field])
                  ? targetRow[field]
                  : [targetRow[field]]

                for (const entry of attachmentEntries) {
                  const attachmentId = entry.key.split("/").pop()
                  expect(entry.url.split("?")[0]).toBe(
                    `/files/signed/prod-budi-app-assets/${config.getProdAppId()}/attachments/${attachmentId}`
                  )
                }
              })
            })
          }

          it("should allow enriching single attachment rows", async () => {
            await coreAttachmentEnrichment(
              {
                attachment: {
                  type: FieldType.ATTACHMENT_SINGLE,
                  name: "attachment",
                  constraints: { presence: false },
                },
              },
              "attachment",
              `${uuid.v4()}.csv`
            )
          })

          it("should allow enriching attachment list rows", async () => {
            await coreAttachmentEnrichment(
              {
                attachments: {
                  type: FieldType.ATTACHMENTS,
                  name: "attachments",
                  constraints: { type: "array", presence: false },
                },
              },
              "attachments",
              [`${uuid.v4()}.csv`]
            )
          })

          it("should allow enriching signature rows", async () => {
            await coreAttachmentEnrichment(
              {
                signature: {
                  type: FieldType.SIGNATURE_SINGLE,
                  name: "signature",
                  constraints: { presence: false },
                },
              },
              "signature",
              `${uuid.v4()}.png`
            )
          })
        })

      describe("exportRows", () => {
        beforeEach(async () => {
          table = await config.api.table.save(defaultTable())
        })

        isInternal &&
          it("should not export internal couchdb fields", async () => {
            const existing = await config.api.row.save(table._id!, {
              name: generator.guid(),
              description: generator.paragraph(),
            })
            const res = await config.api.row.exportRows(table._id!, {
              rows: [existing._id!],
            })
            const results = JSON.parse(res)
            expect(results.length).toEqual(1)
            const row = results[0]

            expect(Object.keys(row)).toEqual(["_id", "name", "description"])
          })

        !isInternal &&
          it("should allow exporting all columns", async () => {
            const existing = await config.api.row.save(table._id!, {})
            const res = await config.api.row.exportRows(table._id!, {
              rows: [existing._id!],
            })
            const results = JSON.parse(res)
            expect(results.length).toEqual(1)
            const row = results[0]

            // Ensure all original columns were exported
            expect(Object.keys(row).length).toBe(Object.keys(existing).length)
            Object.keys(existing).forEach(key => {
              expect(row[key]).toEqual(existing[key])
            })
          })

        it("should allow exporting without filtering", async () => {
          const existing = await config.api.row.save(table._id!, {})
          const res = await config.api.row.exportRows(table._id!)
          const results = JSON.parse(res)
          expect(results.length).toEqual(1)
          const row = results[0]

          expect(row._id).toEqual(existing._id)
        })

        it("should allow exporting only certain columns", async () => {
          const existing = await config.api.row.save(table._id!, {})
          const res = await config.api.row.exportRows(table._id!, {
            rows: [existing._id!],
            columns: ["_id"],
          })
          const results = JSON.parse(res)
          expect(results.length).toEqual(1)
          const row = results[0]

          // Ensure only the _id column was exported
          expect(Object.keys(row).length).toEqual(1)
          expect(row._id).toEqual(existing._id)
        })

        it("should handle single quotes in row filtering", async () => {
          const existing = await config.api.row.save(table._id!, {})
          const res = await config.api.row.exportRows(table._id!, {
            rows: [`['${existing._id!}']`],
          })
          const results = JSON.parse(res)
          expect(results.length).toEqual(1)
          const row = results[0]
          expect(row._id).toEqual(existing._id)
        })

        it("should return an error if no table is found", async () => {
          const existing = await config.api.row.save(table._id!, {})
          await config.api.row.exportRows(
            "1234567",
            { rows: [existing._id!] },
            RowExportFormat.JSON,
            { status: 404 }
          )
        })

        // MSSQL needs a setting called IDENTITY_INSERT to be set to ON to allow writing
        // to identity columns. This is not something Budibase does currently.
        !isMSSQL &&
          it("should handle filtering by composite primary keys", async () => {
            const tableRequest = saveTableRequest({
              primary: ["number", "string"],
              schema: {
                string: {
                  type: FieldType.STRING,
                  name: "string",
                },
                number: {
                  type: FieldType.NUMBER,
                  name: "number",
                },
              },
            })
            delete tableRequest.schema.id

            const table = await config.api.table.save(tableRequest)
            const toCreate = generator
              .unique(() => generator.integer({ min: 0, max: 10000 }), 10)
              .map(number => ({
                number,
                string: generator.word({ length: 30 }),
              }))

            const rows = await Promise.all(
              toCreate.map(d => config.api.row.save(table._id!, d))
            )

            const res = await config.api.row.exportRows(table._id!, {
              rows: _.sampleSize(rows, 3).map(r => r._id!),
            })
            const results = JSON.parse(res)
            expect(results.length).toEqual(3)
          })

        describe("should allow exporting all column types", () => {
          let tableId: string
          let expectedRowData: Row

          beforeAll(async () => {
            const fullSchema = setup.structures.fullSchemaWithoutLinks({
              allRequired: true,
            })

            const table = await config.api.table.save(
              saveTableRequest({
                ...setup.structures.basicTable(),
                schema: fullSchema,
                primary: ["string"],
              })
            )
            tableId = table._id!

            const rowValues: Record<keyof typeof fullSchema, any> = {
              [FieldType.STRING]: generator.guid(),
              [FieldType.LONGFORM]: generator.paragraph(),
              [FieldType.OPTIONS]: "option 2",
              [FieldType.ARRAY]: ["options 2", "options 4"],
              [FieldType.NUMBER]: generator.natural(),
              [FieldType.BOOLEAN]: generator.bool(),
              [FieldType.DATETIME]: generator.date().toISOString().slice(0, 10),
              [FieldType.ATTACHMENTS]: [setup.structures.basicAttachment()],
              [FieldType.ATTACHMENT_SINGLE]: setup.structures.basicAttachment(),
              [FieldType.FORMULA]: undefined, // generated field
              [FieldType.AUTO]: undefined, // generated field
              [FieldType.AI]: "LLM Output",
              [FieldType.JSON]: { name: generator.guid() },
              [FieldType.INTERNAL]: generator.guid(),
              [FieldType.BARCODEQR]: generator.guid(),
              [FieldType.SIGNATURE_SINGLE]: setup.structures.basicAttachment(),
              [FieldType.BIGINT]: generator.integer().toString(),
              [FieldType.BB_REFERENCE]: [{ _id: config.getUser()._id }],
              [FieldType.BB_REFERENCE_SINGLE]: { _id: config.getUser()._id },
            }
            const row = await config.api.row.save(table._id!, rowValues)
            expectedRowData = {
              _id: row._id,
              [FieldType.STRING]: rowValues[FieldType.STRING],
              [FieldType.LONGFORM]: rowValues[FieldType.LONGFORM],
              [FieldType.OPTIONS]: rowValues[FieldType.OPTIONS],
              [FieldType.ARRAY]: rowValues[FieldType.ARRAY],
              [FieldType.NUMBER]: rowValues[FieldType.NUMBER],
              [FieldType.BOOLEAN]: rowValues[FieldType.BOOLEAN],
              [FieldType.DATETIME]: rowValues[FieldType.DATETIME],
              [FieldType.ATTACHMENTS]: rowValues[FieldType.ATTACHMENTS].map(
                (a: any) =>
                  expect.objectContaining({
                    ...a,
                    url: expect.any(String),
                  })
              ),
              [FieldType.ATTACHMENT_SINGLE]: expect.objectContaining({
                ...rowValues[FieldType.ATTACHMENT_SINGLE],
                url: expect.any(String),
              }),
              [FieldType.FORMULA]: fullSchema[FieldType.FORMULA].formula,
              [FieldType.AUTO]: expect.any(Number),
              [FieldType.AI]: expect.any(String),
              [FieldType.JSON]: rowValues[FieldType.JSON],
              [FieldType.INTERNAL]: rowValues[FieldType.INTERNAL],
              [FieldType.BARCODEQR]: rowValues[FieldType.BARCODEQR],
              [FieldType.SIGNATURE_SINGLE]: expect.objectContaining({
                ...rowValues[FieldType.SIGNATURE_SINGLE],
                url: expect.any(String),
              }),
              [FieldType.BIGINT]: rowValues[FieldType.BIGINT],
              [FieldType.BB_REFERENCE]: rowValues[FieldType.BB_REFERENCE].map(
                expect.objectContaining
              ),
              [FieldType.BB_REFERENCE_SINGLE]: expect.objectContaining(
                rowValues[FieldType.BB_REFERENCE_SINGLE]
              ),
            }
          })

          it("as csv", async () => {
            const exportedValue = await config.api.row.exportRows(
              tableId,
              { query: {} },
              RowExportFormat.CSV
            )

            const jsonResult = await config.api.table.csvToJson({
              csvString: exportedValue,
            })

            const stringified = (value: string) =>
              JSON.stringify(value).replace(/"/g, "'")

            const matchingObject = (
              key: string,
              value: any,
              isArray: boolean
            ) => {
              const objectMatcher = `{'${key}':'${value[key]}'.*?}`
              if (isArray) {
                return expect.stringMatching(
                  new RegExp(`^\\[${objectMatcher}\\]$`)
                )
              }
              return expect.stringMatching(new RegExp(`^${objectMatcher}$`))
            }

            expect(jsonResult).toEqual([
              {
                ...expectedRowData,
                auto: expect.any(String),
                array: stringified(expectedRowData["array"]),
                attachment: matchingObject(
                  "key",
                  expectedRowData["attachment"][0].sample,
                  true
                ),
                attachment_single: matchingObject(
                  "key",
                  expectedRowData["attachment_single"].sample,
                  false
                ),
                boolean: stringified(expectedRowData["boolean"]),
                json: stringified(expectedRowData["json"]),
                number: stringified(expectedRowData["number"]),
                signature_single: matchingObject(
                  "key",
                  expectedRowData["signature_single"].sample,
                  false
                ),
                bb_reference: matchingObject(
                  "_id",
                  expectedRowData["bb_reference"][0].sample,
                  true
                ),
                bb_reference_single: matchingObject(
                  "_id",
                  expectedRowData["bb_reference_single"].sample,
                  false
                ),
                ai: "LLM Output",
              },
            ])
          })

          it("as json", async () => {
            const exportedValue = await config.api.row.exportRows(
              tableId,
              { query: {} },
              RowExportFormat.JSON
            )

            const json = JSON.parse(exportedValue)
            expect(json).toEqual([expectedRowData])
          })

          it("as json with schema", async () => {
            const exportedValue = await config.api.row.exportRows(
              tableId,
              { query: {} },
              RowExportFormat.JSON_WITH_SCHEMA
            )

            const json = JSON.parse(exportedValue)
            expect(json).toEqual({
              schema: expect.any(Object),
              rows: [expectedRowData],
            })
          })

          it("can handle csv-special characters in strings", async () => {
            const badString = 'test":, wow", "test": "wow"'
            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  string: {
                    type: FieldType.STRING,
                    name: "string",
                  },
                },
              })
            )

            await config.api.row.save(table._id!, { string: badString })

            const exportedValue = await config.api.row.exportRows(
              table._id!,
              { query: {} },
              RowExportFormat.CSV
            )

            const json = await config.api.table.csvToJson(
              {
                csvString: exportedValue,
              },
              {
                status: 200,
              }
            )

            expect(json).toHaveLength(1)
            expect(json[0].string).toEqual(badString)
          })

          it("exported data can be re-imported", async () => {
            // export all
            const exportedValue = await config.api.row.exportRows(
              tableId,
              { query: {} },
              RowExportFormat.CSV
            )

            // import all twice
            const rows = await config.api.table.csvToJson({
              csvString: exportedValue,
            })
            await config.api.row.bulkImport(tableId, {
              rows,
            })
            await config.api.row.bulkImport(tableId, {
              rows,
            })

            const { rows: allRows } = await config.api.row.search(tableId)

            const expectedRow = {
              ...expectedRowData,
              _id: expect.any(String),
              _rev: expect.any(String),
              type: "row",
              tableId: tableId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            expect(allRows).toEqual([expectedRow, expectedRow, expectedRow])
          })
        })
      })

      let o2mTable: Table
      let m2mTable: Table
      beforeAll(async () => {
        o2mTable = await config.api.table.save(defaultTable())
        m2mTable = await config.api.table.save(defaultTable())
      })

      describe.each([
        [
          "relationship fields",
          (): Record<string, FieldSchema> => ({
            user: {
              name: "user",
              relationshipType: RelationshipType.ONE_TO_MANY,
              type: FieldType.LINK,
              tableId: o2mTable._id!,
              fieldName: "fk_o2m",
            },
            users: {
              name: "users",
              relationshipType: RelationshipType.MANY_TO_MANY,
              type: FieldType.LINK,
              tableId: m2mTable._id!,
              fieldName: "fk_m2m",
            },
          }),
          (tableId: string) =>
            config.api.row.save(tableId, {
              name: uuid.v4(),
              description: generator.paragraph(),
              tableId,
            }),
          (row: Row) => ({
            _id: row._id,
            primaryDisplay: row.name,
          }),
        ],
        [
          "bb reference fields",
          (): Record<string, FieldSchema> => ({
            user: {
              name: "user",
              type: FieldType.BB_REFERENCE,
              subtype: BBReferenceFieldSubType.USER,
            },
            users: {
              name: "users",
              type: FieldType.BB_REFERENCE,
              subtype: BBReferenceFieldSubType.USERS,
            },
          }),
          () => config.createUser(),
          (row: Row) => ({
            _id: row._id,
            primaryDisplay: row.email,
            email: row.email,
            firstName: row.firstName,
            lastName: row.lastName,
          }),
        ],
      ])("links - %s", (__, relSchema, dataGenerator, resultMapper) => {
        let tableId: string
        let o2mData: Row[]
        let m2mData: Row[]

        beforeAll(async () => {
          const table = await config.api.table.save(
            defaultTable({ schema: relSchema() })
          )
          tableId = table._id!

          o2mData = [
            await dataGenerator(o2mTable._id!),
            await dataGenerator(o2mTable._id!),
            await dataGenerator(o2mTable._id!),
            await dataGenerator(o2mTable._id!),
          ]

          m2mData = [
            await dataGenerator(m2mTable._id!),
            await dataGenerator(m2mTable._id!),
            await dataGenerator(m2mTable._id!),
            await dataGenerator(m2mTable._id!),
          ]
        })

        it("can save a row when relationship fields are empty", async () => {
          const row = await config.api.row.save(tableId, {
            name: "foo",
            description: "bar",
          })

          expect(row).toEqual({
            _id: expect.any(String),
            _rev: expect.any(String),
            id: isInternal ? undefined : expect.any(Number),
            type: isInternal ? "row" : undefined,
            name: "foo",
            description: "bar",
            tableId,
            createdAt: isInternal ? new Date().toISOString() : undefined,
            updatedAt: isInternal ? new Date().toISOString() : undefined,
          })
        })

        it("can save a row with a single relationship field", async () => {
          const user = _.sample(o2mData)!
          const row = await config.api.row.save(tableId, {
            name: "foo",
            description: "bar",
            user: [user],
          })

          expect(row).toEqual({
            name: "foo",
            description: "bar",
            tableId,
            user: [user].map(u => resultMapper(u)),
            _id: expect.any(String),
            _rev: expect.any(String),
            id: isInternal ? undefined : expect.any(Number),
            type: isInternal ? "row" : undefined,
            [`fk_${o2mTable.name}_fk_o2m`]: isInternal ? undefined : user.id,
            createdAt: isInternal ? new Date().toISOString() : undefined,
            updatedAt: isInternal ? new Date().toISOString() : undefined,
          })
        })

        it("can save a row with a multiple relationship field", async () => {
          const selectedUsers = _.sampleSize(m2mData, 2)
          const row = await config.api.row.save(tableId, {
            name: "foo",
            description: "bar",
            users: selectedUsers,
          })

          expect(row).toEqual({
            name: "foo",
            description: "bar",
            tableId,
            users: expect.arrayContaining(
              selectedUsers.map(u => resultMapper(u))
            ),
            _id: expect.any(String),
            _rev: expect.any(String),
            id: isInternal ? undefined : expect.any(Number),
            type: isInternal ? "row" : undefined,
            createdAt: isInternal ? new Date().toISOString() : undefined,
            updatedAt: isInternal ? new Date().toISOString() : undefined,
          })
        })

        it("can retrieve rows with no populated relationships", async () => {
          const row = await config.api.row.save(tableId, {
            name: "foo",
            description: "bar",
          })

          const retrieved = await config.api.row.get(tableId, row._id!)
          expect(retrieved).toEqual({
            name: "foo",
            description: "bar",
            tableId,
            user: undefined,
            users: undefined,
            _id: row._id,
            _rev: expect.any(String),
            id: isInternal ? undefined : expect.any(Number),
            ...defaultRowFields,
          })
        })

        it("can retrieve rows with populated relationships", async () => {
          const user1 = _.sample(o2mData)!
          const [user2, user3] = _.sampleSize(m2mData, 2)

          const row = await config.api.row.save(tableId, {
            name: "foo",
            description: "bar",
            users: [user2, user3],
            user: [user1],
          })

          const retrieved = await config.api.row.get(tableId, row._id!)
          expect(retrieved).toEqual({
            name: "foo",
            description: "bar",
            tableId,
            user: expect.arrayContaining([user1].map(u => resultMapper(u))),
            users: expect.arrayContaining(
              [user2, user3].map(u => resultMapper(u))
            ),
            _id: row._id,
            _rev: expect.any(String),
            id: isInternal ? undefined : expect.any(Number),
            [`fk_${o2mTable.name}_fk_o2m`]: isInternal ? undefined : user1.id,
            ...defaultRowFields,
          })
        })

        it("can update an existing populated row", async () => {
          const user = _.sample(o2mData)!
          const [users1, users2, users3] = _.sampleSize(m2mData, 3)

          const row = await config.api.row.save(tableId, {
            name: "foo",
            description: "bar",
            users: [users1, users2],
          })

          const updatedRow = await config.api.row.save(tableId, {
            ...row,
            user: [user],
            users: [users3, users1],
          })
          expect(updatedRow).toEqual({
            name: "foo",
            description: "bar",
            tableId,
            user: expect.arrayContaining([user].map(u => resultMapper(u))),
            users: expect.arrayContaining(
              [users3, users1].map(u => resultMapper(u))
            ),
            _id: row._id,
            _rev: expect.any(String),
            id: isInternal ? undefined : expect.any(Number),
            type: isInternal ? "row" : undefined,
            [`fk_${o2mTable.name}_fk_o2m`]: isInternal ? undefined : user.id,
            createdAt: isInternal ? new Date().toISOString() : undefined,
            updatedAt: isInternal ? new Date().toISOString() : undefined,
          })
        })

        it("can wipe an existing populated relationships in row", async () => {
          const [user1, user2] = _.sampleSize(m2mData, 2)
          const row = await config.api.row.save(tableId, {
            name: "foo",
            description: "bar",
            users: [user1, user2],
          })

          const updatedRow = await config.api.row.save(tableId, {
            ...row,
            user: null,
            users: null,
          })
          expect(updatedRow.user).toBeUndefined()
          expect(updatedRow.users).toBeUndefined()
        })

        it("fetch all will populate the relationships", async () => {
          const [user1] = _.sampleSize(o2mData, 1)
          const [users1, users2, users3] = _.sampleSize(m2mData, 3)

          const rows = [
            {
              name: generator.name(),
              description: generator.name(),
              users: [users1, users2],
            },
            {
              name: generator.name(),
              description: generator.name(),
              user: [user1],
              users: [users1, users3],
            },
            {
              name: generator.name(),
              description: generator.name(),
              users: [users3],
            },
          ]

          await config.api.row.save(tableId, rows[0])
          await config.api.row.save(tableId, rows[1])
          await config.api.row.save(tableId, rows[2])

          const res = await config.api.row.fetch(tableId)

          expect(res).toEqual(
            expect.arrayContaining(
              rows.map(r => ({
                name: r.name,
                description: r.description,
                tableId,
                user: r.user?.map(u => resultMapper(u)),
                users: r.users?.length
                  ? expect.arrayContaining(r.users?.map(u => resultMapper(u)))
                  : undefined,
                _id: expect.any(String),
                _rev: expect.any(String),
                id: isInternal ? undefined : expect.any(Number),
                [`fk_${o2mTable.name}_fk_o2m`]:
                  isInternal || !r.user?.length ? undefined : r.user[0].id,
                ...defaultRowFields,
              }))
            )
          )
        })

        it("search all will populate the relationships", async () => {
          const [user1] = _.sampleSize(o2mData, 1)
          const [users1, users2, users3] = _.sampleSize(m2mData, 3)

          const rows = [
            {
              name: generator.name(),
              description: generator.name(),
              users: [users1, users2],
            },
            {
              name: generator.name(),
              description: generator.name(),
              user: [user1],
              users: [users1, users3],
            },
            {
              name: generator.name(),
              description: generator.name(),
              users: [users3],
            },
          ]

          await config.api.row.save(tableId, rows[0])
          await config.api.row.save(tableId, rows[1])
          await config.api.row.save(tableId, rows[2])

          const res = await config.api.row.search(tableId)

          expect(res).toEqual({
            rows: expect.arrayContaining(
              rows.map(r => ({
                name: r.name,
                description: r.description,
                tableId,
                user: r.user?.map(u => resultMapper(u)),
                users: r.users?.length
                  ? expect.arrayContaining(r.users?.map(u => resultMapper(u)))
                  : undefined,
                _id: expect.any(String),
                _rev: expect.any(String),
                id: isInternal ? undefined : expect.any(Number),
                [`fk_${o2mTable.name}_fk_o2m`]:
                  isInternal || !r.user?.length ? undefined : r.user[0].id,
                ...defaultRowFields,
              }))
            ),
            ...(isInternal
              ? {}
              : {
                  hasNextPage: false,
                }),
          })
        })
      })

      // Upserting isn't yet supported in MSSQL or Oracle, see:
      //   https://github.com/knex/knex/pull/6050
      !isMSSQL &&
        !isOracle &&
        describe("relationships", () => {
          let tableId: string
          let viewId: string

          let auxData: Row[] = []

          beforeAll(async () => {
            const aux2Table = await config.api.table.save(saveTableRequest())
            const aux2Data = await config.api.row.save(aux2Table._id!, {})

            const auxTable = await config.api.table.save(
              saveTableRequest({
                primaryDisplay: "name",
                schema: {
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                    constraints: { presence: true },
                  },
                  age: {
                    name: "age",
                    type: FieldType.NUMBER,
                    constraints: { presence: true },
                  },
                  address: {
                    name: "address",
                    type: FieldType.STRING,
                    constraints: { presence: true },
                    visible: false,
                  },
                  link: {
                    name: "link",
                    type: FieldType.LINK,
                    tableId: aux2Table._id!,
                    relationshipType: RelationshipType.MANY_TO_MANY,
                    fieldName: "fk_aux",
                    constraints: { presence: true },
                  },
                  formula: {
                    name: "formula",
                    type: FieldType.FORMULA,
                    formula: "{{ any }}",
                    constraints: { presence: true },
                  },
                },
              })
            )
            const auxTableId = auxTable._id!

            for (const name of generator.unique(() => generator.name(), 10)) {
              auxData.push(
                await config.api.row.save(auxTableId, {
                  name,
                  age: generator.age(),
                  address: generator.address(),
                  link: [aux2Data],
                })
              )
            }

            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  title: {
                    name: "title",
                    type: FieldType.STRING,
                    constraints: { presence: true },
                  },
                  relWithNoSchema: {
                    name: "relWithNoSchema",
                    relationshipType: RelationshipType.ONE_TO_MANY,
                    type: FieldType.LINK,
                    tableId: auxTableId,
                    fieldName: "fk_relWithNoSchema",
                    constraints: { presence: true },
                  },
                  relWithEmptySchema: {
                    name: "relWithEmptySchema",
                    relationshipType: RelationshipType.ONE_TO_MANY,
                    type: FieldType.LINK,
                    tableId: auxTableId,
                    fieldName: "fk_relWithEmptySchema",
                    constraints: { presence: true },
                  },
                  relWithFullSchema: {
                    name: "relWithFullSchema",
                    relationshipType: RelationshipType.ONE_TO_MANY,
                    type: FieldType.LINK,
                    tableId: auxTableId,
                    fieldName: "fk_relWithFullSchema",
                    constraints: { presence: true },
                  },
                  relWithHalfSchema: {
                    name: "relWithHalfSchema",
                    relationshipType: RelationshipType.ONE_TO_MANY,
                    type: FieldType.LINK,
                    tableId: auxTableId,
                    fieldName: "fk_relWithHalfSchema",
                    constraints: { presence: true },
                  },
                  relWithIllegalSchema: {
                    name: "relWithIllegalSchema",
                    relationshipType: RelationshipType.ONE_TO_MANY,
                    type: FieldType.LINK,
                    tableId: auxTableId,
                    fieldName: "fk_relWithIllegalSchema",
                    constraints: { presence: true },
                  },
                },
              })
            )
            tableId = table._id!
            const view = await config.api.viewV2.create({
              name: generator.guid(),
              tableId,
              schema: {
                title: {
                  visible: true,
                },
                relWithNoSchema: {
                  visible: true,
                },
                relWithEmptySchema: {
                  visible: true,
                  columns: {},
                },
                relWithFullSchema: {
                  visible: true,
                  columns: Object.keys(auxTable.schema).reduce<
                    Record<string, RelationSchemaField>
                  >((acc, c) => ({ ...acc, [c]: { visible: true } }), {}),
                },
                relWithHalfSchema: {
                  visible: true,
                  columns: {
                    name: { visible: true },
                    age: { visible: false, readonly: true },
                  },
                },
                relWithIllegalSchema: {
                  visible: true,
                  columns: {
                    name: { visible: true },
                    address: { visible: true },
                    unexisting: { visible: true },
                  },
                },
              },
            })

            viewId = view.id
          })

          const testScenarios: [string, (row: Row) => Promise<Row> | Row][] = [
            ["get row", (row: Row) => config.api.row.get(viewId, row._id!)],
            [
              "from view search",
              async (row: Row) => {
                const { rows } = await config.api.viewV2.search(viewId)
                return rows.find(r => r._id === row._id!)
              },
            ],
            ["from original saved row", (row: Row) => row],
            [
              "from updated row",
              (row: Row) => config.api.row.save(viewId, row),
            ],
          ]

          it.each(testScenarios)(
            "can retrieve rows with populated relationships (via %s)",
            async (__, retrieveDelegate) => {
              const otherRows = _.sampleSize(auxData, 5)

              const row = await config.api.row.save(viewId, {
                title: generator.word(),
                relWithNoSchema: [otherRows[0]],
                relWithEmptySchema: [otherRows[1]],
                relWithFullSchema: [otherRows[2]],
                relWithHalfSchema: [otherRows[3]],
                relWithIllegalSchema: [otherRows[4]],
              })

              const retrieved = await retrieveDelegate(row)

              expect(retrieved).toEqual(
                expect.objectContaining({
                  title: row.title,
                  relWithNoSchema: [
                    {
                      _id: otherRows[0]._id,
                      primaryDisplay: otherRows[0].name,
                    },
                  ],
                  relWithEmptySchema: [
                    {
                      _id: otherRows[1]._id,
                      primaryDisplay: otherRows[1].name,
                    },
                  ],
                  relWithFullSchema: [
                    {
                      _id: otherRows[2]._id,
                      primaryDisplay: otherRows[2].name,
                      name: otherRows[2].name,
                      age: otherRows[2].age,
                      id: otherRows[2].id,
                    },
                  ],
                  relWithHalfSchema: [
                    {
                      _id: otherRows[3]._id,
                      primaryDisplay: otherRows[3].name,
                      name: otherRows[3].name,
                    },
                  ],
                  relWithIllegalSchema: [
                    {
                      _id: otherRows[4]._id,
                      primaryDisplay: otherRows[4].name,
                      name: otherRows[4].name,
                    },
                  ],
                })
              )
            }
          )

          it.each([
            [
              "from table fetch",
              async (row: Row) => {
                const rows = await config.api.row.fetch(tableId)
                return rows.find(r => r._id === row._id!)
              },
            ],
            [
              "from table search",
              async (row: Row) => {
                const { rows } = await config.api.row.search(tableId)
                return rows.find(r => r._id === row._id!)
              },
            ],
          ])(
            "does not enrich when fetching from the table (via %s)",
            async (__, retrieveDelegate) => {
              const otherRows = _.sampleSize(auxData, 5)

              const row = await config.api.row.save(viewId, {
                title: generator.word(),
                relWithNoSchema: [otherRows[0]],
                relWithEmptySchema: [otherRows[1]],
                relWithFullSchema: [otherRows[2]],
                relWithHalfSchema: [otherRows[3]],
                relWithIllegalSchema: [otherRows[4]],
              })

              const retrieved = await retrieveDelegate(row)

              expect(retrieved).toEqual(
                expect.objectContaining({
                  title: row.title,
                  relWithNoSchema: [
                    {
                      _id: otherRows[0]._id,
                      primaryDisplay: otherRows[0].name,
                    },
                  ],
                  relWithEmptySchema: [
                    {
                      _id: otherRows[1]._id,
                      primaryDisplay: otherRows[1].name,
                    },
                  ],
                  relWithFullSchema: [
                    {
                      _id: otherRows[2]._id,
                      primaryDisplay: otherRows[2].name,
                    },
                  ],
                  relWithHalfSchema: [
                    {
                      _id: otherRows[3]._id,
                      primaryDisplay: otherRows[3].name,
                    },
                  ],
                  relWithIllegalSchema: [
                    {
                      _id: otherRows[4]._id,
                      primaryDisplay: otherRows[4].name,
                    },
                  ],
                })
              )
            }
          )
        })

      isInternal &&
        describe("AI fields", () => {
          let table: Table
          let envCleanup: () => void

          beforeAll(async () => {
            mocks.licenses.useBudibaseAI()
            mocks.licenses.useAICustomConfigs()
            envCleanup = setEnv({
              OPENAI_API_KEY: "sk-abcdefghijklmnopqrstuvwxyz1234567890abcd",
            })

            mockChatGPTResponse("Mock LLM Response")

            table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  ai: {
                    name: "ai",
                    type: FieldType.AI,
                    operation: AIOperationEnum.PROMPT,
                    prompt: "Convert the following to German: '{{ product }}'",
                  },
                  product: {
                    name: "product",
                    type: FieldType.STRING,
                  },
                },
              })
            )

            await config.api.row.save(table._id!, {
              product: generator.word(),
            })
          })

          afterAll(() => {
            nock.cleanAll()
            envCleanup()
            mocks.licenses.useCloudFree()
          })

          it("should be able to save a row with an AI column", async () => {
            const { rows } = await config.api.row.search(table._id!)
            expect(rows.length).toBe(1)
            expect(rows[0].ai).toEqual("Mock LLM Response")
          })

          it("should be able to update a row with an AI column", async () => {
            const { rows } = await config.api.row.search(table._id!)
            expect(rows.length).toBe(1)
            await config.api.row.save(table._id!, {
              product: generator.word(),
              ...rows[0],
            })
            expect(rows.length).toBe(1)
            expect(rows[0].ai).toEqual("Mock LLM Response")
          })
        })

      describe("Formula fields", () => {
        let table: Table
        let otherTable: Table
        let relatedRow: Row, mainRow: Row

        beforeAll(async () => {
          otherTable = await config.api.table.save(defaultTable())
          table = await config.api.table.save(
            saveTableRequest({
              schema: {
                links: {
                  name: "links",
                  fieldName: "links",
                  type: FieldType.LINK,
                  tableId: otherTable._id!,
                  relationshipType: RelationshipType.ONE_TO_MANY,
                },
                formula: {
                  name: "formula",
                  type: FieldType.FORMULA,
                  formula: "{{ links.0.name }}",
                  formulaType: FormulaType.DYNAMIC,
                },
              },
            })
          )

          relatedRow = await config.api.row.save(otherTable._id!, {
            name: generator.word(),
            description: generator.paragraph(),
          })
          mainRow = await config.api.row.save(table._id!, {
            name: generator.word(),
            description: generator.paragraph(),
            tableId: table._id!,
            links: [relatedRow._id],
          })
        })

        async function updateFormulaColumn(
          formula: string,
          opts?: {
            responseType?: FormulaResponseType
            formulaType?: FormulaType
          }
        ) {
          table = await config.api.table.save({
            ...table,
            schema: {
              ...table.schema,
              formula: {
                name: "formula",
                type: FieldType.FORMULA,
                formula,
                responseType: opts?.responseType,
                formulaType: opts?.formulaType || FormulaType.DYNAMIC,
              },
            },
          })
        }

        it("should be able to search for rows containing formulas", async () => {
          const { rows } = await config.api.row.search(table._id!)
          expect(rows.length).toBe(1)
          expect(rows[0].links.length).toBe(1)
          const row = rows[0]
          expect(row.formula).toBe(relatedRow.name)
        })

        it("should coerce - number response type", async () => {
          await updateFormulaColumn(encodeJS("return 1"), {
            responseType: FieldType.NUMBER,
          })
          const { rows } = await config.api.row.search(table._id!)
          expect(rows[0].formula).toBe(1)
        })

        it("should coerce - boolean response type", async () => {
          await updateFormulaColumn(encodeJS("return true"), {
            responseType: FieldType.BOOLEAN,
          })
          const { rows } = await config.api.row.search(table._id!)
          expect(rows[0].formula).toBe(true)
        })

        it("should coerce - datetime response type", async () => {
          await updateFormulaColumn(encodeJS("return new Date()"), {
            responseType: FieldType.DATETIME,
          })
          const { rows } = await config.api.row.search(table._id!)
          expect(isDate(rows[0].formula)).toBe(true)
        })

        it("should coerce - datetime with invalid value", async () => {
          await updateFormulaColumn(encodeJS("return 'a'"), {
            responseType: FieldType.DATETIME,
          })
          const { rows } = await config.api.row.search(table._id!)
          expect(rows[0].formula).toBeUndefined()
        })

        it("should coerce handlebars", async () => {
          await updateFormulaColumn("{{ add 1 1 }}", {
            responseType: FieldType.NUMBER,
          })
          const { rows } = await config.api.row.search(table._id!)
          expect(rows[0].formula).toBe(2)
        })

        it("should coerce handlebars to string (default)", async () => {
          await updateFormulaColumn("{{ add 1 1 }}", {
            responseType: FieldType.STRING,
          })
          const { rows } = await config.api.row.search(table._id!)
          expect(rows[0].formula).toBe("2")
        })

        isInternal &&
          it("should coerce a static handlebars formula", async () => {
            await updateFormulaColumn(encodeJS("return 1"), {
              responseType: FieldType.NUMBER,
              formulaType: FormulaType.STATIC,
            })
            // save the row to store the static value
            await config.api.row.save(table._id!, mainRow)
            const { rows } = await config.api.row.search(table._id!)
            expect(rows[0].formula).toBe(1)
          })
      })

      describe("Formula JS protection", () => {
        it("should time out JS execution if a single cell takes too long", async () => {
          await withEnv({ JS_PER_INVOCATION_TIMEOUT_MS: 40 }, async () => {
            const js = encodeJS(
              `
              let i = 0;
              while (true) {
                i++;
              }
              return i;
            `
            )

            const table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  text: {
                    name: "text",
                    type: FieldType.STRING,
                  },
                  formula: {
                    name: "formula",
                    type: FieldType.FORMULA,
                    formula: js,
                    formulaType: FormulaType.DYNAMIC,
                  },
                },
              })
            )

            await config.api.row.save(table._id!, { text: "foo" })
            const { rows } = await config.api.row.search(table._id!)
            expect(rows).toHaveLength(1)
            const row = rows[0]
            expect(row.text).toBe("foo")
            expect(row.formula).toBe("Timed out while executing JS")
          })
        })

        it("should time out JS execution if a multiple cells take too long", async () => {
          await withEnv(
            {
              JS_PER_INVOCATION_TIMEOUT_MS: 40,
              JS_PER_REQUEST_TIMEOUT_MS: 80,
            },
            async () => {
              const js = encodeJS(
                `
              let i = 0;
              while (true) {
                i++;
              }
              return i;
            `
              )

              const table = await config.api.table.save(
                saveTableRequest({
                  schema: {
                    text: {
                      name: "text",
                      type: FieldType.STRING,
                    },
                    formula: {
                      name: "formula",
                      type: FieldType.FORMULA,
                      formula: js,
                      formulaType: FormulaType.DYNAMIC,
                    },
                  },
                })
              )

              for (let i = 0; i < 10; i++) {
                await config.api.row.save(table._id!, { text: "foo" })
              }

              // Run this test 3 times to make sure that there's no cross-request
              // pollution of the execution time tracking.
              for (let reqs = 0; reqs < 3; reqs++) {
                const { rows } = await config.api.row.search(table._id!)
                expect(rows).toHaveLength(10)

                let i = 0
                for (; i < 10; i++) {
                  const row = rows[i]
                  if (row.formula !== JsTimeoutError.message) {
                    break
                  }
                }

                // Given the execution times are not deterministic, we can't be sure
                // of the exact number of rows that were executed before the timeout
                // but it should absolutely be at least 1.
                expect(i).toBeGreaterThan(0)
                expect(i).toBeLessThan(5)

                for (; i < 10; i++) {
                  const row = rows[i]
                  expect(row.text).toBe("foo")
                  expect(row.formula).toStartWith("CPU time limit exceeded ")
                }
              }
            }
          )
        })

        it("should not carry over context between formulas", async () => {
          const js = encodeJS(`return $("[text]");`)
          const table = await config.api.table.save(
            saveTableRequest({
              schema: {
                text: {
                  name: "text",
                  type: FieldType.STRING,
                },
                formula: {
                  name: "formula",
                  type: FieldType.FORMULA,
                  formula: js,
                  formulaType: FormulaType.DYNAMIC,
                },
              },
            })
          )

          for (let i = 0; i < 10; i++) {
            await config.api.row.save(table._id!, { text: `foo${i}` })
          }

          const { rows } = await config.api.row.search(table._id!)
          expect(rows).toHaveLength(10)

          const formulaValues = rows.map(r => r.formula)
          expect(formulaValues).toEqual(
            expect.arrayContaining([
              "foo0",
              "foo1",
              "foo2",
              "foo3",
              "foo4",
              "foo5",
              "foo6",
              "foo7",
              "foo8",
              "foo9",
            ])
          )
        })
      })

      if (isInternal || isMSSQL) {
        describe("Fields with spaces", () => {
          let table: Table
          let otherTable: Table
          let relatedRow: Row

          beforeAll(async () => {
            otherTable = await config.api.table.save(defaultTable())
            table = await config.api.table.save(
              saveTableRequest({
                schema: {
                  links: {
                    name: "links",
                    fieldName: "links",
                    type: FieldType.LINK,
                    tableId: otherTable._id!,
                    relationshipType: RelationshipType.ONE_TO_MANY,
                  },
                  "nameWithSpace ": {
                    name: "nameWithSpace ",
                    type: FieldType.STRING,
                  },
                },
              })
            )
            relatedRow = await config.api.row.save(otherTable._id!, {
              name: generator.word(),
              description: generator.paragraph(),
            })
            await config.api.row.save(table._id!, {
              "nameWithSpace ": generator.word(),
              tableId: table._id!,
              links: [relatedRow._id],
            })
          })

          it("Successfully returns rows that have spaces in their field names", async () => {
            const { rows } = await config.api.row.search(table._id!)
            expect(rows.length).toBe(1)
            const row = rows[0]
            expect(row["nameWithSpace "]).toBeDefined()
          })
        })
      }

      if (!isInternal && !isOracle) {
        describe("bigint ids", () => {
          let table1: Table, table2: Table
          let table1Name: string, table2Name: string

          beforeAll(async () => {
            table1Name = `table1-${generator.guid().substring(0, 5)}`
            await client!.schema.createTable(table1Name, table => {
              table.bigInteger("table1Id").primary()
            })

            table2Name = `table2-${generator.guid().substring(0, 5)}`
            await client!.schema.createTable(table2Name, table => {
              table.bigInteger("table2Id").primary()
              table
                .bigInteger("table1Ref")
                .references("table1Id")
                .inTable(table1Name)
            })

            const resp = await config.api.datasource.fetchSchema({
              datasourceId: datasource!._id!,
            })

            const tables = Object.values(resp.datasource.entities || {})
            table1 = tables.find(t => t.name === table1Name)!
            table2 = tables.find(t => t.name === table2Name)!

            await config.api.datasource.addExistingRelationship({
              one: {
                tableId: table2._id!,
                relationshipName: "one",
                foreignKey: "table1Ref",
              },
              many: {
                tableId: table1._id!,
                relationshipName: "many",
                primaryKey: "table1Id",
              },
            })
          })

          it("should be able to fetch rows with related bigint ids", async () => {
            const row = await config.api.row.save(table1._id!, {
              table1Id: "1",
            })
            await config.api.row.save(table2._id!, {
              table2Id: "2",
              table1Ref: row.table1Id,
            })

            let resp = await config.api.row.search(table1._id!)
            expect(resp.rows).toHaveLength(1)
            expect(resp.rows[0]._id).toBe("%5B'1'%5D")
            expect(resp.rows[0].many).toHaveLength(1)
            expect(resp.rows[0].many[0]._id).toBe("%5B'2'%5D")

            resp = await config.api.row.search(table2._id!)
            expect(resp.rows).toHaveLength(1)
            expect(resp.rows[0]._id).toBe("%5B'2'%5D")
            expect(resp.rows[0].one).toHaveLength(1)
            expect(resp.rows[0].one[0]._id).toBe("%5B'1'%5D")
          })
        })
      }
    }
  )
}
