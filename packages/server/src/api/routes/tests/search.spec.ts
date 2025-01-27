import { tableForDatasource } from "../../../tests/utilities/structures"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import {
  context,
  db as dbCore,
  docIds,
  MAX_VALID_DATE,
  MIN_VALID_DATE,
  SQLITE_DESIGN_DOC_ID,
  utils,
  withEnv as withCoreEnv,
} from "@budibase/backend-core"

import {
  AIOperationEnum,
  AutoFieldSubType,
  BBReferenceFieldSubType,
  Datasource,
  EmptyFilterOption,
  FieldType,
  JsonFieldSubType,
  LogicalOperator,
  RelationshipType,
  RequiredKeys,
  Row,
  RowSearchParams,
  SearchFilters,
  SearchResponse,
  SearchRowRequest,
  SortOrder,
  SortType,
  Table,
  TableSchema,
  User,
  ViewV2Schema,
} from "@budibase/types"
import _ from "lodash"
import tk from "timekeeper"
import { encodeJSBinding } from "@budibase/string-templates"
import { dataFilters } from "@budibase/shared-core"
import { Knex } from "knex"
import { generator, structures, mocks } from "@budibase/backend-core/tests"
import { DEFAULT_EMPLOYEE_TABLE_SCHEMA } from "../../../db/defaultData/datasource_bb_default"
import { generateRowIdField } from "../../../integrations/utils"
import { cloneDeep } from "lodash/fp"

jest.mock("@budibase/pro", () => ({
  ...jest.requireActual("@budibase/pro"),
  ai: {
    LargeLanguageModel: {
      forCurrentTenant: async () => ({
        llm: {},
        run: jest.fn(() => `Mock LLM Response`),
        buildPromptFromAIOperation: jest.fn(),
      }),
    },
  },
}))

const descriptions = datasourceDescribe({ exclude: [DatabaseName.MONGODB] })

