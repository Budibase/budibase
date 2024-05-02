import { tableForDatasource } from "../../../tests/utilities/structures"
import { DatabaseName, getDatasource } from "../../../integrations/tests/utils"
import { db as dbCore } from "@budibase/backend-core"

import * as setup from "./utilities"
import {
  AutoFieldSubType,
  Datasource,
  EmptyFilterOption,
  BBReferenceFieldSubType,
  FieldType,
  RowSearchParams,
  SearchFilters,
  SortOrder,
  SortType,
  Table,
  TableSchema,
  User,
} from "@budibase/types"
import _ from "lodash"
import tk from "timekeeper"
import { encodeJSBinding } from "@budibase/string-templates"

const serverTime = new Date("2024-05-06T00:00:00.000Z")
tk.freeze(serverTime)

jest.unmock("mssql")

describe.each([
  ["lucene", undefined],
  ["sqs", undefined],
  [DatabaseName.POSTGRES, getDatasource(DatabaseName.POSTGRES)],
  [DatabaseName.MYSQL, getDatasource(DatabaseName.MYSQL)],
  [DatabaseName.SQL_SERVER, getDatasource(DatabaseName.SQL_SERVER)],
  [DatabaseName.MARIADB, getDatasource(DatabaseName.MARIADB)],
])("/api/:sourceId/search (%s)", (name, dsProvider) => {
  const isSqs = name === "sqs"
  const isLucene = name === "lucene"
  const isInternal = isSqs || isLucene
  const config = setup.getConfig()

  let envCleanup: (() => void) | undefined
  let datasource: Datasource | undefined
  let table: Table

  const snippets = [
    {
      name: "WeeksAgo",
      code: "return function (weeks) {\n  const currentTime = new Date();\n  currentTime.setDate(currentTime.getDate()-(7 * (weeks || 1)));\n  return currentTime.toISOString();\n}",
    },
  ]

  beforeAll(async () => {
    if (isSqs) {
      envCleanup = config.setEnv({ SQS_SEARCH_ENABLE: "true" })
    }
    await config.init({ snippets })
    if (dsProvider) {
      datasource = await config.createDatasource({
        datasource: await dsProvider,
      })
    }
  })

  afterAll(async () => {
    setup.afterAll()
    if (envCleanup) {
      envCleanup()
    }
  })

  async function createTable(schema: TableSchema) {
    table = await config.api.table.save(
      tableForDatasource(datasource, { schema })
    )
  }

  async function createRows(rows: Record<string, any>[]) {
    await config.api.row.bulkImport(table._id!, { rows })
  }

  class SearchAssertion {
    constructor(private readonly query: RowSearchParams) {}

    // Asserts that the query returns rows matching exactly the set of rows
    // passed in. The order of the rows matters. Rows returned in an order
    // different to the one passed in will cause the assertion to fail.  Extra
    // rows returned by the query will also cause the assertion to fail.
    async toMatchExactly(expectedRows: any[]) {
      const { rows: foundRows } = await config.api.row.search(table._id!, {
        ...this.query,
        tableId: table._id!,
      })

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toHaveLength(expectedRows.length)
      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toEqual(
        expectedRows.map((expectedRow: any) =>
          expect.objectContaining(
            foundRows.find(foundRow => _.isMatch(foundRow, expectedRow))
          )
        )
      )
    }

    // Asserts that the query returns rows matching exactly the set of rows
    // passed in. The order of the rows is not important, but extra rows will
    // cause the assertion to fail.
    async toContainExactly(expectedRows: any[]) {
      const { rows: foundRows } = await config.api.row.search(table._id!, {
        ...this.query,
        tableId: table._id!,
      })

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toHaveLength(expectedRows.length)
      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toEqual(
        expect.arrayContaining(
          expectedRows.map((expectedRow: any) =>
            expect.objectContaining(
              foundRows.find(foundRow => _.isMatch(foundRow, expectedRow))
            )
          )
        )
      )
    }

    // Asserts that the query returns rows matching the set of rows passed in.
    // The order of the rows is not important. Extra rows will not cause the
    // assertion to fail.
    async toContain(expectedRows: any[]) {
      const { rows: foundRows } = await config.api.row.search(table._id!, {
        ...this.query,
        tableId: table._id!,
      })

      // eslint-disable-next-line jest/no-standalone-expect
      expect(foundRows).toEqual(
        expect.arrayContaining(
          expectedRows.map((expectedRow: any) =>
            expect.objectContaining(
              foundRows.find(foundRow => _.isMatch(foundRow, expectedRow))
            )
          )
        )
      )
    }

    async toFindNothing() {
      await this.toContainExactly([])
    }

    async toHaveLength(length: number) {
      const { rows: foundRows } = await config.api.row.search(table._id!, {
        ...this.query,
        tableId: table._id!,
      })

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

  // Ensure all bindings resolve and perform as expected
  !isSqs &&
    describe("bindings", () => {
      let globalUsers: any = []

      const future = new Date(serverTime.getTime())
      future.setDate(future.getDate() + 30)

      const rows = (currentUser: User) => {
        return [
          { name: "foo", appointment: "1982-01-05T00:00:00.000Z" },
          { name: "bar", appointment: "1995-05-06T00:00:00.000Z" },
          { name: currentUser.firstName, appointment: future.toISOString() },
          { name: "serverDate", appointment: serverTime.toISOString() },
          {
            name: "single user, session user",
            single_user: JSON.stringify([currentUser]),
          },
          {
            name: "single user",
            single_user: JSON.stringify([globalUsers[0]]),
          },
          {
            name: "multi user",
            multi_user: JSON.stringify(globalUsers),
          },
          {
            name: "multi user with session user",
            multi_user: JSON.stringify([...globalUsers, currentUser]),
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

        await createTable({
          name: { name: "name", type: FieldType.STRING },
          appointment: { name: "appointment", type: FieldType.DATETIME },
          single_user: {
            name: "single_user",
            type: FieldType.BB_REFERENCE,
            subtype: BBReferenceFieldSubType.USER,
          },
          multi_user: {
            name: "multi_user",
            type: FieldType.BB_REFERENCE,
            subtype: BBReferenceFieldSubType.USERS,
          },
        })
        await createRows([...rows(config.getUser())])
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
        const jsBinding =
          "const currentTime = new Date()\ncurrentTime.setDate(currentTime.getDate()-14);\nreturn currentTime.toISOString();"
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
            single_user: [{ _id: config.getUser()._id }],
          },
        ])
      })

      it("should match the session user id in a multi user field", async () => {
        await expectQuery({
          contains: { multi_user: ["{{ [user]._id }}"] },
        }).toContainExactly([
          {
            name: "multi user with session user",
            multi_user: [{ _id: config.getUser()._id }],
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
            single_user: [{ _id: config.getUser()._id }],
          },
          {
            name: "single user",
            single_user: [{ _id: globalUsers[0]._id }],
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
            single_user: [{ _id: globalUsers[0]._id }],
          },
        ])
      })
    })

  describe("strings", () => {
    beforeAll(async () => {
      await createTable({
        name: { name: "name", type: FieldType.STRING },
      })
      await createRows([{ name: "foo" }, { name: "bar" }])
    })

    describe("misc", () => {
      it("should return all if no query is passed", () =>
        expectSearch({} as RowSearchParams).toContainExactly([
          { name: "foo" },
          { name: "bar" },
        ]))

      it("should return all if empty query is passed", () =>
        expectQuery({}).toContainExactly([{ name: "foo" }, { name: "bar" }]))

      it("should return all if onEmptyFilter is RETURN_ALL", () =>
        expectQuery({
          onEmptyFilter: EmptyFilterOption.RETURN_ALL,
        }).toContainExactly([{ name: "foo" }, { name: "bar" }]))

      it("should return nothing if onEmptyFilter is RETURN_NONE", () =>
        expectQuery({
          onEmptyFilter: EmptyFilterOption.RETURN_NONE,
        }).toFindNothing())

      it("should respect limit", () =>
        expectSearch({ limit: 1, paginate: true, query: {} }).toHaveLength(1))
    })

    describe("equal", () => {
      it("successfully finds a row", () =>
        expectQuery({ equal: { name: "foo" } }).toContainExactly([
          { name: "foo" },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ equal: { name: "none" } }).toFindNothing())
    })

    describe("notEqual", () => {
      it("successfully finds a row", () =>
        expectQuery({ notEqual: { name: "foo" } }).toContainExactly([
          { name: "bar" },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ notEqual: { name: "bar" } }).toContainExactly([
          { name: "foo" },
        ]))
    })

    describe("oneOf", () => {
      it("successfully finds a row", () =>
        expectQuery({ oneOf: { name: ["foo"] } }).toContainExactly([
          { name: "foo" },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ oneOf: { name: ["none"] } }).toFindNothing())
    })

    describe("fuzzy", () => {
      it("successfully finds a row", () =>
        expectQuery({ fuzzy: { name: "oo" } }).toContainExactly([
          { name: "foo" },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ fuzzy: { name: "none" } }).toFindNothing())
    })

    describe("range", () => {
      it("successfully finds multiple rows", () =>
        expectQuery({
          range: { name: { low: "a", high: "z" } },
        }).toContainExactly([{ name: "bar" }, { name: "foo" }]))

      it("successfully finds a row with a high bound", () =>
        expectQuery({
          range: { name: { low: "a", high: "c" } },
        }).toContainExactly([{ name: "bar" }]))

      it("successfully finds a row with a low bound", () =>
        expectQuery({
          range: { name: { low: "f", high: "z" } },
        }).toContainExactly([{ name: "foo" }]))

      it("successfully finds no rows", () =>
        expectQuery({
          range: { name: { low: "g", high: "h" } },
        }).toFindNothing())
    })

    describe("sort", () => {
      it("sorts ascending", () =>
        expectSearch({
          query: {},
          sort: "name",
          sortOrder: SortOrder.ASCENDING,
        }).toMatchExactly([{ name: "bar" }, { name: "foo" }]))

      it("sorts descending", () =>
        expectSearch({
          query: {},
          sort: "name",
          sortOrder: SortOrder.DESCENDING,
        }).toMatchExactly([{ name: "foo" }, { name: "bar" }]))

      describe("sortType STRING", () => {
        it("sorts ascending", () =>
          expectSearch({
            query: {},
            sort: "name",
            sortType: SortType.STRING,
            sortOrder: SortOrder.ASCENDING,
          }).toMatchExactly([{ name: "bar" }, { name: "foo" }]))

        it("sorts descending", () =>
          expectSearch({
            query: {},
            sort: "name",
            sortType: SortType.STRING,
            sortOrder: SortOrder.DESCENDING,
          }).toMatchExactly([{ name: "foo" }, { name: "bar" }]))
      })
    })
  })

  describe("numbers", () => {
    beforeAll(async () => {
      await createTable({
        age: { name: "age", type: FieldType.NUMBER },
      })
      await createRows([{ age: 1 }, { age: 10 }])
    })

    describe("equal", () => {
      it("successfully finds a row", () =>
        expectQuery({ equal: { age: 1 } }).toContainExactly([{ age: 1 }]))

      it("fails to find nonexistent row", () =>
        expectQuery({ equal: { age: 2 } }).toFindNothing())
    })

    describe("notEqual", () => {
      it("successfully finds a row", () =>
        expectQuery({ notEqual: { age: 1 } }).toContainExactly([{ age: 10 }]))

      it("fails to find nonexistent row", () =>
        expectQuery({ notEqual: { age: 10 } }).toContainExactly([{ age: 1 }]))
    })

    describe("oneOf", () => {
      it("successfully finds a row", () =>
        expectQuery({ oneOf: { age: [1] } }).toContainExactly([{ age: 1 }]))

      it("fails to find nonexistent row", () =>
        expectQuery({ oneOf: { age: [2] } }).toFindNothing())
    })

    describe("range", () => {
      it("successfully finds a row", () =>
        expectQuery({
          range: { age: { low: 1, high: 5 } },
        }).toContainExactly([{ age: 1 }]))

      it("successfully finds multiple rows", () =>
        expectQuery({
          range: { age: { low: 1, high: 10 } },
        }).toContainExactly([{ age: 1 }, { age: 10 }]))

      it("successfully finds a row with a high bound", () =>
        expectQuery({
          range: { age: { low: 5, high: 10 } },
        }).toContainExactly([{ age: 10 }]))

      it("successfully finds no rows", () =>
        expectQuery({
          range: { age: { low: 5, high: 9 } },
        }).toFindNothing())

      // We never implemented half-open ranges in Lucene.
      !isLucene &&
        it("can search using just a low value", () =>
          expectQuery({
            range: { age: { low: 5 } },
          }).toContainExactly([{ age: 10 }]))

      // We never implemented half-open ranges in Lucene.
      !isLucene &&
        it("can search using just a high value", () =>
          expectQuery({
            range: { age: { high: 5 } },
          }).toContainExactly([{ age: 1 }]))
    })

    describe("sort", () => {
      it("sorts ascending", () =>
        expectSearch({
          query: {},
          sort: "age",
          sortOrder: SortOrder.ASCENDING,
        }).toMatchExactly([{ age: 1 }, { age: 10 }]))

      it("sorts descending", () =>
        expectSearch({
          query: {},
          sort: "age",
          sortOrder: SortOrder.DESCENDING,
        }).toMatchExactly([{ age: 10 }, { age: 1 }]))
    })

    describe("sortType NUMBER", () => {
      it("sorts ascending", () =>
        expectSearch({
          query: {},
          sort: "age",
          sortType: SortType.NUMBER,
          sortOrder: SortOrder.ASCENDING,
        }).toMatchExactly([{ age: 1 }, { age: 10 }]))

      it("sorts descending", () =>
        expectSearch({
          query: {},
          sort: "age",
          sortType: SortType.NUMBER,
          sortOrder: SortOrder.DESCENDING,
        }).toMatchExactly([{ age: 10 }, { age: 1 }]))
    })
  })

  describe("dates", () => {
    const JAN_1ST = "2020-01-01T00:00:00.000Z"
    const JAN_2ND = "2020-01-02T00:00:00.000Z"
    const JAN_5TH = "2020-01-05T00:00:00.000Z"
    const JAN_9TH = "2020-01-09T00:00:00.000Z"
    const JAN_10TH = "2020-01-10T00:00:00.000Z"

    beforeAll(async () => {
      await createTable({
        dob: { name: "dob", type: FieldType.DATETIME },
      })

      await createRows([{ dob: JAN_1ST }, { dob: JAN_10TH }])
    })

    describe("equal", () => {
      it("successfully finds a row", () =>
        expectQuery({ equal: { dob: JAN_1ST } }).toContainExactly([
          { dob: JAN_1ST },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ equal: { dob: JAN_2ND } }).toFindNothing())
    })

    describe("notEqual", () => {
      it("successfully finds a row", () =>
        expectQuery({ notEqual: { dob: JAN_1ST } }).toContainExactly([
          { dob: JAN_10TH },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ notEqual: { dob: JAN_10TH } }).toContainExactly([
          { dob: JAN_1ST },
        ]))
    })

    describe("oneOf", () => {
      it("successfully finds a row", () =>
        expectQuery({ oneOf: { dob: [JAN_1ST] } }).toContainExactly([
          { dob: JAN_1ST },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ oneOf: { dob: [JAN_2ND] } }).toFindNothing())
    })

    describe("range", () => {
      it("successfully finds a row", () =>
        expectQuery({
          range: { dob: { low: JAN_1ST, high: JAN_5TH } },
        }).toContainExactly([{ dob: JAN_1ST }]))

      it("successfully finds multiple rows", () =>
        expectQuery({
          range: { dob: { low: JAN_1ST, high: JAN_10TH } },
        }).toContainExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }]))

      it("successfully finds a row with a high bound", () =>
        expectQuery({
          range: { dob: { low: JAN_5TH, high: JAN_10TH } },
        }).toContainExactly([{ dob: JAN_10TH }]))

      it("successfully finds no rows", () =>
        expectQuery({
          range: { dob: { low: JAN_5TH, high: JAN_9TH } },
        }).toFindNothing())

      // We never implemented half-open ranges in Lucene.
      !isLucene &&
        it("can search using just a low value", () =>
          expectQuery({
            range: { dob: { low: JAN_5TH } },
          }).toContainExactly([{ dob: JAN_10TH }]))

      // We never implemented half-open ranges in Lucene.
      !isLucene &&
        it("can search using just a high value", () =>
          expectQuery({
            range: { dob: { high: JAN_5TH } },
          }).toContainExactly([{ dob: JAN_1ST }]))
    })

    describe("sort", () => {
      it("sorts ascending", () =>
        expectSearch({
          query: {},
          sort: "dob",
          sortOrder: SortOrder.ASCENDING,
        }).toMatchExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }]))

      it("sorts descending", () =>
        expectSearch({
          query: {},
          sort: "dob",
          sortOrder: SortOrder.DESCENDING,
        }).toMatchExactly([{ dob: JAN_10TH }, { dob: JAN_1ST }]))

      describe("sortType STRING", () => {
        it("sorts ascending", () =>
          expectSearch({
            query: {},
            sort: "dob",
            sortType: SortType.STRING,
            sortOrder: SortOrder.ASCENDING,
          }).toMatchExactly([{ dob: JAN_1ST }, { dob: JAN_10TH }]))

        it("sorts descending", () =>
          expectSearch({
            query: {},
            sort: "dob",
            sortType: SortType.STRING,
            sortOrder: SortOrder.DESCENDING,
          }).toMatchExactly([{ dob: JAN_10TH }, { dob: JAN_1ST }]))
      })
    })
  })

  describe("array of strings", () => {
    beforeAll(async () => {
      await createTable({
        numbers: {
          name: "numbers",
          type: FieldType.ARRAY,
          constraints: { inclusion: ["one", "two", "three"] },
        },
      })
      await createRows([{ numbers: ["one", "two"] }, { numbers: ["three"] }])
    })

    describe("contains", () => {
      it("successfully finds a row", () =>
        expectQuery({ contains: { numbers: ["one"] } }).toContainExactly([
          { numbers: ["one", "two"] },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ contains: { numbers: ["none"] } }).toFindNothing())

      it("fails to find row containing all", () =>
        expectQuery({
          contains: { numbers: ["one", "two", "three"] },
        }).toFindNothing())

      it("finds all with empty list", () =>
        expectQuery({ contains: { numbers: [] } }).toContainExactly([
          { numbers: ["one", "two"] },
          { numbers: ["three"] },
        ]))
    })

    describe("notContains", () => {
      it("successfully finds a row", () =>
        expectQuery({ notContains: { numbers: ["one"] } }).toContainExactly([
          { numbers: ["three"] },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({
          notContains: { numbers: ["one", "two", "three"] },
        }).toContainExactly([
          { numbers: ["one", "two"] },
          { numbers: ["three"] },
        ]))

      it("finds all with empty list", () =>
        expectQuery({ notContains: { numbers: [] } }).toContainExactly([
          { numbers: ["one", "two"] },
          { numbers: ["three"] },
        ]))
    })

    describe("containsAny", () => {
      it("successfully finds rows", () =>
        expectQuery({
          containsAny: { numbers: ["one", "two", "three"] },
        }).toContainExactly([
          { numbers: ["one", "two"] },
          { numbers: ["three"] },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ containsAny: { numbers: ["none"] } }).toFindNothing())

      it("finds all with empty list", () =>
        expectQuery({ containsAny: { numbers: [] } }).toContainExactly([
          { numbers: ["one", "two"] },
          { numbers: ["three"] },
        ]))
    })
  })

  describe("bigints", () => {
    const SMALL = "1"
    const MEDIUM = "10000000"

    // Our bigints are int64s in most datasources.
    const BIG = "9223372036854775807"

    beforeAll(async () => {
      await createTable({
        num: { name: "num", type: FieldType.BIGINT },
      })
      await createRows([{ num: SMALL }, { num: MEDIUM }, { num: BIG }])
    })

    describe("equal", () => {
      it("successfully finds a row", () =>
        expectQuery({ equal: { num: SMALL } }).toContainExactly([
          { num: SMALL },
        ]))

      it("successfully finds a big value", () =>
        expectQuery({ equal: { num: BIG } }).toContainExactly([{ num: BIG }]))

      it("fails to find nonexistent row", () =>
        expectQuery({ equal: { num: "2" } }).toFindNothing())
    })

    describe("notEqual", () => {
      it("successfully finds a row", () =>
        expectQuery({ notEqual: { num: SMALL } }).toContainExactly([
          { num: MEDIUM },
          { num: BIG },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ notEqual: { num: 10 } }).toContainExactly([
          { num: SMALL },
          { num: MEDIUM },
          { num: BIG },
        ]))
    })

    describe("oneOf", () => {
      it("successfully finds a row", () =>
        expectQuery({ oneOf: { num: [SMALL] } }).toContainExactly([
          { num: SMALL },
        ]))

      it("successfully finds all rows", () =>
        expectQuery({ oneOf: { num: [SMALL, MEDIUM, BIG] } }).toContainExactly([
          { num: SMALL },
          { num: MEDIUM },
          { num: BIG },
        ]))

      it("fails to find nonexistent row", () =>
        expectQuery({ oneOf: { num: [2] } }).toFindNothing())
    })

    // Range searches against bigints don't seem to work at all in Lucene, and I
    // couldn't figure out why. Given that we're replacing Lucene with SQS,
    // we've decided not to spend time on it.
    !isLucene &&
      describe("range", () => {
        it("successfully finds a row", () =>
          expectQuery({
            range: { num: { low: SMALL, high: "5" } },
          }).toContainExactly([{ num: SMALL }]))

        it("successfully finds multiple rows", () =>
          expectQuery({
            range: { num: { low: SMALL, high: MEDIUM } },
          }).toContainExactly([{ num: SMALL }, { num: MEDIUM }]))

        it("successfully finds a row with a high bound", () =>
          expectQuery({
            range: { num: { low: MEDIUM, high: BIG } },
          }).toContainExactly([{ num: MEDIUM }, { num: BIG }]))

        it("successfully finds no rows", () =>
          expectQuery({
            range: { num: { low: "5", high: "5" } },
          }).toFindNothing())

        it("can search using just a low value", () =>
          expectQuery({
            range: { num: { low: MEDIUM } },
          }).toContainExactly([{ num: MEDIUM }, { num: BIG }]))

        it("can search using just a high value", () =>
          expectQuery({
            range: { num: { high: MEDIUM } },
          }).toContainExactly([{ num: SMALL }, { num: MEDIUM }]))
      })
  })

  isInternal &&
    describe("auto", () => {
      beforeAll(async () => {
        await createTable({
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
        it("successfully finds a row", () =>
          expectQuery({ equal: { auto: 1 } }).toContainExactly([{ auto: 1 }]))

        it("fails to find nonexistent row", () =>
          expectQuery({ equal: { auto: 0 } }).toFindNothing())
      })

      describe("not equal", () => {
        it("successfully finds a row", () =>
          expectQuery({ notEqual: { auto: 1 } }).toContainExactly([
            { auto: 2 },
            { auto: 3 },
            { auto: 4 },
            { auto: 5 },
            { auto: 6 },
            { auto: 7 },
            { auto: 8 },
            { auto: 9 },
            { auto: 10 },
          ]))

        it("fails to find nonexistent row", () =>
          expectQuery({ notEqual: { auto: 0 } }).toContainExactly([
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
          ]))
      })

      describe("oneOf", () => {
        it("successfully finds a row", () =>
          expectQuery({ oneOf: { auto: [1] } }).toContainExactly([{ auto: 1 }]))

        it("fails to find nonexistent row", () =>
          expectQuery({ oneOf: { auto: [0] } }).toFindNothing())
      })

      describe("range", () => {
        it("successfully finds a row", () =>
          expectQuery({
            range: { auto: { low: 1, high: 1 } },
          }).toContainExactly([{ auto: 1 }]))

        it("successfully finds multiple rows", () =>
          expectQuery({
            range: { auto: { low: 1, high: 2 } },
          }).toContainExactly([{ auto: 1 }, { auto: 2 }]))

        it("successfully finds a row with a high bound", () =>
          expectQuery({
            range: { auto: { low: 2, high: 2 } },
          }).toContainExactly([{ auto: 2 }]))

        it("successfully finds no rows", () =>
          expectQuery({
            range: { auto: { low: 0, high: 0 } },
          }).toFindNothing())

        isSqs &&
          it("can search using just a low value", () =>
            expectQuery({
              range: { auto: { low: 9 } },
            }).toContainExactly([{ auto: 9 }, { auto: 10 }]))

        isSqs &&
          it("can search using just a high value", () =>
            expectQuery({
              range: { auto: { high: 2 } },
            }).toContainExactly([{ auto: 1 }, { auto: 2 }]))
      })

      isSqs &&
        describe("sort", () => {
          it("sorts ascending", () =>
            expectSearch({
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
            ]))

          it("sorts descending", () =>
            expectSearch({
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
            ]))
        })
    })
})
