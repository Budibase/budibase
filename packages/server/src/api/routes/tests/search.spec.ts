import { tableForDatasource } from "../../../tests/utilities/structures"
import {
  DatabaseName,
  getDatasource,
  knexClient,
} from "../../../integrations/tests/utils"
import {
  context,
  db as dbCore,
  MAX_VALID_DATE,
  MIN_VALID_DATE,
  SQLITE_DESIGN_DOC_ID,
  utils,
} from "@budibase/backend-core"

import * as setup from "./utilities"
import {
  AutoFieldSubType,
  BBReferenceFieldSubType,
  Datasource,
  EmptyFilterOption,
  FieldType,
  JsonFieldSubType,
  RelationshipType,
  Row,
  RowSearchParams,
  SearchFilters,
  SearchResponse,
  SortOrder,
  SortType,
  Table,
  TableSchema,
  User,
} from "@budibase/types"
import _ from "lodash"
import tk from "timekeeper"
import { encodeJSBinding } from "@budibase/string-templates"
import { dataFilters } from "@budibase/shared-core"
import { Knex } from "knex"
import { structures } from "@budibase/backend-core/tests"
import { DEFAULT_EMPLOYEE_TABLE_SCHEMA } from "../../../db/defaultData/datasource_bb_default"
import { generateRowIdField } from "../../../integrations/utils"