if (descriptions.length) {
  describe.each(descriptions)(
    "search ($dbName)",
    ({ config, dsProvider, isInternal, isOracle, isSql }) => {
      let datasource: Datasource | undefined
      let client: Knex | undefined
      let tableOrViewId: string
      let rows: Row[]

      async function basicRelationshipTables(
        type: RelationshipType,
        opts?: {
          tableName?: string
          primaryColumn?: string
          otherColumn?: string
        }
      ) {
        const relatedTable = await createTable({
          name: { name: opts?.tableName || "name", type: FieldType.STRING },
        })

        const columnName = opts?.primaryColumn || "productCat"
        //@ts-ignore - API accepts this structure, will build out rest of definition
        const tableId = await createTable({
          name: { name: opts?.tableName || "name", type: FieldType.STRING },
          [columnName]: {
            type: FieldType.LINK,
            relationshipType: type,
            name: columnName,
            fieldName: opts?.otherColumn || "product",
            tableId: relatedTable,
            constraints: {
              type: "array",
            },
          },
        })
        return {
          relatedTable: await config.api.table.get(relatedTable),
          tableId,
        }
      }

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource
        client = ds.client

        config.app = await config.api.application.update(config.getAppId(), {
          snippets: [
            {
              name: "WeeksAgo",
              code: `
              return function (weeks) {
                const currentTime = new Date(${Date.now()});
                currentTime.setDate(currentTime.getDate()-(7 * (weeks || 1)));
                return currentTime.toISOString();
              }
            `,
            },
          ],
        })
      })

      async function createTable(schema?: TableSchema) {
        const table = await config.api.table.save(
          tableForDatasource(datasource, { schema })
        )
        return table._id!
      }

      async function createView(tableId: string, schema?: ViewV2Schema) {
        const view = await config.api.viewV2.create({
          tableId: tableId,
          name: generator.guid(),
          schema,
        })
        return view.id
      }

      async function createRows(arr: Record<string, any>[]) {
        // Shuffling to avoid false positives given a fixed order
        for (const row of _.shuffle(arr)) {
          await config.api.row.save(tableOrViewId, row)
        }
        rows = await config.api.row.fetch(tableOrViewId)
      }

      async function getTable(tableOrViewId: string): Promise<Table> {
        if (docIds.isViewId(tableOrViewId)) {
          const view = await config.api.viewV2.get(tableOrViewId)
          return await config.api.table.get(view.tableId)
        } else {
          return await config.api.table.get(tableOrViewId)
        }
      }

      async function assertTableExists(nameOrTable: string | Table) {
        const name =
          typeof nameOrTable === "string" ? nameOrTable : nameOrTable.name
        expect(await client!.schema.hasTable(name)).toBeTrue()
      }

      async function assertTableNumRows(
        nameOrTable: string | Table,
        numRows: number
      ) {
        const name =
          typeof nameOrTable === "string" ? nameOrTable : nameOrTable.name
        const row = await client!.from(name).count()
        const count = parseInt(Object.values(row[0])[0] as string)
        expect(count).toEqual(numRows)
      }

      describe.each([true, false])("in-memory: %s", isInMemory => {
        // We only run the in-memory tests during the SQS (isInternal) run
        if (isInMemory && !isInternal) {
          return
        }

        type CreateFn = (schema?: TableSchema) => Promise<string>
        let tableOrView: [string, CreateFn][] = [["table", createTable]]

        if (!isInMemory) {
          tableOrView.push([
            "view",
            async (schema?: TableSchema) => {
              const tableId = await createTable(schema)
              const viewId = await createView(
                tableId,
                Object.keys(schema || {}).reduce<ViewV2Schema>(
                  (viewSchema, fieldName) => {
                    const field = schema![fieldName]
                    viewSchema[fieldName] = {
                      visible: field.visible ?? true,
                      readonly: false,
                    }
                    return viewSchema
                  },
                  {}
                )
              )
              return viewId
            },
          ])
        }

        describe.each(tableOrView)(
          "from %s",
          (sourceType, createTableOrView) => {
            const isView = sourceType === "view"

            class SearchAssertion {
              constructor(private readonly query: SearchRowRequest) {}

              private async performSearch(): Promise<SearchResponse<Row>> {
                if (isInMemory) {
                  const inMemoryQuery: RequiredKeys<
                    Omit<RowSearchParams, "tableId">
                  > = {
                    sort: this.query.sort ?? undefined,
                    query: { ...this.query.query },
                    paginate: this.query.paginate,
                    bookmark: this.query.bookmark ?? undefined,
                    limit: this.query.limit,
                    sortOrder: this.query.sortOrder,
                    sortType: this.query.sortType ?? undefined,
                    version: this.query.version,
                    disableEscaping: this.query.disableEscaping,
                    countRows: this.query.countRows,
                    viewId: undefined,
                    fields: undefined,
                    indexer: undefined,
                    rows: undefined,
                  }
                  return dataFilters.search(_.cloneDeep(rows), inMemoryQuery)
                } else {
                  return config.api.row.search(tableOrViewId, this.query)
                }
              }

              // We originally used _.isMatch to compare rows, but found that when
              // comparing arrays it would return true if the source array was a subset of
              // the target array. This would sometimes create false matches. This
              // function is a more strict version of _.isMatch that only returns true if
              // the source array is an exact match of the target.
              //
              // _.isMatch("100", "1") also returns true which is not what we want.
              private isMatch<T extends Record<string, any>>(
                expected: T,
                found: T
              ) {
                if (!expected) {
                  throw new Error("Expected is undefined")
                }
                if (!found) {
                  return false
                }

                for (const key of Object.keys(expected)) {
                  if (Array.isArray(expected[key])) {
                    if (!Array.isArray(found[key])) {
                      return false
                    }
                    if (expected[key].length !== found[key].length) {
                      return false
                    }
                    if (!_.isMatch(found[key], expected[key])) {
                      return false
                    }
                  } else if (typeof expected[key] === "object") {
                    if (!this.isMatch(expected[key], found[key])) {
                      return false
                    }
                  } else {
                    if (expected[key] !== found[key]) {
                      return false
                    }
                  }
                }
                return true
              }

              // This function exists to ensure that the same row is not matched twice.
              // When a row gets matched, we make sure to remove it from the list of rows
              // we're matching against.
              private popRow<T extends { [key: string]: any }>(
                expectedRow: T,
                foundRows: T[]
              ): NonNullable<T> {
                const row = foundRows.find(row =>
                  this.isMatch(expectedRow, row)
                )
                if (!row) {
                  const fields = Object.keys(expectedRow)
                  // To make the error message more readable, we only include the fields
                  // that are present in the expected row.
                  const searchedObjects = foundRows.map(row =>
                    _.pick(row, fields)
                  )
                  throw new Error(
                    `Failed to find row:\n\n${JSON.stringify(
                      expectedRow,
                      null,
                      2
                    )}\n\nin\n\n${JSON.stringify(searchedObjects, null, 2)}`
                  )
                }

                foundRows.splice(foundRows.indexOf(row), 1)
                return row
              }

              // Asserts that the query returns rows matching exactly the set of rows
              // passed in. The order of the rows matters. Rows returned in an order
              // different to the one passed in will cause the assertion to fail.  Extra
              // rows returned by the query will also cause the assertion to fail.
              async toMatchExactly(expectedRows: any[]) {
                const response = await this.performSearch()
                const cloned = cloneDeep(response)
                const foundRows = response.rows

                expect(foundRows).toHaveLength(expectedRows.length)
                expect([...foundRows]).toEqual(
                  expectedRows.map((expectedRow: any) =>
                    expect.objectContaining(this.popRow(expectedRow, foundRows))
                  )
                )
                return cloned
              }

              // Asserts that the query returns rows matching exactly the set of rows
              // passed in. The order of the rows is not important, but extra rows will
              // cause the assertion to fail.
              async toContainExactly(expectedRows: any[]) {
                const response = await this.performSearch()
                const cloned = cloneDeep(response)
                const foundRows = response.rows

                expect(foundRows).toHaveLength(expectedRows.length)
                expect([...foundRows]).toEqual(
                  expect.arrayContaining(
                    expectedRows.map((expectedRow: any) =>
                      expect.objectContaining(
                        this.popRow(expectedRow, foundRows)
                      )
                    )
                  )
                )
                return cloned
              }

              // Asserts that the query returns some property values - this cannot be used
              // to check row values, however this shouldn't be important for checking properties
              // typing for this has to be any, Jest doesn't expose types for matchers like expect.any(...)
              async toMatch(properties: Record<string, any>) {
                const response = await this.performSearch()
                const cloned = cloneDeep(response)
                const keys = Object.keys(properties) as Array<
                  keyof SearchResponse<Row>
                >
                for (let key of keys) {
                  expect(response[key]).toBeDefined()
                  if (properties[key]) {
                    expect(response[key]).toEqual(properties[key])
                  }
                }
                return cloned
              }

              // Asserts that the query doesn't return a property, e.g. pagination parameters.
              async toNotHaveProperty(
                properties: (keyof SearchResponse<Row>)[]
              ) {
                const response = await this.performSearch()
                const cloned = cloneDeep(response)
                for (let property of properties) {
                  expect(response[property]).toBeUndefined()
                }
                return cloned
              }

              // Asserts that the query returns rows matching the set of rows passed in.
              // The order of the rows is not important. Extra rows will not cause the
              // assertion to fail.
              async toContain(expectedRows: any[]) {
                const response = await this.performSearch()
                const cloned = cloneDeep(response)
                const foundRows = response.rows

                expect([...foundRows]).toEqual(
                  expect.arrayContaining(
                    expectedRows.map((expectedRow: any) =>
                      expect.objectContaining(
                        this.popRow(expectedRow, foundRows)
                      )
                    )
                  )
                )
                return cloned
              }

              async toFindNothing() {
                await this.toContainExactly([])
              }

              async toHaveLength(length: number) {
                const { rows: foundRows } = await this.performSearch()

                expect(foundRows).toHaveLength(length)
              }
            }

            function expectSearch(query: SearchRowRequest) {
              return new SearchAssertion(query)
            }

            function expectQuery(query: SearchFilters) {
              return expectSearch({ query })
            }

            describe("boolean", () => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  isTrue: { name: "isTrue", type: FieldType.BOOLEAN },
                })
                await createRows([{ isTrue: true }, { isTrue: false }])
              })

              describe("equal", () => {
                it("successfully finds true row", async () => {
                  await expectQuery({ equal: { isTrue: true } }).toMatchExactly(
                    [{ isTrue: true }]
                  )
                })

                it("successfully finds false row", async () => {
                  await expectQuery({
                    equal: { isTrue: false },
                  }).toMatchExactly([{ isTrue: false }])
                })
              })

              describe("notEqual", () => {
                it("successfully finds false row", async () => {
                  await expectQuery({
                    notEqual: { isTrue: true },
                  }).toContainExactly([{ isTrue: false }])
                })

                it("successfully finds true row", async () => {
                  await expectQuery({
                    notEqual: { isTrue: false },
                  }).toContainExactly([{ isTrue: true }])
                })
              })

              describe("oneOf", () => {
                it("successfully finds true row", async () => {
                  await expectQuery({
                    oneOf: { isTrue: [true] },
                  }).toContainExactly([{ isTrue: true }])
                })

                it("successfully finds false row", async () => {
                  await expectQuery({
                    oneOf: { isTrue: [false] },
                  }).toContainExactly([{ isTrue: false }])
                })
              })

              describe("sort", () => {
                it("sorts ascending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "isTrue",
                    sortOrder: SortOrder.ASCENDING,
                  }).toMatchExactly([{ isTrue: false }, { isTrue: true }])
                })

                it("sorts descending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "isTrue",
                    sortOrder: SortOrder.DESCENDING,
                  }).toMatchExactly([{ isTrue: true }, { isTrue: false }])
                })
              })
            })

            !isInMemory &&
              describe("bindings", () => {
                let globalUsers: any = []

                const serverTime = new Date()

                // In MariaDB and MySQL we only store dates to second precision, so we need
                // to remove milliseconds from the server time to ensure searches work as
                // expected.
                serverTime.setMilliseconds(0)

                const future = new Date(
                  serverTime.getTime() + 1000 * 60 * 60 * 24 * 30
                )

                const rows = (currentUser: User) => {
                  return [
                    { name: "foo", appointment: "1982-01-05T00:00:00.000Z" },
                    { name: "bar", appointment: "1995-05-06T00:00:00.000Z" },
                    {
                      name: currentUser.firstName,
                      appointment: future.toISOString(),
                    },
                    {
                      name: "serverDate",
                      appointment: serverTime.toISOString(),
                    },
                    {
                      name: "single user, session user",
                      single_user: currentUser,
                    },
                    {
                      name: "single user",
                      single_user: globalUsers[0],
                    },
                    {
                      name: "deprecated single user, session user",
                      deprecated_single_user: [currentUser],
                    },
                    {
                      name: "deprecated single user",
                      deprecated_single_user: [globalUsers[0]],
                    },
                    {
                      name: "multi user",
                      multi_user: globalUsers,
                    },
                    {
                      name: "multi user with session user",
                      multi_user: [...globalUsers, currentUser],
                    },
                    {
                      name: "deprecated multi user",
                      deprecated_multi_user: globalUsers,
                    },
                    {
                      name: "deprecated multi user with session user",
                      deprecated_multi_user: [...globalUsers, currentUser],
                    },
                  ]
                }

                beforeAll(async () => {
                  // Set up some global users
                  globalUsers = await Promise.all(
                    Array(2)
                      .fill(0)
                      .map(async () => {
                        const globalUser = await config.globalUser()
                        const userMedataId = globalUser._id
                          ? dbCore.generateUserMetadataID(globalUser._id)
                          : null
                        return {
                          _id: globalUser._id,
                          _meta: userMedataId,
                        }
                      })
                  )

                  tableOrViewId = await createTableOrView({
                    name: { name: "name", type: FieldType.STRING },
                    appointment: {
                      name: "appointment",
                      type: FieldType.DATETIME,
                    },
                    single_user: {
                      name: "single_user",
                      type: FieldType.BB_REFERENCE_SINGLE,
                      subtype: BBReferenceFieldSubType.USER,
                    },
                    deprecated_single_user: {
                      name: "deprecated_single_user",
                      type: FieldType.BB_REFERENCE,
                      subtype: BBReferenceFieldSubType.USER,
                    },
                    multi_user: {
                      name: "multi_user",
                      type: FieldType.BB_REFERENCE,
                      subtype: BBReferenceFieldSubType.USER,
                      constraints: {
                        type: "array",
                      },
                    },
                    deprecated_multi_user: {
                      name: "deprecated_multi_user",
                      type: FieldType.BB_REFERENCE,
                      subtype: BBReferenceFieldSubType.USERS,
                      constraints: {
                        type: "array",
                      },
                    },
                  })
                  await createRows(rows(config.getUser()))
                })

                // !! Current User is auto generated per run
                it("should return all rows matching the session user firstname", async () => {
                  await expectQuery({
                    equal: { name: "{{ [user].firstName }}" },
                  }).toContainExactly([
                    {
                      name: config.getUser().firstName,
                      appointment: future.toISOString(),
                    },
                  ])
                })

                it("should return all rows matching the session user firstname when logical operator used", async () => {
                  await expectQuery({
                    $and: {
                      conditions: [
                        { equal: { name: "{{ [user].firstName }}" } },
                      ],
                    },
                  }).toContainExactly([
                    {
                      name: config.getUser().firstName,
                      appointment: future.toISOString(),
                    },
                  ])
                })

                it("should parse the date binding and return all rows after the resolved value", async () => {
                  await tk.withFreeze(serverTime, async () => {
                    await expectQuery({
                      range: {
                        appointment: {
                          low: "{{ [now] }}",
                          high: "9999-00-00T00:00:00.000Z",
                        },
                      },
                    }).toContainExactly([
                      {
                        name: config.getUser().firstName,
                        appointment: future.toISOString(),
                      },
                      {
                        name: "serverDate",
                        appointment: serverTime.toISOString(),
                      },
                    ])
                  })
                })

                it("should parse the date binding and return all rows before the resolved value", async () => {
                  await expectQuery({
                    range: {
                      appointment: {
                        low: "0000-00-00T00:00:00.000Z",
                        high: "{{ [now] }}",
                      },
                    },
                  }).toContainExactly([
                    { name: "foo", appointment: "1982-01-05T00:00:00.000Z" },
                    { name: "bar", appointment: "1995-05-06T00:00:00.000Z" },
                    {
                      name: "serverDate",
                      appointment: serverTime.toISOString(),
                    },
                  ])
                })

                it("should parse the encoded js snippet. Return rows with appointments up to 1 week in the past", async () => {
                  const jsBinding = "return snippets.WeeksAgo();"
                  const encodedBinding = encodeJSBinding(jsBinding)

                  await expectQuery({
                    range: {
                      appointment: {
                        low: "0000-00-00T00:00:00.000Z",
                        high: encodedBinding,
                      },
                    },
                  }).toContainExactly([
                    { name: "foo", appointment: "1982-01-05T00:00:00.000Z" },
                    { name: "bar", appointment: "1995-05-06T00:00:00.000Z" },
                  ])
                })

                it("should parse the encoded js binding. Return rows with appointments 2 weeks in the past", async () => {
                  const jsBinding = `const currentTime = new Date(${Date.now()})\ncurrentTime.setDate(currentTime.getDate()-14);\nreturn currentTime.toISOString();`
                  const encodedBinding = encodeJSBinding(jsBinding)

                  await expectQuery({
                    range: {
                      appointment: {
                        low: "0000-00-00T00:00:00.000Z",
                        high: encodedBinding,
                      },
                    },
                  }).toContainExactly([
                    { name: "foo", appointment: "1982-01-05T00:00:00.000Z" },
                    { name: "bar", appointment: "1995-05-06T00:00:00.000Z" },
                  ])
                })

                it("should match a single user row by the session user id", async () => {
                  await expectQuery({
                    equal: { single_user: "{{ [user]._id }}" },
                  }).toContainExactly([
                    {
                      name: "single user, session user",
                      single_user: { _id: config.getUser()._id },
                    },
                  ])
                })

                it("should match a deprecated single user row by the session user id", async () => {
                  await expectQuery({
                    equal: { deprecated_single_user: "{{ [user]._id }}" },
                  }).toContainExactly([
                    {
                      name: "deprecated single user, session user",
                      deprecated_single_user: [{ _id: config.getUser()._id }],
                    },
                  ])
                })

                it("should match the session user id in a multi user field", async () => {
                  const allUsers = [...globalUsers, config.getUser()].map(
                    (user: any) => {
                      return { _id: user._id }
                    }
                  )

                  await expectQuery({
                    contains: { multi_user: ["{{ [user]._id }}"] },
                  }).toContainExactly([
                    {
                      name: "multi user with session user",
                      multi_user: allUsers,
                    },
                  ])
                })

                it("should match the session user id in a deprecated multi user field", async () => {
                  const allUsers = [...globalUsers, config.getUser()].map(
                    (user: any) => {
                      return { _id: user._id }
                    }
                  )

                  await expectQuery({
                    contains: { deprecated_multi_user: ["{{ [user]._id }}"] },
                  }).toContainExactly([
                    {
                      name: "deprecated multi user with session user",
                      deprecated_multi_user: allUsers,
                    },
                  ])
                })

                it("should not match the session user id in a multi user field", async () => {
                  await expectQuery({
                    notContains: { multi_user: ["{{ [user]._id }}"] },
                    notEmpty: { multi_user: true },
                  }).toContainExactly([
                    {
                      name: "multi user",
                      multi_user: globalUsers.map((user: any) => {
                        return { _id: user._id }
                      }),
                    },
                  ])
                })

                it("should not match the session user id in a deprecated multi user field", async () => {
                  await expectQuery({
                    notContains: {
                      deprecated_multi_user: ["{{ [user]._id }}"],
                    },
                    notEmpty: { deprecated_multi_user: true },
                  }).toContainExactly([
                    {
                      name: "deprecated multi user",
                      deprecated_multi_user: globalUsers.map((user: any) => {
                        return { _id: user._id }
                      }),
                    },
                  ])
                })

                it("should match the session user id and a user table row id using helpers, user binding and a static user id.", async () => {
                  await expectQuery({
                    oneOf: {
                      single_user: [
                        "{{ default [user]._id '_empty_' }}",
                        globalUsers[0]._id,
                      ],
                    },
                  }).toContainExactly([
                    {
                      name: "single user, session user",
                      single_user: { _id: config.getUser()._id },
                    },
                    {
                      name: "single user",
                      single_user: { _id: globalUsers[0]._id },
                    },
                  ])
                })

                it("should match the session user id and a user table row id using helpers, user binding and a static user id. (deprecated single user)", async () => {
                  await expectQuery({
                    oneOf: {
                      deprecated_single_user: [
                        "{{ default [user]._id '_empty_' }}",
                        globalUsers[0]._id,
                      ],
                    },
                  }).toContainExactly([
                    {
                      name: "deprecated single user, session user",
                      deprecated_single_user: [{ _id: config.getUser()._id }],
                    },
                    {
                      name: "deprecated single user",
                      deprecated_single_user: [{ _id: globalUsers[0]._id }],
                    },
                  ])
                })

                it("should resolve 'default' helper to '_empty_' when binding resolves to nothing", async () => {
                  await expectQuery({
                    oneOf: {
                      single_user: [
                        "{{ default [user]._idx '_empty_' }}",
                        globalUsers[0]._id,
                      ],
                    },
                  }).toContainExactly([
                    {
                      name: "single user",
                      single_user: { _id: globalUsers[0]._id },
                    },
                  ])
                })

                it("should resolve 'default' helper to '_empty_' when binding resolves to nothing (deprecated single user)", async () => {
                  await expectQuery({
                    oneOf: {
                      deprecated_single_user: [
                        "{{ default [user]._idx '_empty_' }}",
                        globalUsers[0]._id,
                      ],
                    },
                  }).toContainExactly([
                    {
                      name: "deprecated single user",
                      deprecated_single_user: [{ _id: globalUsers[0]._id }],
                    },
                  ])
                })
              })

            const stringTypes = [FieldType.STRING, FieldType.LONGFORM] as const
            describe.each(stringTypes)("%s", type => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  name: { name: "name", type },
                })
                await createRows([{ name: "foo" }, { name: "bar" }])
              })

              describe("misc", () => {
                it("should return all if no query is passed", async () => {
                  await expectSearch({} as RowSearchParams).toContainExactly([
                    { name: "foo" },
                    { name: "bar" },
                  ])
                })

                it("should return all if empty query is passed", async () => {
                  await expectQuery({}).toContainExactly([
                    { name: "foo" },
                    { name: "bar" },
                  ])
                })

                it("should return all if onEmptyFilter is RETURN_ALL", async () => {
                  await expectQuery({
                    onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })

                // onEmptyFilter cannot be sent to view searches
                !isView &&
                  it("should return nothing if onEmptyFilter is RETURN_NONE", async () => {
                    await expectQuery({
                      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
                    }).toFindNothing()
                  })

                it("should respect limit", async () => {
                  await expectSearch({
                    limit: 1,
                    paginate: true,
                    query: {},
                  }).toHaveLength(1)
                })
              })

              describe("equal", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    equal: { name: "foo" },
                  }).toContainExactly([{ name: "foo" }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ equal: { name: "none" } }).toFindNothing()
                })

                it("works as an or condition", async () => {
                  await expectQuery({
                    allOr: true,
                    equal: { name: "foo" },
                    oneOf: { name: ["bar"] },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })

                it("can have multiple values for same column", async () => {
                  await expectQuery({
                    allOr: true,
                    equal: { "1:name": "foo", "2:name": "bar" },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })
              })

              describe("notEqual", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    notEqual: { name: "foo" },
                  }).toContainExactly([{ name: "bar" }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    notEqual: { name: "bar" },
                  }).toContainExactly([{ name: "foo" }])
                })
              })

              describe("oneOf", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    oneOf: { name: ["foo"] },
                  }).toContainExactly([{ name: "foo" }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    oneOf: { name: ["none"] },
                  }).toFindNothing()
                })

                it("can have multiple values for same column", async () => {
                  await expectQuery({
                    oneOf: {
                      name: ["foo", "bar"],
                    },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })

                it("splits comma separated strings", async () => {
                  await expectQuery({
                    oneOf: {
                      // @ts-ignore
                      name: "foo,bar",
                    },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })

                it("trims whitespace", async () => {
                  await expectQuery({
                    oneOf: {
                      // @ts-ignore
                      name: "foo, bar",
                    },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })

                it("empty arrays returns all when onEmptyFilter is set to return 'all'", async () => {
                  await expectQuery({
                    onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                    oneOf: { name: [] },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })

                // onEmptyFilter cannot be sent to view searches
                !isView &&
                  it("empty arrays returns all when onEmptyFilter is set to return 'none'", async () => {
                    await expectQuery({
                      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
                      oneOf: { name: [] },
                    }).toContainExactly([])
                  })
              })

              describe("fuzzy", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({ fuzzy: { name: "oo" } }).toContainExactly(
                    [{ name: "foo" }]
                  )
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ fuzzy: { name: "none" } }).toFindNothing()
                })
              })

              describe("string", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    string: { name: "fo" },
                  }).toContainExactly([{ name: "foo" }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    string: { name: "none" },
                  }).toFindNothing()
                })

                it("is case-insensitive", async () => {
                  await expectQuery({
                    string: { name: "FO" },
                  }).toContainExactly([{ name: "foo" }])
                })
              })

              describe("range", () => {
                it("successfully finds multiple rows", async () => {
                  await expectQuery({
                    range: { name: { low: "a", high: "z" } },
                  }).toContainExactly([{ name: "bar" }, { name: "foo" }])
                })

                it("successfully finds a row with a high bound", async () => {
                  await expectQuery({
                    range: { name: { low: "a", high: "c" } },
                  }).toContainExactly([{ name: "bar" }])
                })

                it("successfully finds a row with a low bound", async () => {
                  await expectQuery({
                    range: { name: { low: "f", high: "z" } },
                  }).toContainExactly([{ name: "foo" }])
                })

                it("successfully finds no rows", async () => {
                  await expectQuery({
                    range: { name: { low: "g", high: "h" } },
                  }).toFindNothing()
                })

                it("ignores low if it's an empty object", async () => {
                  await expectQuery({
                    // @ts-ignore
                    range: { name: { low: {}, high: "z" } },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })

                it("ignores high if it's an empty object", async () => {
                  await expectQuery({
                    // @ts-ignore
                    range: { name: { low: "a", high: {} } },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })
              })

              describe("empty", () => {
                it("finds no empty rows", async () => {
                  await expectQuery({ empty: { name: null } }).toFindNothing()
                })

                it("should not be affected by when filter empty behaviour", async () => {
                  await expectQuery({
                    empty: { name: null },
                    onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                  }).toFindNothing()
                })
              })

              describe("notEmpty", () => {
                it("finds all non-empty rows", async () => {
                  await expectQuery({
                    notEmpty: { name: null },
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })

                it("should not be affected by when filter empty behaviour", async () => {
                  await expectQuery({
                    notEmpty: { name: null },
                    onEmptyFilter: EmptyFilterOption.RETURN_NONE,
                  }).toContainExactly([{ name: "foo" }, { name: "bar" }])
                })
              })

              describe("sort", () => {
                it("sorts ascending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "name",
                    sortOrder: SortOrder.ASCENDING,
                  }).toMatchExactly([{ name: "bar" }, { name: "foo" }])
                })

                it("sorts descending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "name",
                    sortOrder: SortOrder.DESCENDING,
                  }).toMatchExactly([{ name: "foo" }, { name: "bar" }])
                })

                describe("sortType STRING", () => {
                  it("sorts ascending", async () => {
                    await expectSearch({
                      query: {},
                      sort: "name",
                      sortType: SortType.STRING,
                      sortOrder: SortOrder.ASCENDING,
                    }).toMatchExactly([{ name: "bar" }, { name: "foo" }])
                  })

                  it("sorts descending", async () => {
                    await expectSearch({
                      query: {},
                      sort: "name",
                      sortType: SortType.STRING,
                      sortOrder: SortOrder.DESCENDING,
                    }).toMatchExactly([{ name: "foo" }, { name: "bar" }])
                  })
                })

                !isInternal &&
                  !isInMemory &&
                  // This test was added because we automatically add in a sort by the
                  // primary key, and we used to do this unconditionally which caused
                  // problems because it was possible for the primary key to appear twice
                  // in the resulting SQL ORDER BY clause, resulting in an SQL error.
                  // We now check first to make sure that the primary key isn't already
                  // in the sort before adding it.
                  describe("sort on primary key", () => {
                    beforeAll(async () => {
                      const tableName = structures.uuid().substring(0, 10)
                      await client!.schema.createTable(tableName, t => {
                        t.string("name").primary()
                      })
                      const resp = await config.api.datasource.fetchSchema({
                        datasourceId: datasource!._id!,
                      })

                      tableOrViewId = resp.datasource.entities![tableName]._id!

                      await createRows([{ name: "foo" }, { name: "bar" }])
                    })

                    it("should be able to sort by a primary key column ascending", async () =>
                      expectSearch({
                        query: {},
                        sort: "name",
                        sortOrder: SortOrder.ASCENDING,
                      }).toMatchExactly([{ name: "bar" }, { name: "foo" }]))

                    it("should be able to sort by a primary key column descending", async () =>
                      expectSearch({
                        query: {},
                        sort: "name",
                        sortOrder: SortOrder.DESCENDING,
                      }).toMatchExactly([{ name: "foo" }, { name: "bar" }]))
                  })
              })
            })

            describe("numbers", () => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  age: { name: "age", type: FieldType.NUMBER },
                })
                await createRows([{ age: 1 }, { age: 10 }])
              })

              describe("equal", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({ equal: { age: 1 } }).toContainExactly([
                    { age: 1 },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ equal: { age: 2 } }).toFindNothing()
                })
              })

              describe("notEqual", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({ notEqual: { age: 1 } }).toContainExactly([
                    { age: 10 },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ notEqual: { age: 10 } }).toContainExactly(
                    [{ age: 1 }]
                  )
                })
              })

              describe("oneOf", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({ oneOf: { age: [1] } }).toContainExactly([
                    { age: 1 },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ oneOf: { age: [2] } }).toFindNothing()
                })

                it("can convert from a string", async () => {
                  await expectQuery({
                    oneOf: {
                      // @ts-ignore
                      age: "1",
                    },
                  }).toContainExactly([{ age: 1 }])
                })

                it("can find multiple values for same column", async () => {
                  await expectQuery({
                    oneOf: {
                      // @ts-ignore
                      age: "1,10",
                    },
                  }).toContainExactly([{ age: 1 }, { age: 10 }])
                })
              })

              describe("range", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    range: { age: { low: 1, high: 5 } },
                  }).toContainExactly([{ age: 1 }])
                })

                it("successfully finds multiple rows", async () => {
                  await expectQuery({
                    range: { age: { low: 1, high: 10 } },
                  }).toContainExactly([{ age: 1 }, { age: 10 }])
                })

                it("successfully finds a row with a high bound", async () => {
                  await expectQuery({
                    range: { age: { low: 5, high: 10 } },
                  }).toContainExactly([{ age: 10 }])
                })

                it("successfully finds no rows", async () => {
                  await expectQuery({
                    range: { age: { low: 5, high: 9 } },
                  }).toFindNothing()
                })

                it("greater than equal to", async () => {
                  await expectQuery({
                    range: {
                      age: { low: 10, high: Number.MAX_SAFE_INTEGER },
                    },
                  }).toContainExactly([{ age: 10 }])
                })

                it("greater than", async () => {
                  await expectQuery({
                    range: {
                      age: { low: 5, high: Number.MAX_SAFE_INTEGER },
                    },
                  }).toContainExactly([{ age: 10 }])
                })

                it("less than equal to", async () => {
                  await expectQuery({
                    range: {
                      age: { high: 1, low: Number.MIN_SAFE_INTEGER },
                    },
                  }).toContainExactly([{ age: 1 }])
                })

                it("less than", async () => {
                  await expectQuery({
                    range: {
                      age: { high: 5, low: Number.MIN_SAFE_INTEGER },
                    },
                  }).toContainExactly([{ age: 1 }])
                })
              })

              describe("sort", () => {
                it("sorts ascending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "age",
                    sortOrder: SortOrder.ASCENDING,
                  }).toMatchExactly([{ age: 1 }, { age: 10 }])
                })

                it("sorts descending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "age",
                    sortOrder: SortOrder.DESCENDING,
                  }).toMatchExactly([{ age: 10 }, { age: 1 }])
                })
              })

              describe("sortType NUMBER", () => {
                it("sorts ascending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "age",
                    sortType: SortType.NUMBER,
                    sortOrder: SortOrder.ASCENDING,
                  }).toMatchExactly([{ age: 1 }, { age: 10 }])
                })

                it("sorts descending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "age",
                    sortType: SortType.NUMBER,
                    sortOrder: SortOrder.DESCENDING,
                  }).toMatchExactly([{ age: 10 }, { age: 1 }])
                })
              })
            })

            describe("dates", () => {
              const JAN_1ST = "2020-01-01T00:00:00.000Z"
              const JAN_2ND = "2020-01-02T00:00:00.000Z"
              const JAN_5TH = "2020-01-05T00:00:00.000Z"
              const JAN_9TH = "2020-01-09T00:00:00.000Z"
              const JAN_10TH = "2020-01-10T00:00:00.000Z"

              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  dob: { name: "dob", type: FieldType.DATETIME },
                })

                await createRows([{ dob: JAN_1ST }, { dob: JAN_10TH }])
              })

              describe("equal", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    equal: { dob: JAN_1ST },
                  }).toContainExactly([{ dob: JAN_1ST }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ equal: { dob: JAN_2ND } }).toFindNothing()
                })
              })

              describe("notEqual", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    notEqual: { dob: JAN_1ST },
                  }).toContainExactly([{ dob: JAN_10TH }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    notEqual: { dob: JAN_10TH },
                  }).toContainExactly([{ dob: JAN_1ST }])
                })
              })

              describe("oneOf", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    oneOf: { dob: [JAN_1ST] },
                  }).toContainExactly([{ dob: JAN_1ST }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    oneOf: { dob: [JAN_2ND] },
                  }).toFindNothing()
                })
              })

              describe("range", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    range: { dob: { low: JAN_1ST, high: JAN_5TH } },
                  }).toContainExactly([{ dob: JAN_1ST }])
                })

                it("successfully finds multiple rows", async () => {
                  await expectQuery({
                    range: { dob: { low: JAN_1ST, high: JAN_10TH } },
                  }).toContainExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }])
                })

                it("successfully finds a row with a high bound", async () => {
                  await expectQuery({
                    range: { dob: { low: JAN_5TH, high: JAN_10TH } },
                  }).toContainExactly([{ dob: JAN_10TH }])
                })

                it("successfully finds no rows", async () => {
                  await expectQuery({
                    range: { dob: { low: JAN_5TH, high: JAN_9TH } },
                  }).toFindNothing()
                })

                it("greater than equal to", async () => {
                  await expectQuery({
                    range: {
                      dob: {
                        low: JAN_10TH,
                        high: MAX_VALID_DATE.toISOString(),
                      },
                    },
                  }).toContainExactly([{ dob: JAN_10TH }])
                })

                it("greater than", async () => {
                  await expectQuery({
                    range: {
                      dob: { low: JAN_5TH, high: MAX_VALID_DATE.toISOString() },
                    },
                  }).toContainExactly([{ dob: JAN_10TH }])
                })

                it("less than equal to", async () => {
                  await expectQuery({
                    range: {
                      dob: { high: JAN_1ST, low: MIN_VALID_DATE.toISOString() },
                    },
                  }).toContainExactly([{ dob: JAN_1ST }])
                })

                it("less than", async () => {
                  await expectQuery({
                    range: {
                      dob: { high: JAN_5TH, low: MIN_VALID_DATE.toISOString() },
                    },
                  }).toContainExactly([{ dob: JAN_1ST }])
                })
              })

              describe("sort", () => {
                it("sorts ascending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "dob",
                    sortOrder: SortOrder.ASCENDING,
                  }).toMatchExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }])
                })

                it("sorts descending", async () => {
                  await expectSearch({
                    query: {},
                    sort: "dob",
                    sortOrder: SortOrder.DESCENDING,
                  }).toMatchExactly([{ dob: JAN_10TH }, { dob: JAN_1ST }])
                })

                describe("sortType STRING", () => {
                  it("sorts ascending", async () => {
                    await expectSearch({
                      query: {},
                      sort: "dob",
                      sortType: SortType.STRING,
                      sortOrder: SortOrder.ASCENDING,
                    }).toMatchExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }])
                  })

                  it("sorts descending", async () => {
                    await expectSearch({
                      query: {},
                      sort: "dob",
                      sortType: SortType.STRING,
                      sortOrder: SortOrder.DESCENDING,
                    }).toMatchExactly([{ dob: JAN_10TH }, { dob: JAN_1ST }])
                  })
                })
              })
            })

            !isInternal &&
              describe("datetime - time only", () => {
                const T_1000 = "10:00:00"
                const T_1045 = "10:45:00"
                const T_1200 = "12:00:00"
                const T_1530 = "15:30:00"
                const T_0000 = "00:00:00"

                const UNEXISTING_TIME = "10:01:00"

                const NULL_TIME__ID = `null_time__id`

                beforeAll(async () => {
                  tableOrViewId = await createTableOrView({
                    timeid: { name: "timeid", type: FieldType.STRING },
                    time: {
                      name: "time",
                      type: FieldType.DATETIME,
                      timeOnly: true,
                    },
                  })

                  await createRows([
                    { timeid: NULL_TIME__ID, time: null },
                    { time: T_1000 },
                    { time: T_1045 },
                    { time: T_1200 },
                    { time: T_1530 },
                    { time: T_0000 },
                  ])
                })

                describe("equal", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({
                      equal: { time: T_1000 },
                    }).toContainExactly([{ time: "10:00:00" }])
                  })

                  it("fails to find nonexistent row", async () => {
                    await expectQuery({
                      equal: { time: UNEXISTING_TIME },
                    }).toFindNothing()
                  })
                })

                describe("notEqual", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({
                      notEqual: { time: T_1000 },
                    }).toContainExactly([
                      { timeid: NULL_TIME__ID },
                      { time: "10:45:00" },
                      { time: "12:00:00" },
                      { time: "15:30:00" },
                      { time: "00:00:00" },
                    ])
                  })

                  it("return all when requesting non-existing", async () => {
                    await expectQuery({
                      notEqual: { time: UNEXISTING_TIME },
                    }).toContainExactly([
                      { timeid: NULL_TIME__ID },
                      { time: "10:00:00" },
                      { time: "10:45:00" },
                      { time: "12:00:00" },
                      { time: "15:30:00" },
                      { time: "00:00:00" },
                    ])
                  })
                })

                describe("oneOf", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({
                      oneOf: { time: [T_1000] },
                    }).toContainExactly([{ time: "10:00:00" }])
                  })

                  it("fails to find nonexistent row", async () => {
                    await expectQuery({
                      oneOf: { time: [UNEXISTING_TIME] },
                    }).toFindNothing()
                  })
                })

                describe("range", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({
                      range: { time: { low: T_1045, high: T_1045 } },
                    }).toContainExactly([{ time: "10:45:00" }])
                  })

                  it("successfully finds multiple rows", async () => {
                    await expectQuery({
                      range: { time: { low: T_1045, high: T_1530 } },
                    }).toContainExactly([
                      { time: "10:45:00" },
                      { time: "12:00:00" },
                      { time: "15:30:00" },
                    ])
                  })

                  it("successfully finds no rows", async () => {
                    await expectQuery({
                      range: {
                        time: { low: UNEXISTING_TIME, high: UNEXISTING_TIME },
                      },
                    }).toFindNothing()
                  })
                })

                describe("sort", () => {
                  it("sorts ascending", async () => {
                    await expectSearch({
                      query: {},
                      sort: "time",
                      sortOrder: SortOrder.ASCENDING,
                    }).toMatchExactly([
                      { timeid: NULL_TIME__ID },
                      { time: "00:00:00" },
                      { time: "10:00:00" },
                      { time: "10:45:00" },
                      { time: "12:00:00" },
                      { time: "15:30:00" },
                    ])
                  })

                  it("sorts descending", async () => {
                    await expectSearch({
                      query: {},
                      sort: "time",
                      sortOrder: SortOrder.DESCENDING,
                    }).toMatchExactly([
                      { time: "15:30:00" },
                      { time: "12:00:00" },
                      { time: "10:45:00" },
                      { time: "10:00:00" },
                      { time: "00:00:00" },
                      { timeid: NULL_TIME__ID },
                    ])
                  })

                  describe("sortType STRING", () => {
                    it("sorts ascending", async () => {
                      await expectSearch({
                        query: {},
                        sort: "time",
                        sortType: SortType.STRING,
                        sortOrder: SortOrder.ASCENDING,
                      }).toMatchExactly([
                        { timeid: NULL_TIME__ID },
                        { time: "00:00:00" },
                        { time: "10:00:00" },
                        { time: "10:45:00" },
                        { time: "12:00:00" },
                        { time: "15:30:00" },
                      ])
                    })

                    it("sorts descending", async () => {
                      await expectSearch({
                        query: {},
                        sort: "time",
                        sortType: SortType.STRING,
                        sortOrder: SortOrder.DESCENDING,
                      }).toMatchExactly([
                        { time: "15:30:00" },
                        { time: "12:00:00" },
                        { time: "10:45:00" },
                        { time: "10:00:00" },
                        { time: "00:00:00" },
                        { timeid: NULL_TIME__ID },
                      ])
                    })
                  })
                })
              })

            describe("datetime - date only", () => {
              describe.each([true, false])(
                "saved with timestamp: %s",
                saveWithTimestamp => {
                  describe.each([true, false])(
                    "search with timestamp: %s",
                    searchWithTimestamp => {
                      const SAVE_SUFFIX = saveWithTimestamp
                        ? "T00:00:00.000Z"
                        : ""
                      const SEARCH_SUFFIX = searchWithTimestamp
                        ? "T00:00:00.000Z"
                        : ""

                      const JAN_1ST = `2020-01-01`
                      const JAN_10TH = `2020-01-10`
                      const JAN_30TH = `2020-01-30`
                      const UNEXISTING_DATE = `2020-01-03`
                      const NULL_DATE__ID = `null_date__id`

                      beforeAll(async () => {
                        tableOrViewId = await createTableOrView({
                          dateid: {
                            name: "dateid",
                            type: FieldType.STRING,
                          },
                          date: {
                            name: "date",
                            type: FieldType.DATETIME,
                            dateOnly: true,
                          },
                        })

                        await createRows([
                          { dateid: NULL_DATE__ID, date: null },
                          { date: `${JAN_1ST}${SAVE_SUFFIX}` },
                          { date: `${JAN_10TH}${SAVE_SUFFIX}` },
                        ])
                      })

                      describe("equal", () => {
                        it("successfully finds a row", async () => {
                          await expectQuery({
                            equal: { date: `${JAN_1ST}${SEARCH_SUFFIX}` },
                          }).toContainExactly([{ date: JAN_1ST }])
                        })

                        it("successfully finds an ISO8601 row", async () => {
                          await expectQuery({
                            equal: { date: `${JAN_10TH}${SEARCH_SUFFIX}` },
                          }).toContainExactly([{ date: JAN_10TH }])
                        })

                        it("finds a row with ISO8601 timestamp", async () => {
                          await expectQuery({
                            equal: { date: `${JAN_1ST}${SEARCH_SUFFIX}` },
                          }).toContainExactly([{ date: JAN_1ST }])
                        })

                        it("fails to find nonexistent row", async () => {
                          await expectQuery({
                            equal: {
                              date: `${UNEXISTING_DATE}${SEARCH_SUFFIX}`,
                            },
                          }).toFindNothing()
                        })
                      })

                      describe("notEqual", () => {
                        it("successfully finds a row", async () => {
                          await expectQuery({
                            notEqual: {
                              date: `${JAN_1ST}${SEARCH_SUFFIX}`,
                            },
                          }).toContainExactly([
                            { date: JAN_10TH },
                            { dateid: NULL_DATE__ID },
                          ])
                        })

                        it("fails to find nonexistent row", async () => {
                          await expectQuery({
                            notEqual: {
                              date: `${JAN_30TH}${SEARCH_SUFFIX}`,
                            },
                          }).toContainExactly([
                            { date: JAN_1ST },
                            { date: JAN_10TH },
                            { dateid: NULL_DATE__ID },
                          ])
                        })
                      })

                      describe("oneOf", () => {
                        it("successfully finds a row", async () => {
                          await expectQuery({
                            oneOf: { date: [`${JAN_1ST}${SEARCH_SUFFIX}`] },
                          }).toContainExactly([{ date: JAN_1ST }])
                        })

                        it("fails to find nonexistent row", async () => {
                          await expectQuery({
                            oneOf: {
                              date: [`${UNEXISTING_DATE}${SEARCH_SUFFIX}`],
                            },
                          }).toFindNothing()
                        })
                      })

                      describe("range", () => {
                        it("successfully finds a row", async () => {
                          await expectQuery({
                            range: {
                              date: {
                                low: `${JAN_1ST}${SEARCH_SUFFIX}`,
                                high: `${JAN_1ST}${SEARCH_SUFFIX}`,
                              },
                            },
                          }).toContainExactly([{ date: JAN_1ST }])
                        })

                        it("successfully finds multiple rows", async () => {
                          await expectQuery({
                            range: {
                              date: {
                                low: `${JAN_1ST}${SEARCH_SUFFIX}`,
                                high: `${JAN_10TH}${SEARCH_SUFFIX}`,
                              },
                            },
                          }).toContainExactly([
                            { date: JAN_1ST },
                            { date: JAN_10TH },
                          ])
                        })

                        it("successfully finds no rows", async () => {
                          await expectQuery({
                            range: {
                              date: {
                                low: `${JAN_30TH}${SEARCH_SUFFIX}`,
                                high: `${JAN_30TH}${SEARCH_SUFFIX}`,
                              },
                            },
                          }).toFindNothing()
                        })
                      })

                      describe("sort", () => {
                        it("sorts ascending", async () => {
                          await expectSearch({
                            query: {},
                            sort: "date",
                            sortOrder: SortOrder.ASCENDING,
                          }).toMatchExactly([
                            { dateid: NULL_DATE__ID },
                            { date: JAN_1ST },
                            { date: JAN_10TH },
                          ])
                        })

                        it("sorts descending", async () => {
                          await expectSearch({
                            query: {},
                            sort: "date",
                            sortOrder: SortOrder.DESCENDING,
                          }).toMatchExactly([
                            { date: JAN_10TH },
                            { date: JAN_1ST },
                            { dateid: NULL_DATE__ID },
                          ])
                        })

                        describe("sortType STRING", () => {
                          it("sorts ascending", async () => {
                            await expectSearch({
                              query: {},
                              sort: "date",
                              sortType: SortType.STRING,
                              sortOrder: SortOrder.ASCENDING,
                            }).toMatchExactly([
                              { dateid: NULL_DATE__ID },
                              { date: JAN_1ST },
                              { date: JAN_10TH },
                            ])
                          })

                          it("sorts descending", async () => {
                            await expectSearch({
                              query: {},
                              sort: "date",
                              sortType: SortType.STRING,
                              sortOrder: SortOrder.DESCENDING,
                            }).toMatchExactly([
                              { date: JAN_10TH },
                              { date: JAN_1ST },
                              { dateid: NULL_DATE__ID },
                            ])
                          })
                        })
                      })
                    }
                  )
                }
              )
            })

            isInternal &&
              !isInMemory &&
              describe("AI Column", () => {
                const UNEXISTING_AI_COLUMN = "Real LLM Response"

                beforeAll(async () => {
                  mocks.licenses.useBudibaseAI()
                  mocks.licenses.useAICustomConfigs()

                  tableOrViewId = await createTableOrView({
                    product: { name: "product", type: FieldType.STRING },
                    ai: {
                      name: "AI",
                      type: FieldType.AI,
                      operation: AIOperationEnum.PROMPT,
                      prompt: "Translate '{{ product }}' into German",
                    },
                  })

                  await createRows([
                    { product: "Big Mac" },
                    { product: "McCrispy" },
                  ])
                })

                describe("equal", () => {
                  it("successfully finds rows based on AI column", async () => {
                    await expectQuery({
                      equal: { ai: "Mock LLM Response" },
                    }).toContainExactly([
                      { product: "Big Mac" },
                      { product: "McCrispy" },
                    ])
                  })

                  it("fails to find nonexistent row", async () => {
                    await expectQuery({
                      equal: { ai: UNEXISTING_AI_COLUMN },
                    }).toFindNothing()
                  })
                })

                describe("notEqual", () => {
                  it("Returns nothing when searching notEqual on the mock AI response", async () => {
                    await expectQuery({
                      notEqual: { ai: "Mock LLM Response" },
                    }).toContainExactly([])
                  })

                  it("return all when requesting non-existing response", async () => {
                    await expectQuery({
                      notEqual: { ai: "Real LLM Response" },
                    }).toContainExactly([
                      { product: "Big Mac" },
                      { product: "McCrispy" },
                    ])
                  })
                })

                describe("oneOf", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({
                      oneOf: {
                        ai: ["Mock LLM Response", "Other LLM Response"],
                      },
                    }).toContainExactly([
                      { product: "Big Mac" },
                      { product: "McCrispy" },
                    ])
                  })

                  it("fails to find nonexistent row", async () => {
                    await expectQuery({
                      oneOf: { ai: ["Whopper"] },
                    }).toFindNothing()
                  })
                })
              })

            describe("arrays", () => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  numbers: {
                    name: "numbers",
                    type: FieldType.ARRAY,
                    constraints: {
                      type: JsonFieldSubType.ARRAY,
                      inclusion: ["one", "two", "three"],
                    },
                  },
                })
                await createRows([
                  { numbers: ["one", "two"] },
                  { numbers: ["three"] },
                ])
              })

              describe("contains", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    contains: { numbers: ["one"] },
                  }).toContainExactly([{ numbers: ["one", "two"] }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    contains: { numbers: ["none"] },
                  }).toFindNothing()
                })

                it("fails to find row containing all", async () => {
                  await expectQuery({
                    contains: { numbers: ["one", "two", "three"] },
                  }).toFindNothing()
                })

                it("finds all with empty list", async () => {
                  await expectQuery({
                    contains: { numbers: [] },
                  }).toContainExactly([
                    { numbers: ["one", "two"] },
                    { numbers: ["three"] },
                  ])
                })
              })

              describe("notContains", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    notContains: { numbers: ["one"] },
                  }).toContainExactly([{ numbers: ["three"] }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    notContains: { numbers: ["one", "two", "three"] },
                  }).toContainExactly([
                    { numbers: ["one", "two"] },
                    { numbers: ["three"] },
                  ])
                })

                // Not sure if this is correct behaviour but changing it would be a
                // breaking change.
                it("finds all with empty list", async () => {
                  await expectQuery({
                    notContains: { numbers: [] },
                  }).toContainExactly([
                    { numbers: ["one", "two"] },
                    { numbers: ["three"] },
                  ])
                })
              })

              describe("containsAny", () => {
                it("successfully finds rows", async () => {
                  await expectQuery({
                    containsAny: { numbers: ["one", "two", "three"] },
                  }).toContainExactly([
                    { numbers: ["one", "two"] },
                    { numbers: ["three"] },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    containsAny: { numbers: ["none"] },
                  }).toFindNothing()
                })

                it("finds all with empty list", async () => {
                  await expectQuery({
                    containsAny: { numbers: [] },
                  }).toContainExactly([
                    { numbers: ["one", "two"] },
                    { numbers: ["three"] },
                  ])
                })
              })
            })

            describe("bigints", () => {
              const SMALL = "1"
              const MEDIUM = "10000000"

              // Our bigints are int64s in most datasources.
              let BIG = "9223372036854775807"

              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  num: { name: "num", type: FieldType.BIGINT },
                })
                await createRows([
                  { num: SMALL },
                  { num: MEDIUM },
                  { num: BIG },
                ])
              })

              describe("equal", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({ equal: { num: SMALL } }).toContainExactly(
                    [{ num: SMALL }]
                  )
                })

                it("successfully finds a big value", async () => {
                  await expectQuery({ equal: { num: BIG } }).toContainExactly([
                    { num: BIG },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ equal: { num: "2" } }).toFindNothing()
                })
              })

              describe("notEqual", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    notEqual: { num: SMALL },
                  }).toContainExactly([{ num: MEDIUM }, { num: BIG }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ notEqual: { num: 10 } }).toContainExactly(
                    [{ num: SMALL }, { num: MEDIUM }, { num: BIG }]
                  )
                })
              })

              describe("oneOf", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    oneOf: { num: [SMALL] },
                  }).toContainExactly([{ num: SMALL }])
                })

                it("successfully finds all rows", async () => {
                  await expectQuery({
                    oneOf: { num: [SMALL, MEDIUM, BIG] },
                  }).toContainExactly([
                    { num: SMALL },
                    { num: MEDIUM },
                    { num: BIG },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({ oneOf: { num: [2] } }).toFindNothing()
                })
              })

              describe("range", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    range: { num: { low: SMALL, high: "5" } },
                  }).toContainExactly([{ num: SMALL }])
                })

                it("successfully finds multiple rows", async () => {
                  await expectQuery({
                    range: { num: { low: SMALL, high: MEDIUM } },
                  }).toContainExactly([{ num: SMALL }, { num: MEDIUM }])
                })

                it("successfully finds a row with a high bound", async () => {
                  await expectQuery({
                    range: { num: { low: MEDIUM, high: BIG } },
                  }).toContainExactly([{ num: MEDIUM }, { num: BIG }])
                })

                it("successfully finds no rows", async () => {
                  await expectQuery({
                    range: { num: { low: "5", high: "5" } },
                  }).toFindNothing()
                })

                it("can search using just a low value", async () => {
                  await expectQuery({
                    range: { num: { low: MEDIUM } },
                  }).toContainExactly([{ num: MEDIUM }, { num: BIG }])
                })

                it("can search using just a high value", async () => {
                  await expectQuery({
                    range: { num: { high: MEDIUM } },
                  }).toContainExactly([{ num: SMALL }, { num: MEDIUM }])
                })
              })
            })

            isInternal &&
              describe("auto", () => {
                beforeAll(async () => {
                  tableOrViewId = await createTableOrView({
                    auto: {
                      name: "auto",
                      type: FieldType.AUTO,
                      autocolumn: true,
                      subtype: AutoFieldSubType.AUTO_ID,
                    },
                  })
                  await createRows(new Array(10).fill({}))
                })

                describe("equal", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({ equal: { auto: 1 } }).toContainExactly([
                      { auto: 1 },
                    ])
                  })

                  it("fails to find nonexistent row", async () => {
                    await expectQuery({ equal: { auto: 0 } }).toFindNothing()
                  })
                })

                describe("not equal", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({
                      notEqual: { auto: 1 },
                    }).toContainExactly([
                      { auto: 2 },
                      { auto: 3 },
                      { auto: 4 },
                      { auto: 5 },
                      { auto: 6 },
                      { auto: 7 },
                      { auto: 8 },
                      { auto: 9 },
                      { auto: 10 },
                    ])
                  })

                  it("fails to find nonexistent row", async () => {
                    await expectQuery({
                      notEqual: { auto: 0 },
                    }).toContainExactly([
                      { auto: 1 },
                      { auto: 2 },
                      { auto: 3 },
                      { auto: 4 },
                      { auto: 5 },
                      { auto: 6 },
                      { auto: 7 },
                      { auto: 8 },
                      { auto: 9 },
                      { auto: 10 },
                    ])
                  })
                })

                describe("oneOf", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({
                      oneOf: { auto: [1] },
                    }).toContainExactly([{ auto: 1 }])
                  })

                  it("fails to find nonexistent row", async () => {
                    await expectQuery({ oneOf: { auto: [0] } }).toFindNothing()
                  })
                })

                describe("range", () => {
                  it("successfully finds a row", async () => {
                    await expectQuery({
                      range: { auto: { low: 1, high: 1 } },
                    }).toContainExactly([{ auto: 1 }])
                  })

                  it("successfully finds multiple rows", async () => {
                    await expectQuery({
                      range: { auto: { low: 1, high: 2 } },
                    }).toContainExactly([{ auto: 1 }, { auto: 2 }])
                  })

                  it("successfully finds a row with a high bound", async () => {
                    await expectQuery({
                      range: { auto: { low: 2, high: 2 } },
                    }).toContainExactly([{ auto: 2 }])
                  })

                  it("successfully finds no rows", async () => {
                    await expectQuery({
                      range: { auto: { low: 0, high: 0 } },
                    }).toFindNothing()
                  })

                  it("can search using just a low value", async () => {
                    await expectQuery({
                      range: { auto: { low: 9 } },
                    }).toContainExactly([{ auto: 9 }, { auto: 10 }])
                  })

                  it("can search using just a high value", async () => {
                    await expectQuery({
                      range: { auto: { high: 2 } },
                    }).toContainExactly([{ auto: 1 }, { auto: 2 }])
                  })
                })

                describe("sort", () => {
                  it("sorts ascending", async () => {
                    await expectSearch({
                      query: {},
                      sort: "auto",
                      sortOrder: SortOrder.ASCENDING,
                      sortType: SortType.NUMBER,
                    }).toMatchExactly([
                      { auto: 1 },
                      { auto: 2 },
                      { auto: 3 },
                      { auto: 4 },
                      { auto: 5 },
                      { auto: 6 },
                      { auto: 7 },
                      { auto: 8 },
                      { auto: 9 },
                      { auto: 10 },
                    ])
                  })

                  it("sorts descending", async () => {
                    await expectSearch({
                      query: {},
                      sort: "auto",
                      sortOrder: SortOrder.DESCENDING,
                      sortType: SortType.NUMBER,
                    }).toMatchExactly([
                      { auto: 10 },
                      { auto: 9 },
                      { auto: 8 },
                      { auto: 7 },
                      { auto: 6 },
                      { auto: 5 },
                      { auto: 4 },
                      { auto: 3 },
                      { auto: 2 },
                      { auto: 1 },
                    ])
                  })

                  // This is important for pagination. The order of results must always
                  // be stable or pagination will break. We don't want the user to need
                  // to specify an order for pagination to work.
                  it("is stable without a sort specified", async () => {
                    let { rows: fullRowList } = await config.api.row.search(
                      tableOrViewId,
                      {
                        tableId: tableOrViewId,
                        query: {},
                      }
                    )

                    // repeat the search many times to check the first row is always the same
                    let bookmark: string | number | undefined,
                      hasNextPage: boolean | undefined = true,
                      rowCount = 0
                    do {
                      const response = await config.api.row.search(
                        tableOrViewId,
                        {
                          tableId: tableOrViewId,
                          limit: 1,
                          paginate: true,
                          query: {},
                          bookmark,
                        }
                      )
                      bookmark = response.bookmark
                      hasNextPage = response.hasNextPage
                      expect(response.rows.length).toEqual(1)
                      const foundRow = response.rows[0]
                      expect(foundRow).toEqual(fullRowList[rowCount++])
                    } while (hasNextPage)
                  })
                })

                describe("pagination", () => {
                  it("should paginate through all rows", async () => {
                    // @ts-ignore
                    let bookmark: string | number = undefined
                    let rows: Row[] = []

                    while (true) {
                      const response = await config.api.row.search(
                        tableOrViewId,
                        {
                          tableId: tableOrViewId,
                          limit: 3,
                          query: {},
                          bookmark,
                          paginate: true,
                        }
                      )

                      rows.push(...response.rows)

                      if (!response.bookmark || !response.hasNextPage) {
                        break
                      }
                      bookmark = response.bookmark
                    }

                    const autoValues = rows
                      .map(row => row.auto)
                      .sort((a, b) => a - b)
                    expect(autoValues).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                  })
                })
              })

            describe("field name 1:name", () => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  "1:name": { name: "1:name", type: FieldType.STRING },
                })
                await createRows([{ "1:name": "bar" }, { "1:name": "foo" }])
              })

              it("successfully finds a row", async () => {
                await expectQuery({
                  equal: { "1:1:name": "bar" },
                }).toContainExactly([{ "1:name": "bar" }])
              })

              it("fails to find nonexistent row", async () => {
                await expectQuery({
                  equal: { "1:1:name": "none" },
                }).toFindNothing()
              })
            })

            isSql &&
              describe("related formulas", () => {
                beforeAll(async () => {
                  const arrayTable = await createTable({
                    name: { name: "name", type: FieldType.STRING },
                    array: {
                      name: "array",
                      type: FieldType.ARRAY,
                      constraints: {
                        type: JsonFieldSubType.ARRAY,
                        inclusion: ["option 1", "option 2"],
                      },
                    },
                  })
                  tableOrViewId = await createTableOrView({
                    relationship: {
                      type: FieldType.LINK,
                      relationshipType: RelationshipType.MANY_TO_ONE,
                      name: "relationship",
                      fieldName: "relate",
                      tableId: arrayTable,
                      constraints: {
                        type: "array",
                      },
                    },
                    formula: {
                      type: FieldType.FORMULA,
                      name: "formula",
                      formula: encodeJSBinding(
                        `let array = [];$("relationship").forEach(rel => array = array.concat(rel.array));return array.sort().join(",")`
                      ),
                    },
                  })
                  const arrayRows = await Promise.all([
                    config.api.row.save(arrayTable, {
                      name: "foo",
                      array: ["option 1"],
                    }),
                    config.api.row.save(arrayTable, {
                      name: "bar",
                      array: ["option 2"],
                    }),
                  ])
                  await Promise.all([
                    config.api.row.save(tableOrViewId, {
                      relationship: [arrayRows[0]._id, arrayRows[1]._id],
                    }),
                  ])
                })

                it("formula is correct with relationship arrays", async () => {
                  await expectQuery({}).toContain([
                    { formula: "option 1,option 2" },
                  ])
                })
              })

            describe("user", () => {
              let user1: User
              let user2: User

              beforeAll(async () => {
                user1 = await config.createUser({ _id: `us_${utils.newid()}` })
                user2 = await config.createUser({ _id: `us_${utils.newid()}` })

                tableOrViewId = await createTableOrView({
                  user: {
                    name: "user",
                    type: FieldType.BB_REFERENCE_SINGLE,
                    subtype: BBReferenceFieldSubType.USER,
                  },
                })

                await createRows([
                  { user: user1 },
                  { user: user2 },
                  { user: null },
                ])
              })

              describe("equal", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    equal: { user: user1._id },
                  }).toContainExactly([{ user: { _id: user1._id } }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    equal: { user: "us_none" },
                  }).toFindNothing()
                })
              })

              describe("notEqual", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    notEqual: { user: user1._id },
                  }).toContainExactly([{ user: { _id: user2._id } }, {}])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    notEqual: { user: "us_none" },
                  }).toContainExactly([
                    { user: { _id: user1._id } },
                    { user: { _id: user2._id } },
                    {},
                  ])
                })
              })

              describe("oneOf", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    oneOf: { user: [user1._id] },
                  }).toContainExactly([{ user: { _id: user1._id } }])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    oneOf: { user: ["us_none"] },
                  }).toFindNothing()
                })
              })

              describe("empty", () => {
                it("finds empty rows", async () => {
                  await expectQuery({ empty: { user: null } }).toContainExactly(
                    [{}]
                  )
                })
              })

              describe("notEmpty", () => {
                it("finds non-empty rows", async () => {
                  await expectQuery({
                    notEmpty: { user: null },
                  }).toContainExactly([
                    { user: { _id: user1._id } },
                    { user: { _id: user2._id } },
                  ])
                })
              })
            })

            describe("multi user", () => {
              let user1: User
              let user2: User

              beforeAll(async () => {
                user1 = await config.createUser({ _id: `us_${utils.newid()}` })
                user2 = await config.createUser({ _id: `us_${utils.newid()}` })

                tableOrViewId = await createTableOrView({
                  users: {
                    name: "users",
                    type: FieldType.BB_REFERENCE,
                    subtype: BBReferenceFieldSubType.USER,
                    constraints: { type: "array" },
                  },
                  number: {
                    name: "number",
                    type: FieldType.NUMBER,
                  },
                })

                await createRows([
                  { number: 1, users: [user1] },
                  { number: 2, users: [user2] },
                  { number: 3, users: [user1, user2] },
                  { number: 4, users: [] },
                ])
              })

              describe("contains", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    contains: { users: [user1._id] },
                  }).toContainExactly([
                    { users: [{ _id: user1._id }] },
                    { users: [{ _id: user1._id }, { _id: user2._id }] },
                  ])
                })

                it("successfully finds a row searching with a string", async () => {
                  await expectQuery({
                    // @ts-expect-error this test specifically goes against the type to
                    // test that we coerce the string to an array.
                    contains: { "1:users": user1._id },
                  }).toContainExactly([
                    { users: [{ _id: user1._id }] },
                    { users: [{ _id: user1._id }, { _id: user2._id }] },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    contains: { users: ["us_none"] },
                  }).toFindNothing()
                })
              })

              describe("notContains", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    notContains: { users: [user1._id] },
                  }).toContainExactly([{ users: [{ _id: user2._id }] }, {}])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    notContains: { users: ["us_none"] },
                  }).toContainExactly([
                    { users: [{ _id: user1._id }] },
                    { users: [{ _id: user2._id }] },
                    { users: [{ _id: user1._id }, { _id: user2._id }] },
                    {},
                  ])
                })
              })

              describe("containsAny", () => {
                it("successfully finds rows", async () => {
                  await expectQuery({
                    containsAny: { users: [user1._id, user2._id] },
                  }).toContainExactly([
                    { users: [{ _id: user1._id }] },
                    { users: [{ _id: user2._id }] },
                    { users: [{ _id: user1._id }, { _id: user2._id }] },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    containsAny: { users: ["us_none"] },
                  }).toFindNothing()
                })
              })

              describe("multi-column equals", () => {
                it("successfully finds a row", async () => {
                  await expectQuery({
                    equal: { number: 1 },
                    contains: { users: [user1._id] },
                  }).toContainExactly([
                    { users: [{ _id: user1._id }], number: 1 },
                  ])
                })

                it("fails to find nonexistent row", async () => {
                  await expectQuery({
                    equal: { number: 2 },
                    contains: { users: [user1._id] },
                  }).toFindNothing()
                })
              })
            })

            // It also can't work for in-memory searching because the related table name
            // isn't available.
            !isInMemory &&
              describe.each([
                RelationshipType.ONE_TO_MANY,
                RelationshipType.MANY_TO_ONE,
                RelationshipType.MANY_TO_MANY,
              ])("relations (%s)", relationshipType => {
                let productCategoryTable: Table, productCatRows: Row[]

                beforeAll(async () => {
                  const { relatedTable, tableId } =
                    await basicRelationshipTables(relationshipType)
                  tableOrViewId = tableId
                  productCategoryTable = relatedTable

                  productCatRows = await Promise.all([
                    config.api.row.save(productCategoryTable._id!, {
                      name: "foo",
                    }),
                    config.api.row.save(productCategoryTable._id!, {
                      name: "bar",
                    }),
                  ])

                  await Promise.all([
                    config.api.row.save(tableOrViewId, {
                      name: "foo",
                      productCat: [productCatRows[0]._id],
                    }),
                    config.api.row.save(tableOrViewId, {
                      name: "bar",
                      productCat: [productCatRows[1]._id],
                    }),
                    config.api.row.save(tableOrViewId, {
                      name: "baz",
                      productCat: [],
                    }),
                  ])
                })

                it("should be able to filter by relationship using column name", async () => {
                  await expectQuery({
                    equal: { ["productCat.name"]: "foo" },
                  }).toContainExactly([
                    {
                      name: "foo",
                      productCat: [{ _id: productCatRows[0]._id }],
                    },
                  ])
                })

                it("should be able to filter by relationship using table name", async () => {
                  await expectQuery({
                    equal: { [`${productCategoryTable.name}.name`]: "foo" },
                  }).toContainExactly([
                    {
                      name: "foo",
                      productCat: [{ _id: productCatRows[0]._id }],
                    },
                  ])
                })

                it("shouldn't return any relationship for last row", async () => {
                  await expectQuery({
                    equal: { ["name"]: "baz" },
                  }).toContainExactly([{ name: "baz", productCat: undefined }])
                })

                describe("logical filters", () => {
                  const logicalOperators = [
                    LogicalOperator.AND,
                    LogicalOperator.OR,
                  ]

                  describe("$and", () => {
                    it("should allow single conditions", async () => {
                      await expectQuery({
                        $and: {
                          conditions: [
                            {
                              equal: { ["productCat.name"]: "foo" },
                            },
                          ],
                        },
                      }).toContainExactly([
                        {
                          name: "foo",
                          productCat: [{ _id: productCatRows[0]._id }],
                        },
                      ])
                    })

                    it("should allow exclusive conditions", async () => {
                      await expectQuery({
                        $and: {
                          conditions: [
                            {
                              equal: { ["productCat.name"]: "foo" },
                              notEqual: { ["productCat.name"]: "foo" },
                            },
                          ],
                        },
                      }).toContainExactly([])
                    })

                    it.each([logicalOperators])(
                      "should allow nested ands with single conditions (with %s as root)",
                      async rootOperator => {
                        await expectQuery({
                          [rootOperator]: {
                            conditions: [
                              {
                                $and: {
                                  conditions: [
                                    {
                                      equal: { ["productCat.name"]: "foo" },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        }).toContainExactly([
                          {
                            name: "foo",
                            productCat: [{ _id: productCatRows[0]._id }],
                          },
                        ])
                      }
                    )

                    it.each([logicalOperators])(
                      "should allow nested ands with exclusive conditions (with %s as root)",
                      async rootOperator => {
                        await expectQuery({
                          [rootOperator]: {
                            conditions: [
                              {
                                $and: {
                                  conditions: [
                                    {
                                      equal: { ["productCat.name"]: "foo" },
                                      notEqual: { ["productCat.name"]: "foo" },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        }).toContainExactly([])
                      }
                    )

                    it.each([logicalOperators])(
                      "should allow nested ands with multiple conditions (with %s as root)",
                      async rootOperator => {
                        await expectQuery({
                          [rootOperator]: {
                            conditions: [
                              {
                                $and: {
                                  conditions: [
                                    {
                                      equal: { ["productCat.name"]: "foo" },
                                    },
                                  ],
                                },
                                notEqual: { ["productCat.name"]: "foo" },
                              },
                            ],
                          },
                        }).toContainExactly([])
                      }
                    )
                  })

                  describe("$ors", () => {
                    it("should allow single conditions", async () => {
                      await expectQuery({
                        $or: {
                          conditions: [
                            {
                              equal: { ["productCat.name"]: "foo" },
                            },
                          ],
                        },
                      }).toContainExactly([
                        {
                          name: "foo",
                          productCat: [{ _id: productCatRows[0]._id }],
                        },
                      ])
                    })

                    it("should allow exclusive conditions", async () => {
                      await expectQuery({
                        $or: {
                          conditions: [
                            {
                              equal: { ["productCat.name"]: "foo" },
                              notEqual: { ["productCat.name"]: "foo" },
                            },
                          ],
                        },
                      }).toContainExactly([
                        {
                          name: "foo",
                          productCat: [{ _id: productCatRows[0]._id }],
                        },
                        {
                          name: "bar",
                          productCat: [{ _id: productCatRows[1]._id }],
                        },
                        { name: "baz", productCat: undefined },
                      ])
                    })

                    it.each([logicalOperators])(
                      "should allow nested ors with single conditions (with %s as root)",
                      async rootOperator => {
                        await expectQuery({
                          [rootOperator]: {
                            conditions: [
                              {
                                $or: {
                                  conditions: [
                                    {
                                      equal: { ["productCat.name"]: "foo" },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        }).toContainExactly([
                          {
                            name: "foo",
                            productCat: [{ _id: productCatRows[0]._id }],
                          },
                        ])
                      }
                    )

                    it.each([logicalOperators])(
                      "should allow nested ors with exclusive conditions (with %s as root)",
                      async rootOperator => {
                        await expectQuery({
                          [rootOperator]: {
                            conditions: [
                              {
                                $or: {
                                  conditions: [
                                    {
                                      equal: { ["productCat.name"]: "foo" },
                                      notEqual: { ["productCat.name"]: "foo" },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        }).toContainExactly([
                          {
                            name: "foo",
                            productCat: [{ _id: productCatRows[0]._id }],
                          },
                          {
                            name: "bar",
                            productCat: [{ _id: productCatRows[1]._id }],
                          },
                          { name: "baz", productCat: undefined },
                        ])
                      }
                    )

                    it("should allow nested ors with multiple conditions", async () => {
                      await expectQuery({
                        $or: {
                          conditions: [
                            {
                              $or: {
                                conditions: [
                                  {
                                    equal: { ["productCat.name"]: "foo" },
                                  },
                                ],
                              },
                              notEqual: { ["productCat.name"]: "foo" },
                            },
                          ],
                        },
                      }).toContainExactly([
                        {
                          name: "foo",
                          productCat: [{ _id: productCatRows[0]._id }],
                        },
                        {
                          name: "bar",
                          productCat: [{ _id: productCatRows[1]._id }],
                        },
                        { name: "baz", productCat: undefined },
                      ])
                    })
                  })
                })
              })

            isSql &&
              describe("relationship - table with spaces", () => {
                let primaryTable: Table, row: Row

                beforeAll(async () => {
                  const { relatedTable, tableId } =
                    await basicRelationshipTables(
                      RelationshipType.ONE_TO_MANY,
                      {
                        tableName: "table with spaces",
                        primaryColumn: "related",
                        otherColumn: "related",
                      }
                    )
                  tableOrViewId = tableId
                  primaryTable = relatedTable

                  row = await config.api.row.save(primaryTable._id!, {
                    name: "foo",
                  })

                  await config.api.row.save(tableOrViewId, {
                    name: "foo",
                    related: [row._id],
                  })
                })

                it("should be able to search by table name with spaces", async () => {
                  await expectQuery({
                    equal: {
                      ["table with spaces.name"]: "foo",
                    },
                  }).toContain([{ name: "foo" }])
                })
              })

            isSql &&
              describe.each([
                RelationshipType.MANY_TO_ONE,
                RelationshipType.MANY_TO_MANY,
              ])("big relations (%s)", relationshipType => {
                beforeAll(async () => {
                  const { relatedTable, tableId } =
                    await basicRelationshipTables(relationshipType)
                  tableOrViewId = tableId
                  const mainRow = await config.api.row.save(tableOrViewId, {
                    name: "foo",
                  })
                  for (let i = 0; i < 11; i++) {
                    await config.api.row.save(relatedTable._id!, {
                      name: i,
                      product: [mainRow._id!],
                    })
                  }
                })

                it("can only pull 10 related rows", async () => {
                  await withCoreEnv(
                    { SQL_MAX_RELATED_ROWS: "10" },
                    async () => {
                      const response = await expectQuery({}).toContain([
                        { name: "foo" },
                      ])
                      expect(response.rows[0].productCat).toBeArrayOfSize(10)
                    }
                  )
                })

                it("can pull max rows when env not set (defaults to 500)", async () => {
                  const response = await expectQuery({}).toContain([
                    { name: "foo" },
                  ])
                  expect(response.rows[0].productCat).toBeArrayOfSize(11)
                })
              })

            isSql &&
              describe("relations to same table", () => {
                let relatedTable: string, relatedRows: Row[]

                beforeAll(async () => {
                  relatedTable = await createTable({
                    name: { name: "name", type: FieldType.STRING },
                  })
                  tableOrViewId = await createTableOrView({
                    name: { name: "name", type: FieldType.STRING },
                    related1: {
                      type: FieldType.LINK,
                      name: "related1",
                      fieldName: "main1",
                      tableId: relatedTable,
                      relationshipType: RelationshipType.MANY_TO_MANY,
                    },
                    related2: {
                      type: FieldType.LINK,
                      name: "related2",
                      fieldName: "main2",
                      tableId: relatedTable,
                      relationshipType: RelationshipType.MANY_TO_MANY,
                    },
                  })
                  relatedRows = await Promise.all([
                    config.api.row.save(relatedTable, { name: "foo" }),
                    config.api.row.save(relatedTable, { name: "bar" }),
                    config.api.row.save(relatedTable, { name: "baz" }),
                    config.api.row.save(relatedTable, { name: "boo" }),
                  ])
                  await Promise.all([
                    config.api.row.save(tableOrViewId, {
                      name: "test",
                      related1: [relatedRows[0]._id!],
                      related2: [relatedRows[1]._id!],
                    }),
                    config.api.row.save(tableOrViewId, {
                      name: "test2",
                      related1: [relatedRows[2]._id!],
                      related2: [relatedRows[3]._id!],
                    }),
                    config.api.row.save(tableOrViewId, {
                      name: "test3",
                      related1: [relatedRows[1]._id],
                      related2: [relatedRows[2]._id!],
                    }),
                  ])
                })

                it("should be able to relate to same table", async () => {
                  await expectSearch({
                    query: {},
                  }).toContainExactly([
                    {
                      name: "test",
                      related1: [{ _id: relatedRows[0]._id }],
                      related2: [{ _id: relatedRows[1]._id }],
                    },
                    {
                      name: "test2",
                      related1: [{ _id: relatedRows[2]._id }],
                      related2: [{ _id: relatedRows[3]._id }],
                    },
                    {
                      name: "test3",
                      related1: [{ _id: relatedRows[1]._id }],
                      related2: [{ _id: relatedRows[2]._id }],
                    },
                  ])
                })

                it("should be able to filter via the first relation field with equal", async () => {
                  await expectSearch({
                    query: {
                      equal: {
                        ["related1.name"]: "baz",
                      },
                    },
                  }).toContainExactly([
                    {
                      name: "test2",
                      related1: [{ _id: relatedRows[2]._id }],
                    },
                  ])
                })

                it("should be able to filter via the second relation field with not equal", async () => {
                  await expectSearch({
                    query: {
                      notEqual: {
                        ["1:related2.name"]: "foo",
                        ["2:related2.name"]: "baz",
                        ["3:related2.name"]: "boo",
                      },
                    },
                  }).toContainExactly([
                    {
                      name: "test",
                    },
                  ])
                })

                it("should be able to filter on both fields", async () => {
                  await expectSearch({
                    query: {
                      notEqual: {
                        ["related1.name"]: "foo",
                        ["related2.name"]: "baz",
                      },
                    },
                  }).toContainExactly([
                    {
                      name: "test2",
                    },
                  ])
                })
              })

            isInternal &&
              describe("no column error backwards compat", () => {
                beforeAll(async () => {
                  tableOrViewId = await createTableOrView({
                    name: {
                      name: "name",
                      type: FieldType.STRING,
                    },
                  })
                })

                it("shouldn't error when column doesn't exist", async () => {
                  await expectSearch({
                    query: {
                      string: {
                        "1:something": "a",
                      },
                    },
                  }).toMatch({ rows: [] })
                })
              })

            describe("row counting", () => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                  },
                })
                await createRows([{ name: "a" }, { name: "b" }])
              })

              it("should be able to count rows when option set", async () => {
                await expectSearch({
                  countRows: true,
                  query: {
                    notEmpty: {
                      name: true,
                    },
                  },
                }).toMatch({ totalRows: 2, rows: expect.any(Array) })
              })

              it("shouldn't count rows when option is not set", async () => {
                await expectSearch({
                  countRows: false,
                  query: {
                    notEmpty: {
                      name: true,
                    },
                  },
                }).toNotHaveProperty(["totalRows"])
              })
            })

            describe("Invalid column definitions", () => {
              beforeAll(async () => {
                // need to create an invalid table - means ignoring typescript
                tableOrViewId = await createTableOrView({
                  // @ts-ignore
                  invalid: {
                    type: FieldType.STRING,
                  },
                  name: {
                    name: "name",
                    type: FieldType.STRING,
                  },
                })
                await createRows([
                  { name: "foo", invalid: "id1" },
                  { name: "bar", invalid: "id2" },
                ])
              })

              it("can get rows with all table data", async () => {
                await expectSearch({
                  query: {},
                }).toContain([
                  { name: "foo", invalid: "id1" },
                  { name: "bar", invalid: "id2" },
                ])
              })
            })

            describe.each([
              "data_name_test",
              "name_data_test",
              "name_test_data_",
            ])("special (%s) case", column => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  [column]: {
                    name: column,
                    type: FieldType.STRING,
                  },
                })
                await createRows([{ [column]: "a" }, { [column]: "b" }])
              })

              it("should be able to query a column with data_ in it", async () => {
                await expectSearch({
                  query: {
                    equal: {
                      [`1:${column}`]: "a",
                    },
                  },
                }).toContainExactly([{ [column]: "a" }])
              })
            })

            isInternal &&
              describe("sample data", () => {
                beforeAll(async () => {
                  await config.api.application.addSampleData(config.appId!)
                  tableOrViewId = DEFAULT_EMPLOYEE_TABLE_SCHEMA._id!
                  rows = await config.api.row.fetch(tableOrViewId)
                })

                it("should be able to search sample data", async () => {
                  await expectSearch({
                    query: {},
                  }).toContain([
                    {
                      "First Name": "Mandy",
                    },
                  ])
                })
              })

            describe.each([
              {
                low: "2024-07-03T00:00:00.000Z",
                high: "9999-00-00T00:00:00.000Z",
              },
              {
                low: "2024-07-03T00:00:00.000Z",
                high: "9998-00-00T00:00:00.000Z",
              },
              {
                low: "0000-00-00T00:00:00.000Z",
                high: "2024-07-04T00:00:00.000Z",
              },
              {
                low: "0001-00-00T00:00:00.000Z",
                high: "2024-07-04T00:00:00.000Z",
              },
            ])("date special cases", ({ low, high }) => {
              const earlyDate = "2024-07-03T10:00:00.000Z",
                laterDate = "2024-07-03T11:00:00.000Z"
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  date: {
                    name: "date",
                    type: FieldType.DATETIME,
                  },
                })
                await createRows([{ date: earlyDate }, { date: laterDate }])
              })

              it("should be able to handle a date search", async () => {
                await expectSearch({
                  query: {
                    range: {
                      "1:date": { low, high },
                    },
                  },
                }).toContainExactly([{ date: earlyDate }, { date: laterDate }])
              })
            })

            describe.each([
              "名前", // Japanese for "name"
              "Benutzer-ID", // German for "user ID", includes a hyphen
              "numéro", // French for "number", includes an accent
              "år", // Swedish for "year", includes a ring above
              "naïve", // English word borrowed from French, includes an umlaut
              "الاسم", // Arabic for "name"
              "оплата", // Russian for "payment"
              "पता", // Hindi for "address"
              "用戶名", // Chinese for "username"
              "çalışma_zamanı", // Turkish for "runtime", includes an underscore and a cedilla
              "preço", // Portuguese for "price", includes a cedilla
              "사용자명", // Korean for "username"
              "usuario_ñoño", // Spanish, uses an underscore and includes "ñ"
              "файл", // Bulgarian for "file"
              "δεδομένα", // Greek for "data"
              "geändert_am", // German for "modified on", includes an umlaut
              "ব্যবহারকারীর_নাম", // Bengali for "user name", includes an underscore
              "São_Paulo", // Portuguese, includes an underscore and a tilde
              "età", // Italian for "age", includes an accent
              "ชื่อผู้ใช้", // Thai for "username"
            ])("non-ascii column name: %s", name => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  [name]: {
                    name,
                    type: FieldType.STRING,
                  },
                })
                await createRows([{ [name]: "a" }, { [name]: "b" }])
              })

              it("should be able to query a column with non-ascii characters", async () => {
                await expectSearch({
                  query: {
                    equal: {
                      [`1:${name}`]: "a",
                    },
                  },
                }).toContainExactly([{ [name]: "a" }])
              })
            })

            // This is currently not supported in external datasources, it produces SQL
            // errors at time of writing. We supported it (potentially by accident) in
            // Lucene, though, so we need to make sure it's supported in SQS as well. We
            // found real cases in production of column names ending in a space.
            isInternal &&
              describe("space at end of column name", () => {
                beforeAll(async () => {
                  tableOrViewId = await createTableOrView({
                    "name ": {
                      name: "name ",
                      type: FieldType.STRING,
                    },
                  })
                  await createRows([{ ["name "]: "foo" }, { ["name "]: "bar" }])
                })

                it("should be able to query a column that ends with a space", async () => {
                  await expectSearch({
                    query: {
                      string: {
                        "name ": "foo",
                      },
                    },
                  }).toContainExactly([{ ["name "]: "foo" }])
                })

                it("should be able to query a column that ends with a space using numeric notation", async () => {
                  await expectSearch({
                    query: {
                      string: {
                        "1:name ": "foo",
                      },
                    },
                  }).toContainExactly([{ ["name "]: "foo" }])
                })
              })

            isInternal &&
              describe("space at start of column name", () => {
                beforeAll(async () => {
                  tableOrViewId = await createTableOrView({
                    " name": {
                      name: " name",
                      type: FieldType.STRING,
                    },
                  })
                  await createRows([{ [" name"]: "foo" }, { [" name"]: "bar" }])
                })

                it("should be able to query a column that starts with a space", async () => {
                  await expectSearch({
                    query: {
                      string: {
                        " name": "foo",
                      },
                    },
                  }).toContainExactly([{ [" name"]: "foo" }])
                })

                it("should be able to query a column that starts with a space using numeric notation", async () => {
                  await expectSearch({
                    query: {
                      string: {
                        "1: name": "foo",
                      },
                    },
                  }).toContainExactly([{ [" name"]: "foo" }])
                })
              })

            isInternal &&
              !isView &&
              describe("duplicate columns", () => {
                beforeAll(async () => {
                  tableOrViewId = await createTableOrView({
                    name: {
                      name: "name",
                      type: FieldType.STRING,
                    },
                  })
                  await context.doInAppContext(config.getAppId(), async () => {
                    const db = context.getAppDB()
                    const tableDoc = await db.get<Table>(tableOrViewId)
                    tableDoc.schema.Name = {
                      name: "Name",
                      type: FieldType.STRING,
                    }
                    try {
                      // remove the SQLite definitions so that they can be rebuilt as part of the search
                      const sqliteDoc = await db.get(SQLITE_DESIGN_DOC_ID)
                      await db.remove(sqliteDoc)
                    } catch (err) {
                      // no-op
                    }
                  })
                  await createRows([{ name: "foo", Name: "bar" }])
                })

                it("should handle invalid duplicate column names", async () => {
                  await expectSearch({
                    query: {},
                  }).toContainExactly([{ name: "foo" }])
                })
              })

            !isInMemory &&
              describe("search by _id", () => {
                let row: Row

                beforeAll(async () => {
                  const toRelateTable = await createTable({
                    name: {
                      name: "name",
                      type: FieldType.STRING,
                    },
                  })
                  tableOrViewId = await createTableOrView({
                    name: {
                      name: "name",
                      type: FieldType.STRING,
                    },
                    rel: {
                      name: "rel",
                      type: FieldType.LINK,
                      relationshipType: RelationshipType.MANY_TO_MANY,
                      tableId: toRelateTable,
                      fieldName: "rel",
                    },
                  })
                  const [row1, row2] = await Promise.all([
                    config.api.row.save(toRelateTable, { name: "tag 1" }),
                    config.api.row.save(toRelateTable, { name: "tag 2" }),
                  ])
                  row = await config.api.row.save(tableOrViewId, {
                    name: "product 1",
                    rel: [row1._id, row2._id],
                  })
                })

                it("can filter by the row ID with limit 1", async () => {
                  await expectSearch({
                    query: {
                      equal: { _id: row._id },
                    },
                    limit: 1,
                  }).toContainExactly([row])
                })
              })

            !isInternal &&
              describe("search by composite key", () => {
                beforeAll(async () => {
                  const table = await config.api.table.save(
                    tableForDatasource(datasource, {
                      schema: {
                        idColumn1: {
                          name: "idColumn1",
                          type: FieldType.NUMBER,
                        },
                        idColumn2: {
                          name: "idColumn2",
                          type: FieldType.NUMBER,
                        },
                      },
                      primary: ["idColumn1", "idColumn2"],
                    })
                  )
                  tableOrViewId = table._id!
                  await createRows([{ idColumn1: 1, idColumn2: 2 }])
                })

                it("can filter by the row ID with limit 1", async () => {
                  await expectSearch({
                    query: {
                      equal: { _id: generateRowIdField([1, 2]) },
                    },
                    limit: 1,
                  }).toContain([
                    {
                      idColumn1: 1,
                      idColumn2: 2,
                    },
                  ])
                })
              })

            isSql &&
              describe("primaryDisplay", () => {
                beforeAll(async () => {
                  let toRelateTableId = await createTable({
                    name: {
                      name: "name",
                      type: FieldType.STRING,
                    },
                  })
                  tableOrViewId = await createTableOrView({
                    name: {
                      name: "name",
                      type: FieldType.STRING,
                    },
                    link: {
                      name: "link",
                      type: FieldType.LINK,
                      relationshipType: RelationshipType.MANY_TO_ONE,
                      tableId: toRelateTableId,
                      fieldName: "main",
                    },
                  })

                  const toRelateTable = await config.api.table.get(
                    toRelateTableId
                  )
                  await config.api.table.save({
                    ...toRelateTable,
                    primaryDisplay: "name",
                  })
                  const relatedRows = await Promise.all([
                    config.api.row.save(toRelateTable._id!, {
                      name: "related",
                    }),
                  ])
                  await config.api.row.save(tableOrViewId, {
                    name: "test",
                    link: relatedRows.map(row => row._id),
                  })
                })

                it("should be able to query, primary display on related table shouldn't be used", async () => {
                  // this test makes sure that if a relationship has been specified as the primary display on a table
                  // it is ignored and another column is used instead
                  await expectQuery({}).toContain([
                    { name: "test", link: [{ primaryDisplay: "related" }] },
                  ])
                })
              })

            describe("$and", () => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  age: { name: "age", type: FieldType.NUMBER },
                  name: { name: "name", type: FieldType.STRING },
                })
                await createRows([
                  { age: 1, name: "Jane" },
                  { age: 10, name: "Jack" },
                  { age: 7, name: "Hanna" },
                  { age: 8, name: "Jan" },
                ])
              })

              it("successfully finds a row for one level condition", async () => {
                await expectQuery({
                  $and: {
                    conditions: [
                      { equal: { age: 10 } },
                      { equal: { name: "Jack" } },
                    ],
                  },
                }).toContainExactly([{ age: 10, name: "Jack" }])
              })

              it("successfully finds a row for one level with multiple conditions", async () => {
                await expectQuery({
                  $and: {
                    conditions: [
                      { equal: { age: 10 } },
                      { equal: { name: "Jack" } },
                    ],
                  },
                }).toContainExactly([{ age: 10, name: "Jack" }])
              })

              it("successfully finds multiple rows for one level with multiple conditions", async () => {
                await expectQuery({
                  $and: {
                    conditions: [
                      { range: { age: { low: 1, high: 9 } } },
                      { string: { name: "Ja" } },
                    ],
                  },
                }).toContainExactly([
                  { age: 1, name: "Jane" },
                  { age: 8, name: "Jan" },
                ])
              })

              it("successfully finds rows for nested filters", async () => {
                await expectQuery({
                  $and: {
                    conditions: [
                      {
                        $and: {
                          conditions: [
                            {
                              range: { age: { low: 1, high: 10 } },
                            },
                            { string: { name: "Ja" } },
                          ],
                        },
                        equal: { name: "Jane" },
                      },
                    ],
                  },
                }).toContainExactly([{ age: 1, name: "Jane" }])
              })

              it("returns nothing when filtering out all data", async () => {
                await expectQuery({
                  $and: {
                    conditions: [
                      { equal: { age: 7 } },
                      { equal: { name: "Jack" } },
                    ],
                  },
                }).toFindNothing()
              })

              !isInMemory &&
                it("validates conditions that are not objects", async () => {
                  await expect(
                    expectQuery({
                      $and: {
                        conditions: [
                          { equal: { age: 10 } },
                          "invalidCondition" as any,
                        ],
                      },
                    }).toFindNothing()
                  ).rejects.toThrow(
                    'Invalid body - "query.$and.conditions[1]" must be of type object'
                  )
                })

              !isInMemory &&
                it("validates $and without conditions", async () => {
                  await expect(
                    expectQuery({
                      $and: {
                        conditions: [
                          { equal: { age: 10 } },
                          {
                            $and: {
                              conditions: undefined as any,
                            },
                          },
                        ],
                      },
                    }).toFindNothing()
                  ).rejects.toThrow(
                    'Invalid body - "query.$and.conditions[1].$and.conditions" is required'
                  )
                })

              // onEmptyFilter cannot be sent to view searches
              !isView &&
                it("returns no rows when onEmptyFilter set to none", async () => {
                  await expectSearch({
                    query: {
                      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
                      $and: {
                        conditions: [{ equal: { name: "" } }],
                      },
                    },
                  }).toFindNothing()
                })

              it("returns all rows when onEmptyFilter set to all", async () => {
                await expectSearch({
                  query: {
                    onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                    $and: {
                      conditions: [{ equal: { name: "" } }],
                    },
                  },
                }).toHaveLength(4)
              })
            })

            describe("$or", () => {
              beforeAll(async () => {
                tableOrViewId = await createTableOrView({
                  age: { name: "age", type: FieldType.NUMBER },
                  name: { name: "name", type: FieldType.STRING },
                })
                await createRows([
                  { age: 1, name: "Jane" },
                  { age: 10, name: "Jack" },
                  { age: 7, name: "Hanna" },
                  { age: 8, name: "Jan" },
                ])
              })

              it("successfully finds a row for one level condition", async () => {
                await expectQuery({
                  $or: {
                    conditions: [
                      { equal: { age: 7 } },
                      { equal: { name: "Jack" } },
                    ],
                  },
                }).toContainExactly([
                  { age: 10, name: "Jack" },
                  { age: 7, name: "Hanna" },
                ])
              })

              it("successfully finds a row for one level with multiple conditions", async () => {
                await expectQuery({
                  $or: {
                    conditions: [
                      { equal: { age: 7 } },
                      { equal: { name: "Jack" } },
                    ],
                  },
                }).toContainExactly([
                  { age: 10, name: "Jack" },
                  { age: 7, name: "Hanna" },
                ])
              })

              it("successfully finds multiple rows for one level with multiple conditions", async () => {
                await expectQuery({
                  $or: {
                    conditions: [
                      { range: { age: { low: 1, high: 9 } } },
                      { string: { name: "Jan" } },
                    ],
                  },
                }).toContainExactly([
                  { age: 1, name: "Jane" },
                  { age: 7, name: "Hanna" },
                  { age: 8, name: "Jan" },
                ])
              })

              it("successfully finds rows for nested filters", async () => {
                await expectQuery({
                  $or: {
                    conditions: [
                      {
                        $or: {
                          conditions: [
                            {
                              range: { age: { low: 1, high: 7 } },
                            },
                            { string: { name: "Jan" } },
                          ],
                        },
                        equal: { name: "Jane" },
                      },
                    ],
                  },
                }).toContainExactly([
                  { age: 1, name: "Jane" },
                  { age: 7, name: "Hanna" },
                  { age: 8, name: "Jan" },
                ])
              })

              it("returns nothing when filtering out all data", async () => {
                await expectQuery({
                  $or: {
                    conditions: [
                      { equal: { age: 6 } },
                      { equal: { name: "John" } },
                    ],
                  },
                }).toFindNothing()
              })

              it("can nest $and under $or filters", async () => {
                await expectQuery({
                  $or: {
                    conditions: [
                      {
                        $and: {
                          conditions: [
                            {
                              range: { age: { low: 1, high: 8 } },
                            },
                            { equal: { name: "Jan" } },
                          ],
                        },
                        equal: { name: "Jane" },
                      },
                    ],
                  },
                }).toContainExactly([
                  { age: 1, name: "Jane" },
                  { age: 8, name: "Jan" },
                ])
              })

              it("can nest $or under $and filters", async () => {
                await expectQuery({
                  $and: {
                    conditions: [
                      {
                        $or: {
                          conditions: [
                            {
                              range: { age: { low: 1, high: 8 } },
                            },
                            { equal: { name: "Jan" } },
                          ],
                        },
                        equal: { name: "Jane" },
                      },
                    ],
                  },
                }).toContainExactly([{ age: 1, name: "Jane" }])
              })

              // onEmptyFilter cannot be sent to view searches
              !isView &&
                it("returns no rows when onEmptyFilter set to none", async () => {
                  await expectSearch({
                    query: {
                      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
                      $or: {
                        conditions: [{ equal: { name: "" } }],
                      },
                    },
                  }).toFindNothing()
                })

              it("returns all rows when onEmptyFilter set to all", async () => {
                await expectSearch({
                  query: {
                    onEmptyFilter: EmptyFilterOption.RETURN_ALL,
                    $or: {
                      conditions: [{ equal: { name: "" } }],
                    },
                  },
                }).toHaveLength(4)
              })
            })

            isSql &&
              describe("max related columns", () => {
                let relatedRows: Row[]

                beforeAll(async () => {
                  const relatedSchema: TableSchema = {}
                  const row: Row = {}
                  for (let i = 0; i < 100; i++) {
                    const name = `column${i}`
                    relatedSchema[name] = { name, type: FieldType.NUMBER }
                    row[name] = i
                  }
                  const relatedTable = await createTable(relatedSchema)
                  tableOrViewId = await createTableOrView({
                    name: { name: "name", type: FieldType.STRING },
                    related1: {
                      type: FieldType.LINK,
                      name: "related1",
                      fieldName: "main1",
                      tableId: relatedTable,
                      relationshipType: RelationshipType.MANY_TO_MANY,
                    },
                  })
                  relatedRows = await Promise.all([
                    config.api.row.save(relatedTable, row),
                  ])
                  await config.api.row.save(tableOrViewId, {
                    name: "foo",
                    related1: [relatedRows[0]._id],
                  })
                })

                it("retrieve the row with relationships", async () => {
                  await expectQuery({}).toContainExactly([
                    {
                      name: "foo",
                      related1: [{ _id: relatedRows[0]._id }],
                    },
                  ])
                })
              })

            !isInternal &&
              describe("SQL injection", () => {
                const badStrings = [
                  "1; DROP TABLE %table_name%;",
                  "1; DELETE FROM %table_name%;",
                  "1; UPDATE %table_name% SET name = 'foo';",
                  "1; INSERT INTO %table_name% (name) VALUES ('foo');",
                  "' OR '1'='1' --",
                  "'; DROP TABLE %table_name%; --",
                  "' OR 1=1 --",
                  "' UNION SELECT null, null, null; --",
                  "' AND (SELECT COUNT(*) FROM %table_name%) > 0 --",
                  "\"; EXEC xp_cmdshell('dir'); --",
                  "\"' OR 'a'='a",
                  "OR 1=1;",
                  "'; SHUTDOWN --",
                ]

                describe.each(badStrings)(
                  "bad string: %s",
                  badStringTemplate => {
                    // The SQL that knex generates when you try to use a double quote in a
                    // field name is always invalid and never works, so we skip it for these
                    // tests.
                    const skipFieldNameCheck =
                      isOracle && badStringTemplate.includes('"')

                    !skipFieldNameCheck &&
                      it("should not allow SQL injection as a field name", async () => {
                        const tableOrViewId = await createTableOrView()
                        const table = await getTable(tableOrViewId)
                        const badString = badStringTemplate.replace(
                          /%table_name%/g,
                          table.name
                        )

                        await config.api.table.save({
                          ...table,
                          schema: {
                            ...table.schema,
                            [badString]: {
                              name: badString,
                              type: FieldType.STRING,
                            },
                          },
                        })

                        if (docIds.isViewId(tableOrViewId)) {
                          const view = await config.api.viewV2.get(
                            tableOrViewId
                          )
                          await config.api.viewV2.update({
                            ...view,
                            schema: {
                              [badString]: { visible: true },
                            },
                          })
                        }

                        await config.api.row.save(tableOrViewId, {
                          [badString]: "foo",
                        })

                        await assertTableExists(table)
                        await assertTableNumRows(table, 1)

                        const { rows } = await config.api.row.search(
                          tableOrViewId,
                          { query: {} },
                          { status: 200 }
                        )

                        expect(rows).toHaveLength(1)

                        await assertTableExists(table)
                        await assertTableNumRows(table, 1)
                      })

                    it("should not allow SQL injection as a field value", async () => {
                      const tableOrViewId = await createTableOrView({
                        foo: {
                          name: "foo",
                          type: FieldType.STRING,
                        },
                      })
                      const table = await getTable(tableOrViewId)
                      const badString = badStringTemplate.replace(
                        /%table_name%/g,
                        table.name
                      )

                      await config.api.row.save(tableOrViewId, { foo: "foo" })

                      await assertTableExists(table)
                      await assertTableNumRows(table, 1)

                      const { rows } = await config.api.row.search(
                        tableOrViewId,
                        { query: { equal: { foo: badString } } },
                        { status: 200 }
                      )

                      expect(rows).toBeEmpty()
                      await assertTableExists(table)
                      await assertTableNumRows(table, 1)
                    })
                  }
                )
              })
          }
        )
      })
    }
  )
}