describe.each([
  ["in-memory", undefined],
  ["lucene", undefined],
  ["sqs", undefined],
  [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
  [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
  [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
  [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
  [DatabaseName.ORACLE, getDatasource(DatabaseName.ORACLE)],
])("search (%s)", (name, dsProvider) => {
  const isSqs = name === "sqs"
  const isLucene = name === "lucene"
  const isInMemory = name === "in-memory"
  const isInternal = isSqs || isLucene || isInMemory
  const isSql = !isInMemory && !isLucene
  const config = setup.getConfig()

  let envCleanup: (() => void) | undefined
  let datasource: Datasource | undefined
  let client: Knex | undefined
  let table: Table
  let rows: Row[]

  beforeAll(async () => {
    await config.withCoreEnv({ SQS_SEARCH_ENABLE: "true" }, () => config.init())
    if (isSqs) {
      envCleanup = config.setCoreEnv({
        SQS_SEARCH_ENABLE: "true",
        SQS_SEARCH_ENABLE_TENANTS: [config.getTenantId()],
      })
    }

    if (config.app?.appId) {
      config.app = await config.api.application.update(config.app?.appId, {
        snippets: [
          {
            name: "WeeksAgo",
            code: `return function (weeks) {\n  const currentTime = new Date(${Date.now()});\n  currentTime.setDate(currentTime.getDate()-(7 * (weeks || 1)));\n  return currentTime.toISOString();\n}`,
          },
        ],
      })
    }

    if (dsProvider) {
      const rawDatasource = await dsProvider
      client = await knexClient(rawDatasource)
      datasource = await config.createDatasource({
        datasource: rawDatasource,
      })
    }
  })

  afterAll(async () => {
    setup.afterAll()
    if (envCleanup) {
      envCleanup()
    }
  })

  async function createTable(schema: TableSchema, name?: string) {
    return await config.api.table.save(
      tableForDatasource(datasource, { schema, name })
    )
  }

  async function createRows(arr: Record<string, any>[]) {
    // Shuffling to avoid false positives given a fixed order
    await config.api.row.bulkImport(table._id!, {
      rows: _.shuffle(arr),
    })
    rows = await config.api.row.fetch(table._id!)
  }

  class SearchAssertion {
    constructor(private readonly query: RowSearchParams) {}

    private async performSearch(): Promise<SearchResponse<Row>> {
      if (isInMemory) {
        return dataFilters.search(_.cloneDeep(rows), this.query)
      } else {
        return config.api.row.search(this.query.tableId, this.query)
      }
    }

    // We originally used _.isMatch to compare rows, but found that when
    // comparing arrays it would return true if the source array was a subset of
    // the target array. This would sometimes create false matches. This
    // function is a more strict version of _.isMatch that only returns true if
    // the source array is an exact match of the target.
    //
    // _.isMatch("100", "1") also returns true which is not what we want.
    private isMatch<T extends Record<string, any>>(expected: T, found: T) {
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
      const row = foundRows.find(row => this.isMatch(expectedRow, row))
      if (!row) {
        const fields = Object.keys(expectedRow)
        // To make the error message more readable, we only include the fields
        // that are present in the expected row.
        const searchedObjects = foundRows.map(row => _.pick(row, fields))
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
      const foundRows = response.rows

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toHaveLength(expectedRows.length)
      // eslint-disable-next-line jest/no-standalone-expect
      expect([...foundRows]).toEqual(
        expectedRows.map((expectedRow: any) =>
          expect.objectContaining(this.popRow(expectedRow, foundRows))
        )
      )
      return response
    }

    // Asserts that the query returns rows matching exactly the set of rows
    // passed in. The order of the rows is not important, but extra rows will
    // cause the assertion to fail.
    async toContainExactly(expectedRows: any[]) {
      const response = await this.performSearch()
      const foundRows = response.rows

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toHaveLength(expectedRows.length)
      // eslint-disable-next-line jest/no-standalone-expect
      expect([...foundRows]).toEqual(
        expect.arrayContaining(
          expectedRows.map((expectedRow: any) =>
            expect.objectContaining(this.popRow(expectedRow, foundRows))
          )
        )
      )
      return response
    }

    // Asserts that the query returns some property values - this cannot be used
    // to check row values, however this shouldn't be important for checking properties
    // typing for this has to be any, Jest doesn't expose types for matchers like expect.any(...)
    async toMatch(properties: Record<string, any>) {
      const response = await this.performSearch()
      const keys = Object.keys(properties) as Array<keyof SearchResponse<Row>>
      for (let key of keys) {
        // eslint-disable-next-line jest/no-standalone-expect
        expect(response[key]).toBeDefined()
        if (properties[key]) {
          // eslint-disable-next-line jest/no-standalone-expect
          expect(response[key]).toEqual(properties[key])
        }
      }
      return response
    }

    // Asserts that the query doesn't return a property, e.g. pagination parameters.
    async toNotHaveProperty(properties: (keyof SearchResponse<Row>)[]) {
      const response = await this.performSearch()
      for (let property of properties) {
        // eslint-disable-next-line jest/no-standalone-expect
        expect(response[property]).toBeUndefined()
      }
      return response
    }

    // Asserts that the query returns rows matching the set of rows passed in.
    // The order of the rows is not important. Extra rows will not cause the
    // assertion to fail.
    async toContain(expectedRows: any[]) {
      const response = await this.performSearch()
      const foundRows = response.rows

      // eslint-disable-next-line jest/no-standalone-expect
      expect([...foundRows]).toEqual(
        expect.arrayContaining(
          expectedRows.map((expectedRow: any) =>
            expect.objectContaining(this.popRow(expectedRow, foundRows))
          )
        )
      )
      return response
    }

    async toFindNothing() {
      await this.toContainExactly([])
    }

    async toHaveLength(length: number) {
      const { rows: foundRows } = await this.performSearch()

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toHaveLength(length)
    }
  }

  function expectSearch(query: Omit<RowSearchParams, "tableId">) {
    return new SearchAssertion({ ...query, tableId: table._id! })
  }

  function expectQuery(query: SearchFilters) {
    return expectSearch({ query })
  }

  describe("boolean", () => {
    beforeAll(async () => {
      table = await createTable({
        isTrue: { name: "isTrue", type: FieldType.BOOLEAN },
      })
      await createRows([{ isTrue: true }, { isTrue: false }])
    })

    describe("equal", () => {
      it("successfully finds true row", async () => {
        await expectQuery({ equal: { isTrue: true } }).toMatchExactly([
          { isTrue: true },
        ])
      })

      it("successfully finds false row", async () => {
        await expectQuery({ equal: { isTrue: false } }).toMatchExactly([
          { isTrue: false },
        ])
      })
    })

    describe("notEqual", () => {
      it("successfully finds false row", async () => {
        await expectQuery({ notEqual: { isTrue: true } }).toContainExactly([
          { isTrue: false },
        ])
      })

      it("successfully finds true row", async () => {
        await expectQuery({ notEqual: { isTrue: false } }).toContainExactly([
          { isTrue: true },
        ])
      })
    })

    describe("oneOf", () => {
      it("successfully finds true row", async () => {
        await expectQuery({ oneOf: { isTrue: [true] } }).toContainExactly([
          { isTrue: true },
        ])
      })

      it("successfully finds false row", async () => {
        await expectQuery({ oneOf: { isTrue: [false] } }).toContainExactly([
          { isTrue: false },
        ])
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

  // We've decided not to try and support binding for in-memory search just now.
  !isInMemory &&
    describe("bindings", () => {
      let globalUsers: any = []

      const serverTime = new Date()

      // In MariaDB and MySQL we only store dates to second precision, so we need
      // to remove milliseconds from the server time to ensure searches work as
      // expected.
      serverTime.setMilliseconds(0)

      const future = new Date(serverTime.getTime() + 1000 * 60 * 60 * 24 * 30)

      const rows = (currentUser: User) => {
        return [
          { name: "foo", appointment: "1982-01-05T00:00:00.000Z" },
          { name: "bar", appointment: "1995-05-06T00:00:00.000Z" },
          { name: currentUser.firstName, appointment: future.toISOString() },
          { name: "serverDate", appointment: serverTime.toISOString() },
          {
            name: "single user, session user",
            single_user: JSON.stringify(currentUser),
          },
          {
            name: "single user",
            single_user: JSON.stringify(globalUsers[0]),
          },
          {
            name: "deprecated single user, session user",
            deprecated_single_user: JSON.stringify([currentUser]),
          },
          {
            name: "deprecated single user",
            deprecated_single_user: JSON.stringify([globalUsers[0]]),
          },
          {
            name: "multi user",
            multi_user: JSON.stringify(globalUsers),
          },
          {
            name: "multi user with session user",
            multi_user: JSON.stringify([...globalUsers, currentUser]),
          },
          {
            name: "deprecated multi user",
            deprecated_multi_user: JSON.stringify(globalUsers),
          },
          {
            name: "deprecated multi user with session user",
            deprecated_multi_user: JSON.stringify([
              ...globalUsers,
              currentUser,
            ]),
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

        table = await createTable({
          name: { name: "name", type: FieldType.STRING },
          appointment: { name: "appointment", type: FieldType.DATETIME },
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
            { name: "serverDate", appointment: serverTime.toISOString() },
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
          { name: "serverDate", appointment: serverTime.toISOString() },
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
        const allUsers = [...globalUsers, config.getUser()].map((user: any) => {
          return { _id: user._id }
        })

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
        const allUsers = [...globalUsers, config.getUser()].map((user: any) => {
          return { _id: user._id }
        })

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
          notContains: { deprecated_multi_user: ["{{ [user]._id }}"] },
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

  describe.each([FieldType.STRING, FieldType.LONGFORM])("%s", () => {
    beforeAll(async () => {
      table = await createTable({
        name: { name: "name", type: FieldType.STRING },
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
        await expectQuery({ equal: { name: "foo" } }).toContainExactly([
          { name: "foo" },
        ])
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
        await expectQuery({ notEqual: { name: "foo" } }).toContainExactly([
          { name: "bar" },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ notEqual: { name: "bar" } }).toContainExactly([
          { name: "foo" },
        ])
      })
    })

    describe("oneOf", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ oneOf: { name: ["foo"] } }).toContainExactly([
          { name: "foo" },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ oneOf: { name: ["none"] } }).toFindNothing()
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

      it("empty arrays returns all when onEmptyFilter is set to return 'none'", async () => {
        await expectQuery({
          onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          oneOf: { name: [] },
        }).toContainExactly([])
      })
    })

    describe("fuzzy", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ fuzzy: { name: "oo" } }).toContainExactly([
          { name: "foo" },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ fuzzy: { name: "none" } }).toFindNothing()
      })
    })

    describe("string", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ string: { name: "fo" } }).toContainExactly([
          { name: "foo" },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ string: { name: "none" } }).toFindNothing()
      })

      it("is case-insensitive", async () => {
        await expectQuery({ string: { name: "FO" } }).toContainExactly([
          { name: "foo" },
        ])
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

      !isLucene &&
        it("ignores low if it's an empty object", async () => {
          await expectQuery({
            // @ts-ignore
            range: { name: { low: {}, high: "z" } },
          }).toContainExactly([{ name: "foo" }, { name: "bar" }])
        })

      !isLucene &&
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
        await expectQuery({ notEmpty: { name: null } }).toContainExactly([
          { name: "foo" },
          { name: "bar" },
        ])
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

            table = resp.datasource.entities![tableName]

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
      table = await createTable({
        age: { name: "age", type: FieldType.NUMBER },
      })
      await createRows([{ age: 1 }, { age: 10 }])
    })

    describe("equal", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ equal: { age: 1 } }).toContainExactly([{ age: 1 }])
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
        await expectQuery({ notEqual: { age: 10 } }).toContainExactly([
          { age: 1 },
        ])
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

      // I couldn't find a way to make this work in Lucene and given that
      // we're getting rid of Lucene soon I wasn't inclined to spend time on
      // it.
      !isLucene &&
        it("can convert from a string", async () => {
          await expectQuery({
            oneOf: {
              // @ts-ignore
              age: "1",
            },
          }).toContainExactly([{ age: 1 }])
        })

      // I couldn't find a way to make this work in Lucene and given that
      // we're getting rid of Lucene soon I wasn't inclined to spend time on
      // it.
      !isLucene &&
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
      table = await createTable({
        dob: { name: "dob", type: FieldType.DATETIME },
      })

      await createRows([{ dob: JAN_1ST }, { dob: JAN_10TH }])
    })

    describe("equal", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ equal: { dob: JAN_1ST } }).toContainExactly([
          { dob: JAN_1ST },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ equal: { dob: JAN_2ND } }).toFindNothing()
      })
    })

    describe("notEqual", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ notEqual: { dob: JAN_1ST } }).toContainExactly([
          { dob: JAN_10TH },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ notEqual: { dob: JAN_10TH } }).toContainExactly([
          { dob: JAN_1ST },
        ])
      })
    })

    describe("oneOf", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ oneOf: { dob: [JAN_1ST] } }).toContainExactly([
          { dob: JAN_1ST },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ oneOf: { dob: [JAN_2ND] } }).toFindNothing()
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
          range: { dob: { low: JAN_10TH, high: MAX_VALID_DATE.toISOString() } },
        }).toContainExactly([{ dob: JAN_10TH }])
      })

      it("greater than", async () => {
        await expectQuery({
          range: { dob: { low: JAN_5TH, high: MAX_VALID_DATE.toISOString() } },
        }).toContainExactly([{ dob: JAN_10TH }])
      })

      it("less than equal to", async () => {
        await expectQuery({
          range: { dob: { high: JAN_1ST, low: MIN_VALID_DATE.toISOString() } },
        }).toContainExactly([{ dob: JAN_1ST }])
      })

      it("less than", async () => {
        await expectQuery({
          range: { dob: { high: JAN_5TH, low: MIN_VALID_DATE.toISOString() } },
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
        table = await createTable({
          timeid: { name: "timeid", type: FieldType.STRING },
          time: { name: "time", type: FieldType.DATETIME, timeOnly: true },
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
          await expectQuery({ equal: { time: T_1000 } }).toContainExactly([
            { time: "10:00:00" },
          ])
        })

        it("fails to find nonexistent row", async () => {
          await expectQuery({
            equal: { time: UNEXISTING_TIME },
          }).toFindNothing()
        })
      })

      describe("notEqual", () => {
        it("successfully finds a row", async () => {
          await expectQuery({ notEqual: { time: T_1000 } }).toContainExactly([
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
          await expectQuery({ oneOf: { time: [T_1000] } }).toContainExactly([
            { time: "10:00:00" },
          ])
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
            range: { time: { low: UNEXISTING_TIME, high: UNEXISTING_TIME } },
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

  describe.each([FieldType.ARRAY, FieldType.OPTIONS])("%s", () => {
    beforeAll(async () => {
      table = await createTable({
        numbers: {
          name: "numbers",
          type: FieldType.ARRAY,
          constraints: {
            type: JsonFieldSubType.ARRAY,
            inclusion: ["one", "two", "three"],
          },
        },
      })
      await createRows([{ numbers: ["one", "two"] }, { numbers: ["three"] }])
    })

    describe("contains", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ contains: { numbers: ["one"] } }).toContainExactly([
          { numbers: ["one", "two"] },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ contains: { numbers: ["none"] } }).toFindNothing()
      })

      it("fails to find row containing all", async () => {
        await expectQuery({
          contains: { numbers: ["one", "two", "three"] },
        }).toFindNothing()
      })

      it("finds all with empty list", async () => {
        await expectQuery({ contains: { numbers: [] } }).toContainExactly([
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
        await expectQuery({ notContains: { numbers: [] } }).toContainExactly([
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
        await expectQuery({ containsAny: { numbers: [] } }).toContainExactly([
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
      table = await createTable({
        num: { name: "num", type: FieldType.BIGINT },
      })
      await createRows([{ num: SMALL }, { num: MEDIUM }, { num: BIG }])
    })

    describe("equal", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ equal: { num: SMALL } }).toContainExactly([
          { num: SMALL },
        ])
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
        await expectQuery({ notEqual: { num: SMALL } }).toContainExactly([
          { num: MEDIUM },
          { num: BIG },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ notEqual: { num: 10 } }).toContainExactly([
          { num: SMALL },
          { num: MEDIUM },
          { num: BIG },
        ])
      })
    })

    describe("oneOf", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ oneOf: { num: [SMALL] } }).toContainExactly([
          { num: SMALL },
        ])
      })

      it("successfully finds all rows", async () => {
        await expectQuery({
          oneOf: { num: [SMALL, MEDIUM, BIG] },
        }).toContainExactly([{ num: SMALL }, { num: MEDIUM }, { num: BIG }])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ oneOf: { num: [2] } }).toFindNothing()
      })
    })

    // Range searches against bigints don't seem to work at all in Lucene, and I
    // couldn't figure out why. Given that we're replacing Lucene with SQS,
    // we've decided not to spend time on it.
    !isLucene &&
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
        table = await createTable({
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
          await expectQuery({ notEqual: { auto: 1 } }).toContainExactly([
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
          await expectQuery({ notEqual: { auto: 0 } }).toContainExactly([
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
          await expectQuery({ oneOf: { auto: [1] } }).toContainExactly([
            { auto: 1 },
          ])
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

        isSqs &&
          it("can search using just a low value", async () => {
            await expectQuery({
              range: { auto: { low: 9 } },
            }).toContainExactly([{ auto: 9 }, { auto: 10 }])
          })

        isSqs &&
          it("can search using just a high value", async () => {
            await expectQuery({
              range: { auto: { high: 2 } },
            }).toContainExactly([{ auto: 1 }, { auto: 2 }])
          })
      })

      isSqs &&
        describe("sort", () => {
          it("sorts ascending", async () => {
            await expectSearch({
              query: {},
              sort: "auto",
              sortOrder: SortOrder.ASCENDING,
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
              table._id!,
              {
                tableId: table._id!,
                query: {},
              }
            )

            // repeat the search many times to check the first row is always the same
            let bookmark: string | number | undefined,
              hasNextPage: boolean | undefined = true,
              rowCount: number = 0
            do {
              const response = await config.api.row.search(table._id!, {
                tableId: table._id!,
                limit: 1,
                paginate: true,
                query: {},
                bookmark,
              })
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

          // eslint-disable-next-line no-constant-condition
          while (true) {
            const response = await config.api.row.search(table._id!, {
              tableId: table._id!,
              limit: 3,
              query: {},
              bookmark,
              paginate: true,
            })

            rows.push(...response.rows)

            if (!response.bookmark || !response.hasNextPage) {
              break
            }
            bookmark = response.bookmark
          }

          const autoValues = rows.map(row => row.auto).sort((a, b) => a - b)
          expect(autoValues).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        })
      })
    })

  describe("field name 1:name", () => {
    beforeAll(async () => {
      table = await createTable({
        "1:name": { name: "1:name", type: FieldType.STRING },
      })
      await createRows([{ "1:name": "bar" }, { "1:name": "foo" }])
    })

    it("successfully finds a row", async () => {
      await expectQuery({ equal: { "1:1:name": "bar" } }).toContainExactly([
        { "1:name": "bar" },
      ])
    })

    it("fails to find nonexistent row", async () => {
      await expectQuery({ equal: { "1:1:name": "none" } }).toFindNothing()
    })
  })

  describe("user", () => {
    let user1: User
    let user2: User

    beforeAll(async () => {
      user1 = await config.createUser({ _id: `us_${utils.newid()}` })
      user2 = await config.createUser({ _id: `us_${utils.newid()}` })

      table = await createTable({
        user: {
          name: "user",
          type: FieldType.BB_REFERENCE_SINGLE,
          subtype: BBReferenceFieldSubType.USER,
        },
      })

      await createRows([
        { user: JSON.stringify(user1) },
        { user: JSON.stringify(user2) },
        { user: null },
      ])
    })

    describe("equal", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ equal: { user: user1._id } }).toContainExactly([
          { user: { _id: user1._id } },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ equal: { user: "us_none" } }).toFindNothing()
      })
    })

    describe("notEqual", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ notEqual: { user: user1._id } }).toContainExactly([
          { user: { _id: user2._id } },
          {},
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ notEqual: { user: "us_none" } }).toContainExactly([
          { user: { _id: user1._id } },
          { user: { _id: user2._id } },
          {},
        ])
      })
    })

    describe("oneOf", () => {
      it("successfully finds a row", async () => {
        await expectQuery({ oneOf: { user: [user1._id] } }).toContainExactly([
          { user: { _id: user1._id } },
        ])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({ oneOf: { user: ["us_none"] } }).toFindNothing()
      })
    })

    describe("empty", () => {
      it("finds empty rows", async () => {
        await expectQuery({ empty: { user: null } }).toContainExactly([{}])
      })
    })

    describe("notEmpty", () => {
      it("finds non-empty rows", async () => {
        await expectQuery({ notEmpty: { user: null } }).toContainExactly([
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

      table = await createTable({
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
        { number: 1, users: JSON.stringify([user1]) },
        { number: 2, users: JSON.stringify([user2]) },
        { number: 3, users: JSON.stringify([user1, user2]) },
        { number: 4, users: JSON.stringify([]) },
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
        await expectQuery({ contains: { users: ["us_none"] } }).toFindNothing()
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
        }).toContainExactly([{ users: [{ _id: user1._id }], number: 1 }])
      })

      it("fails to find nonexistent row", async () => {
        await expectQuery({
          equal: { number: 2 },
          contains: { users: [user1._id] },
        }).toFindNothing()
      })
    })
  })

  // This will never work for Lucene.
  !isLucene &&
    // It also can't work for in-memory searching because the related table name
    // isn't available.
    !isInMemory &&
    describe("relations", () => {
      let productCategoryTable: Table, productCatRows: Row[]

      beforeAll(async () => {
        productCategoryTable = await createTable(
          {
            name: { name: "name", type: FieldType.STRING },
          },
          "productCategory"
        )
        table = await createTable(
          {
            name: { name: "name", type: FieldType.STRING },
            productCat: {
              type: FieldType.LINK,
              relationshipType: RelationshipType.ONE_TO_MANY,
              name: "productCat",
              fieldName: "product",
              tableId: productCategoryTable._id!,
              constraints: {
                type: "array",
              },
            },
          },
          "product"
        )

        productCatRows = await Promise.all([
          config.api.row.save(productCategoryTable._id!, { name: "foo" }),
          config.api.row.save(productCategoryTable._id!, { name: "bar" }),
        ])

        await Promise.all([
          config.api.row.save(table._id!, {
            name: "foo",
            productCat: [productCatRows[0]._id],
          }),
          config.api.row.save(table._id!, {
            name: "bar",
            productCat: [productCatRows[1]._id],
          }),
          config.api.row.save(table._id!, {
            name: "baz",
            productCat: [],
          }),
        ])
      })

      it("should be able to filter by relationship using column name", async () => {
        await expectQuery({
          equal: { ["productCat.name"]: "foo" },
        }).toContainExactly([
          { name: "foo", productCat: [{ _id: productCatRows[0]._id }] },
        ])
      })

      it("should be able to filter by relationship using table name", async () => {
        await expectQuery({
          equal: { ["productCategory.name"]: "foo" },
        }).toContainExactly([
          { name: "foo", productCat: [{ _id: productCatRows[0]._id }] },
        ])
      })

      it("shouldn't return any relationship for last row", async () => {
        await expectQuery({
          equal: { ["name"]: "baz" },
        }).toContainExactly([{ name: "baz", productCat: undefined }])
      })
    })
  ;(isSqs || isLucene) &&
    describe("relations to same table", () => {
      let relatedTable: Table, relatedRows: Row[]

      beforeAll(async () => {
        relatedTable = await createTable(
          {
            name: { name: "name", type: FieldType.STRING },
          },
          "productCategory"
        )
        table = await createTable({
          name: { name: "name", type: FieldType.STRING },
          related1: {
            type: FieldType.LINK,
            name: "related1",
            fieldName: "main1",
            tableId: relatedTable._id!,
            relationshipType: RelationshipType.MANY_TO_MANY,
          },
          related2: {
            type: FieldType.LINK,
            name: "related2",
            fieldName: "main2",
            tableId: relatedTable._id!,
            relationshipType: RelationshipType.MANY_TO_MANY,
          },
        })
        relatedRows = await Promise.all([
          config.api.row.save(relatedTable._id!, { name: "foo" }),
          config.api.row.save(relatedTable._id!, { name: "bar" }),
          config.api.row.save(relatedTable._id!, { name: "baz" }),
          config.api.row.save(relatedTable._id!, { name: "boo" }),
        ])
        await Promise.all([
          config.api.row.save(table._id!, {
            name: "test",
            related1: [relatedRows[0]._id!],
            related2: [relatedRows[1]._id!],
          }),
          config.api.row.save(table._id!, {
            name: "test2",
            related1: [relatedRows[2]._id!],
            related2: [relatedRows[3]._id!],
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
        ])
      })

      isSqs &&
        it("should be able to filter down to second row with equal", async () => {
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

      isSqs &&
        it("should be able to filter down to first row with not equal", async () => {
          await expectSearch({
            query: {
              notEqual: {
                ["1:related2.name"]: "bar",
                ["2:related2.name"]: "baz",
                ["3:related2.name"]: "boo",
              },
            },
          }).toContainExactly([
            {
              name: "test",
              related1: [{ _id: relatedRows[0]._id }],
            },
          ])
        })
    })

  isInternal &&
    describe("no column error backwards compat", () => {
      beforeAll(async () => {
        table = await createTable({
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

  // lucene can't count the total rows
  !isLucene &&
    describe("row counting", () => {
      beforeAll(async () => {
        table = await createTable({
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
      table = await createTable({
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

  describe.each(["data_name_test", "name_data_test", "name_test_data_"])(
    "special (%s) case",
    column => {
      beforeAll(async () => {
        table = await createTable({
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
    }
  )

  isInternal &&
    describe("sample data", () => {
      beforeAll(async () => {
        await config.api.application.addSampleData(config.appId!)
        table = DEFAULT_EMPLOYEE_TABLE_SCHEMA
        rows = await config.api.row.fetch(table._id!)
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
    { low: "2024-07-03T00:00:00.000Z", high: "9999-00-00T00:00:00.000Z" },
    { low: "2024-07-03T00:00:00.000Z", high: "9998-00-00T00:00:00.000Z" },
    { low: "0000-00-00T00:00:00.000Z", high: "2024-07-04T00:00:00.000Z" },
    { low: "0001-00-00T00:00:00.000Z", high: "2024-07-04T00:00:00.000Z" },
  ])("date special cases", ({ low, high }) => {
    const earlyDate = "2024-07-03T10:00:00.000Z",
      laterDate = "2024-07-03T11:00:00.000Z"
    beforeAll(async () => {
      table = await createTable({
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
      table = await createTable({
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
        table = await createTable({
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

  // This was never actually supported in Lucene but SQS does support it, so may
  // as well have a test for it.
  ;(isSqs || isInMemory) &&
    describe("space at start of column name", () => {
      beforeAll(async () => {
        table = await createTable({
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

  isSqs &&
    describe("duplicate columns", () => {
      beforeAll(async () => {
        table = await createTable({
          name: {
            name: "name",
            type: FieldType.STRING,
          },
        })
        await context.doInAppContext(config.getAppId(), async () => {
          const db = context.getAppDB()
          const tableDoc = await db.get<Table>(table._id!)
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
        table = await createTable({
          name: {
            name: "name",
            type: FieldType.STRING,
          },
          rel: {
            name: "rel",
            type: FieldType.LINK,
            relationshipType: RelationshipType.MANY_TO_MANY,
            tableId: toRelateTable._id!,
            fieldName: "rel",
          },
        })
        const [row1, row2] = await Promise.all([
          config.api.row.save(toRelateTable._id!, { name: "tag 1" }),
          config.api.row.save(toRelateTable._id!, { name: "tag 2" }),
        ])
        row = await config.api.row.save(table._id!, {
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
        table = await config.api.table.save(
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
    describe("pagination edge case with relationships", () => {
      let mainRows: Row[] = []

      beforeAll(async () => {
        const toRelateTable = await createTable({
          name: {
            name: "name",
            type: FieldType.STRING,
          },
        })
        table = await createTable({
          name: {
            name: "name",
            type: FieldType.STRING,
          },
          rel: {
            name: "rel",
            type: FieldType.LINK,
            relationshipType: RelationshipType.MANY_TO_ONE,
            tableId: toRelateTable._id!,
            fieldName: "rel",
          },
        })
        const relatedRows = await Promise.all([
          config.api.row.save(toRelateTable._id!, { name: "tag 1" }),
          config.api.row.save(toRelateTable._id!, { name: "tag 2" }),
          config.api.row.save(toRelateTable._id!, { name: "tag 3" }),
          config.api.row.save(toRelateTable._id!, { name: "tag 4" }),
          config.api.row.save(toRelateTable._id!, { name: "tag 5" }),
          config.api.row.save(toRelateTable._id!, { name: "tag 6" }),
        ])
        mainRows = await Promise.all([
          config.api.row.save(table._id!, {
            name: "product 1",
            rel: relatedRows.map(row => row._id),
          }),
          config.api.row.save(table._id!, {
            name: "product 2",
            rel: [],
          }),
          config.api.row.save(table._id!, {
            name: "product 3",
            rel: [],
          }),
        ])
      })

      it("can still page when the hard limit is hit", async () => {
        await config.withCoreEnv(
          {
            SQL_MAX_ROWS: "6",
          },
          async () => {
            const params: Omit<RowSearchParams, "tableId"> = {
              query: {},
              paginate: true,
              limit: 3,
              sort: "name",
              sortType: SortType.STRING,
              sortOrder: SortOrder.ASCENDING,
            }
            const page1 = await expectSearch(params).toContain([mainRows[0]])
            expect(page1.hasNextPage).toBe(true)
            expect(page1.bookmark).toBeDefined()
            const page2 = await expectSearch({
              ...params,
              bookmark: page1.bookmark,
            }).toContain([mainRows[1], mainRows[2]])
            expect(page2.hasNextPage).toBe(false)
          }
        )
      })
    })

  !isLucene &&
    describe("$and", () => {
      beforeAll(async () => {
        table = await createTable({
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
            conditions: [{ equal: { age: 10 } }, { equal: { name: "Jack" } }],
          },
        }).toContainExactly([{ age: 10, name: "Jack" }])
      })

      it("successfully finds a row for one level with multiple conditions", async () => {
        await expectQuery({
          $and: {
            conditions: [{ equal: { age: 10 } }, { equal: { name: "Jack" } }],
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
            conditions: [{ equal: { age: 7 } }, { equal: { name: "Jack" } }],
          },
        }).toFindNothing()
      })

      !isInMemory &&
        it("validates conditions that are not objects", async () => {
          await expect(
            expectQuery({
              $and: {
                conditions: [{ equal: { age: 10 } }, "invalidCondition" as any],
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
    })

  !isLucene &&
    describe("$or", () => {
      beforeAll(async () => {
        table = await createTable({
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
            conditions: [{ equal: { age: 7 } }, { equal: { name: "Jack" } }],
          },
        }).toContainExactly([
          { age: 10, name: "Jack" },
          { age: 7, name: "Hanna" },
        ])
      })

      it("successfully finds a row for one level with multiple conditions", async () => {
        await expectQuery({
          $or: {
            conditions: [{ equal: { age: 7 } }, { equal: { name: "Jack" } }],
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
            conditions: [{ equal: { age: 6 } }, { equal: { name: "John" } }],
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
    })
})
